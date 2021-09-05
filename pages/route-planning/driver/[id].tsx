/* eslint-disable no-irregular-whitespace */
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Box, Heading, Link, Spinner, Text } from "@chakra-ui/react"
import * as _ from "lodash"

import {
  DriverFields,
  DriverRecord,
} from "../../../components/EvangelMap/store/drivers"
import { useAirtableRecord, useAirtableRecords } from "../../../lib/hooks"
import { Layout } from "../../../components/Layout"
import { Title } from "../../../components/Title"
import {
  RecipientFields,
  RecipientRecord,
} from "../../../components/EvangelMap/store/recipients"
import { PII } from "../../../lib/blurred-pii"

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
      const orderA = a.fields["Suggested order"] || Number.MAX_VALUE
      const orderB = b.fields["Suggested order"] || Number.MAX_VALUE
      if (orderA < orderB) return -1
      if (orderA > orderB) return 1
      return 0
    })

  return <Itinerary driver={driver} recipients={recipients} />
}

const Itinerary: React.FC<{
  driver: DriverRecord
  recipients: RecipientRecord[]
}> = ({ driver, recipients }) => {
  //  on mount, expire any stale local storage for this app
  useEffect(() => {
    cleanUpLocalStorage(driver, recipients)
  }, [])

  return (
    <Layout>
      <Title pii={true}>{driver.fields.Name}’s Route</Title>

      {recipients.map((recipient) => {
        return (
          <Box my={5} key={recipient.id}>
            <Heading size="lg">
              {recipient.fields["Suggested order"]}.{" "}
              <PII blurAmount={12} color="gray">
                {recipient.fields.NameLookup}
              </PII>
            </Heading>

            {recipient.fields["Delivery notes"] && (
              <Text my={4} color="gray.500">
                📝 <PII color="gray">{recipient.fields["Delivery notes"]}</PII>
              </Text>
            )}

            {recipient.fields["Recipient notes"] && (
              <Text my={4} color="gray.500">
                📝 <PII color="gray">{recipient.fields["Recipient notes"]}</PII>
              </Text>
            )}

            <Text my={4}>{recipient.fields["Dietary restrictions"]}</Text>

            <Link
              href={googleMapsDirectionsUrl(
                recipient.fields["Address (computed)"]
              )}
              _active={{ "text-decoration": "none" }}
              _hover={{ "text-decoration": "none" }}
            >
              <Box background="gray.100" p={4} my={4}>
                <Text fontWeight="bold">
                  🚦🚘{" "}
                  <PII color="gray">
                    {recipient.fields["Address (computed)"]}
                  </PII>
                </Text>
                <Text color="gray.500">
                  {recipient.fields.NeighborhoodLookup}
                </Text>
                <Text mt={2} color="gray.500" fontSize="0.8em">
                  Tap for driving directions.
                </Text>
              </Box>
            </Link>

            <Link
              href={`tel:${recipient.fields.Phone}`}
              _active={{ "text-decoration": "none" }}
              _hover={{ "text-decoration": "none" }}
            >
              <Box background="gray.100" p={4} my={4}>
                <Text fontWeight="bold">
                  💬 📞 <PII color="gray">{recipient.fields.Phone}</PII>
                </Text>
                <Text color="gray.500">{recipient.fields.Language}</Text>
                <Text mt={2} color="gray.500" fontSize="0.8em">
                  Tap to place a call. Long press to send a text.
                </Text>
              </Box>
            </Link>

            <LocalStorageToggle
              driver={driver}
              recipient={recipient}
              attr="contacted"
            />
            <LocalStorageToggle
              driver={driver}
              recipient={recipient}
              attr="reached"
            />
            <LocalStorageToggle
              driver={driver}
              recipient={recipient}
              attr="delivered"
            />
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

function generateKey(
  driver: DriverRecord,
  recipient: RecipientRecord,
  attributeName: string
) {
  const d = new Date()
  return [
    "driver-toggle",
    d.getFullYear(),
    d.getMonth() + 1,
    d.getDate(),
    driver.id,
    attributeName,
    recipient.id,
  ].join("-")
}

const cleanUpLocalStorage = (
  driver: DriverRecord,
  recipients: RecipientRecord[]
) => {
  const attributes = ["contacted", "reached", "delivered"]
  const validKeys: string[] = recipients
    .map((r) => {
      return attributes.map((a) => {
        return generateKey(driver, r, a)
      })
    })
    .flat()

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key.startsWith("driver-toggle") && !validKeys.includes(key)) {
      localStorage.removeItem(key)
    }
  }
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
  driver: DriverRecord
  recipient: RecipientRecord
  attr: string
}> = ({ driver, recipient, attr }) => {
  const storageKey = generateKey(driver, recipient, attr.toLowerCase().trim())
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
