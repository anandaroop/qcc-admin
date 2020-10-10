import { NextApiRequest, NextApiResponse } from "next"
import Airtable from "airtable"
import { chunk } from "lodash"

/*
 * Import this library only on the server side, since it relies on ENV variables
 * which are not and should not be passed to the client side by NextJS
 */

const { AIRTABLE_API_KEY: apiKey, AIRTABLE_BASE_ID: baseId } = process.env

export const airtable: Airtable = new Airtable({ apiKey })
export const base: Airtable.Base = airtable.base(baseId)

interface RequesterFields {
  Name: string
  Phone: string
  Email: string
  "Last initial": string
  "First name": string
  "Volunteer assigned": string[]
  "Point person": string[]
  "Related To": string[]
  Status: string
  Zipcode: string
  "Unique ID": number
  Created: string
}
type RecipientFieldNames = keyof RequesterFields
type Requesters = Airtable.Records<RequesterFields>

type PhoneNumber = string
type RequesterIds = string[]

const createPhoneNumberRequestersMap = (
  requesters: Requesters
): Map<PhoneNumber, RequesterIds> => {
  const initialMap = new Map<PhoneNumber, RequesterIds>()

  const groups = requesters.reduce((currentMap, record) => {
    const recordId = record.id
    const phoneNumber = record.fields.Phone

    if (currentMap.has(phoneNumber)) {
      currentMap.get(phoneNumber).push(recordId)
    } else {
      currentMap.set(phoneNumber, [recordId])
    }

    return currentMap
  }, initialMap)

  // remove singles & bad data
  for (const [phone, ids] of groups) {
    if (ids.length <= 1) {
      groups.delete(phone)
    } else if (phone === undefined) {
      groups.delete(phone)
    } else if (phone === null) {
      groups.delete(phone)
    } else if (phone === "#ERROR!") {
      groups.delete(phone)
    }
  }

  return groups
}

const getStatistics = (
  requesters: Requesters,
  phoneNumberClusters: Map<PhoneNumber, RequesterIds>
) => {
  const requesterCount = requesters.length
  const clusterCount = phoneNumberClusters.size
  const clusterSizes = Array.from(phoneNumberClusters.values())
    .map((arr: string[]) => arr.length)
    .sort((a, b) => b - a)
  const maxClusterSize = clusterSizes[0]

  return {
    requesterCount,
    clusterCount,
    maxClusterSize,
  }
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const fields: RecipientFieldNames[] = ["Phone", "Related To"]

  const requesters = (await base("Requesters")
    .select({ fields })
    .all()) as Requesters

  const phoneNumberClusters = createPhoneNumberRequestersMap(requesters)

  if (req.method === "GET") {
    /*
     * If GET-ing then just report back some stats for confirmation of the found clusters
     */
    const stats = getStatistics(requesters, phoneNumberClusters)
    const response = { stats }
    res.statusCode = 200
    res.json(response)
  } else if (req.method === "POST") {
    /*
     * If POST-ing we are actually updating based on what we found
     */
    const allUpdates = []
    let n = 0

    const clusters = phoneNumberClusters.values()

    // turn clusters into a list of Airtable updates
    let cluster = clusters.next()
    while (!cluster.done) {
      for (const recordId of cluster.value) {
        allUpdates.push({
          id: recordId,
          fields: {
            "Related To": cluster.value,
          },
        })
        n += 1
      }
      cluster = clusters.next()
    }

    // turn the big list into batches of 10 updates at a time
    const batchUpdates = chunk(allUpdates, 10)
    const updatePromises = batchUpdates.map((batch) =>
      base("Requesters").update(batch)
    )
    await Promise.all(updatePromises)

    res.statusCode = 200
    res.json({ updated: n })
  } else {
    res.statusCode = 400
    res.json("Unrecognized")
  }
}
