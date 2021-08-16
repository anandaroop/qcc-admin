/* eslint-disable no-irregular-whitespace */
import { useState } from "react"
import { useRouter } from "next/router"
import { Box, Heading, Link, Spinner, Text } from "@chakra-ui/react"
import * as _ from "lodash"

import { DriverFields } from "../../../components/EvangelMap/store/drivers"
import { useAirtableRecord, useAirtableRecords } from "../../../lib/hooks"
import { Layout } from "../../../components/Layout"
import { Title } from "../../../components/Title"
import {
  RecipientFields,
  RecipientRecord,
} from "../../../components/EvangelMap/store/recipients"

const DriverPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.query
  const {
    record: driver,
    error,
    isLoading: isDriverLoading,
    isError: isDriverError,
  } = useAirtableRecord<DriverFields>({
    tableIdOrName: process.env.NEXT_PUBLIC_AIRTABLE_DRIVERS_TABLE_ID,
    recordId: id as string,
  })

  const { records, isLoading, isError } = useAirtableRecords<RecipientFields>({
    tableIdOrName: process.env.NEXT_PUBLIC_AIRTABLE_RECIPIENTS_TABLE_ID,
    view: process.env.NEXT_PUBLIC_AIRTABLE_RECIPIENTS_MAP_VIEW_ID,
  })

  if (isError || isDriverError)
    return (
      <Layout>
        <Title>Error</Title>
        <Text>{error.message}</Text>
        <Text fontFamily="monospace" my="1em" p="1em" bg="#ff000011" as="pre">
          {JSON.stringify(error.details, null, 2)}
        </Text>
      </Layout>
    )

  if (isLoading || isDriverLoading)
    return (
      <Layout>
        <Title>Loading Driver Route…</Title>
        <Spinner />
      </Layout>
    )

  const recipients = records
    .filter((r) => {
      return r.fields.Driver[0] == driver.id
    })
    .sort((a, b) => {
      const aa = a.fields["Suggested order"]
      const bb = b.fields["Suggested order"]
      if (aa < bb) return -1
      if (aa > bb) return 1
      return 0
    })

  return (
    <Layout>
      <Title>Driver Route: {driver.fields.Name}</Title>

      {recipients.map((recipient) => {
        return (
          <Box my={5} key={recipient.id}>
            <Heading size="lg">
              {recipient.fields["Suggested order"]}.{" "}
              {recipient.fields.NameLookup}
            </Heading>

            <Text my={4}>{recipient.fields["Delivery notes"]}</Text>

            <Text my={4}>{recipient.fields["Recipient notes"]}</Text>

            <Text my={4}>{recipient.fields["Dietary restrictions"]}</Text>

            <Link
              href={googleMapsDirectionsUrl(
                recipient.fields["Address (computed)"]
              )}
            >
              <Box background="gray.50" p={4} my={4}>
                <Text fontWeight="bold">
                  🚦🚘 {recipient.fields["Address (computed)"]}
                </Text>
                <Text color="gray.500">
                  {recipient.fields.NeighborhoodLookup}
                </Text>
              </Box>
            </Link>

            <Link href={`tel:${recipient.fields.Phone}`}>
              <Box background="gray.50" p={4} my={4}>
                <Text fontWeight="bold">💬 📞 {recipient.fields.Phone}</Text>
                <Text color="gray.500">{recipient.fields.Language}</Text>
              </Box>
            </Link>

            <LocalStorageToggle recipient={recipient} attr="contacted" />
            <LocalStorageToggle recipient={recipient} attr="reached" />
            <LocalStorageToggle recipient={recipient} attr="delivered" />
          </Box>
        )
      })}
    </Layout>
  )
}

const googleMapsDirectionsUrl = (address: string) => {
  const params = new URLSearchParams({
    api: "1",
    travelmode: "driving",
    destination: [address, "Queens, NY"].join(", "),
  })
  return `https://www.google.com/maps/dir/?${params.toString()}`
}

function generateKey(recipient: RecipientRecord, attributeName: string) {
  const d = new Date()
  return [
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    recipient.id,
    attributeName,
  ].join("-")
}

function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [() => T, (value: T) => void] {
  const getter = (): T => {
    const stringified = window.localStorage.getItem(key)
    if (!stringified) return defaultValue
    return JSON.parse(stringified)
  }

  const setter = (value: T) => {
    const stringified = JSON.stringify(value)
    window.localStorage.setItem(key, stringified)
  }

  return [getter, setter]
}

const LocalStorageToggle: React.FC<{
  recipient: RecipientRecord
  attr: string
}> = ({ recipient, attr }) => {
  const storageKey = generateKey(recipient, attr.toLowerCase().trim())
  const [read, write] = useLocalStorage<boolean>(storageKey, false)
  const [value, setValue] = useState<boolean>(read())

  return (
    <Box
      p={4}
      my={4}
      bg={value ? "green.200" : "gray.100"}
      onClick={() => {
        setValue((prevState) => {
          write(!prevState)
          return !prevState
        })
      }}
    >
      {_.startCase(attr)}? {value ? "Yes" : "No"}
    </Box>
  )
}

export default DriverPage
