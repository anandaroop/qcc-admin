import React, { useRef } from "react"
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
import { useSession } from "next-auth/client"

import { Layout } from "../../components/Layout"
import { Title } from "../../components/Title"
import { useAirtableRecord, useAirtableRecordUpdate } from "../../lib/hooks"

interface RequesterFields {
  ID: string
  Name: string
  "Has grocery needs": boolean
  Phone: string
  Notes: string
  "Intake Notes": string
}

const IntakePage: React.FC = () => {
  const [session] = useSession()
  const router = useRouter()
  const { id } = router.query

  const { record, error, isLoading, isError, mutate } = useAirtableRecord<
    RequesterFields
  >({
    tableIdOrName: "Requesters",
    recordId: id as string,
  })

  const { updateRecord } = useAirtableRecordUpdate<RequesterFields>({
    tableIdOrName: "Requesters",
    recordId: id as string,
  })

  const newIntakeNotesRef = useRef<HTMLTextAreaElement>()

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
        <Title>Loading Intake…</Title>
        <Spinner />
      </Layout>
    )

  return (
    <Layout>
      <Title>Intake Form</Title>
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
          <Value>
            {record.fields["Notes"]?.trim() || <Text color="#ccc">n/a</Text>}
          </Value>
        </Field>
        <Divider />
        <Field>
          <Label>Intake Notes</Label>
          <Value long>
            {record.fields["Intake Notes"]?.trim() || (
              <Text color="#ccc">n/a</Text>
            )}
          </Value>
        </Field>
        <Divider />
      </Record>

      <Heading size="lg" my={2}>
        Add to intake notes
      </Heading>
      <Textarea
        ref={newIntakeNotesRef}
        my={2}
        maxW="40em"
        placeholder="Intake notes"
      ></Textarea>
      <Button
        my={2}
        onClick={() => {
          const newIntakeNotes = newIntakeNotesRef.current.value.trim()

          if (newIntakeNotes.length > 0) {
            newIntakeNotesRef.current.value = ""
            const user = session.user.email
            const date = new Date().toLocaleDateString()
            const updatedFields = {
              "Intake Notes": [record.fields["Intake Notes"], newIntakeNotes]
                .join(`\n\nOn ${date}, ${user} added:\n\n`)
                .trim(),
            }
            mutate(updateRecord(updatedFields))
          }
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

const Value: React.FC<{
  /** Preserve whitespace in long text fields? */
  long?: boolean
}> = ({ children, long = false }) => (
  <Box whiteSpace={long ? "pre-wrap" : undefined}>{children}</Box>
)

export default IntakePage
