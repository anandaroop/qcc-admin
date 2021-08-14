import { useRouter } from "next/router"
import { Box, Heading, Link, Spinner, Text } from "@chakra-ui/react"

import { DriverFields } from "../../../components/EvangelMap/store/drivers"
import { useAirtableRecord, useAirtableRecords } from "../../../lib/hooks"
import { Layout } from "../../../components/Layout"
import { Title } from "../../../components/Title"
import { RecipientFields } from "../../../components/EvangelMap/store/recipients"

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
                <Text fontWeight="bold">🗣📞 {recipient.fields.Phone}</Text>
                <Text color="gray.500">{recipient.fields.Language}</Text>
              </Box>
            </Link>
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

export default DriverPage