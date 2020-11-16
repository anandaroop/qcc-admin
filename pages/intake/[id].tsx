import React from "react"
import { useRouter } from "next/router"
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/core"

import { Layout } from "../../components/Layout"
import { Title } from "../../components/Title"
import { useAirtableRecord } from "../../lib/hooks"

interface RequesterFields {
  ID: string
  Name: string
  "Has grocery needs": boolean
  Phone: string
  Notes: string
}

const TicketPage: React.FC = () => {
  const router = useRouter()
  const { id } = router.query

  const { record, error, isLoading, isError } = useAirtableRecord<
    RequesterFields
  >({
    tableIdOrName: "Requesters",
    recordId: id as string,
  })

  if (isError)
    return (
      <Layout>
        <Title>Error</Title>
        <Text>{error.message}</Text>
        <Text fontFamily="monospace" my="1em" p="1em" bg="#ff000011">
          <pre>{JSON.stringify(error.details, null, 2)}</pre>
        </Text>
      </Layout>
    )

  if (isLoading)
    return (
      <Layout>
        <Title>Loading Ticket…</Title>
        <Spinner />
      </Layout>
    )

  const {
    fields: { Name: name, "Has grocery needs?": grocery, Phone: phone },
  } = record
  console.log(name, grocery, phone)

  return (
    <Layout>
      <Title>View Ticket</Title>
      <Record>
        <Divider />
        <Field>
          <Label>Name</Label>
          <Value>{record.fields["Name"]}</Value>
        </Field>
        <Divider />
        <Field>
          <Label>Phone</Label>
          <Value>{record.fields["Phone"]}</Value>
        </Field>
        <Divider />
        <Field>
          <Label>Has grocery needs?</Label>
          <Value>{record.fields["Has grocery needs"] ? "Yes" : "No"}</Value>
        </Field>
        <Divider />
        <Field>
          <Label>Notes</Label>
          <Value>{record.fields["Notes"]}</Value>
        </Field>
        <Divider />
      </Record>

      <Heading as="h2" fontSize={24}>
        Complete intake
      </Heading>

      <Text my={2}>Add an intake note</Text>
      <Textarea my={2} maxW="40em"></Textarea>
      <Button
        my={2}
        onClick={async () => {
          alert("would save here...")
        }}
      >
        Submit
      </Button>
    </Layout>
  )
}

const Record = ({ children }) => (
  <Flex flexDirection="column" mb="2em">
    {children}
  </Flex>
)

const Field = ({ children }) => (
  <Flex flexDirection={["column", "row"]} my={"0.5em"}>
    {children}
  </Flex>
)

const Label = ({ children }) => (
  <Text
    flex={["0 0 auto", "0 0 8em"]}
    textAlign={["left", "right"]}
    fontWeight="bold"
    margin={["0", "0 1em 0 0"]}
  >
    {children}
  </Text>
)

const Value = ({ children }) => <Box>{children}</Box>

export default TicketPage
