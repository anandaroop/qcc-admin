import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/client"

import { airtable } from "../../lib/airtable"
import { AirtableRecordParams } from "../../types"

const records = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const session = await getSession({ req })
  if (session) {
    const {
      baseId,
      tableIdOrName,
      recordId,
    } = (req.query as unknown) as AirtableRecordParams

    try {
      const base: Airtable.Base = airtable.base(
        baseId || process.env.AIRTABLE_BASE_ID
      )
      const record = await base(tableIdOrName as string).find(recordId)

      res.statusCode = 200
      res.json(record)
    } catch (error) {
      res.statusCode = error.statusCode || 500
      res.json(error)
    }
  } else {
    res.status(401)
  }
  res.end()
}

export default records
