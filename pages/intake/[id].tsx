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
  Checkbox,
  useToast,
} from "@chakra-ui/core"
import { useSession } from "next-auth/client"

import { Layout } from "../../components/Layout"
import { Title } from "../../components/Title"
import { useAirtableRecord, useAirtableRecordUpdate } from "../../lib/hooks"
import { RequesterFields } from "../../schemas/requester"

const IntakePage: React.FC = () => {
  const [session] = useSession()
  const router = useRouter()
  const { id } = router.query
  const toast = useToast()

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

  // fields that can be updated via the form
  const groceryNeedsRef = useRef<HTMLInputElement>()
  // const monday9mrRef = useRef<HTMLInputElement>()
  // const saturday9mrRef = useRef<HTMLInputElement>()
  const waitlist9mrRef = useRef<HTMLInputElement>()
  const newNotesRef = useRef<HTMLTextAreaElement>()

  if (isError)
    return (
      <Layout>
        <Title>Error</Title>
        <Text>{error.message}</Text>
        <Text fontFamily="monospace" my="1em" p="1em" bg="#ff000011" as="pre">
          {JSON.stringify(error.details, null, 2)}
        </Text>
      </Layout>
    )

  if (isLoading)
    return (
      <Layout>
        <Title>Loading Intake Form…</Title>
        <Spinner />
      </Layout>
    )

  return (
    <Layout>
      <Title>Intake Form: {record.fields["First name"]}</Title>
      <Record>
        <SectionName>Contact Info</SectionName>

        <Field>
          <Label>Name</Label>
          <Value>{record.fields["Name"]}</Value>
        </Field>

        <Field>
          <Label>Phone number</Label>
          <Value>{record.fields.Phone}</Value>
        </Field>

        <Field>
          <Label>Email</Label>
          <Value>{record.fields.Email}</Value>
        </Field>

        <Field>
          <Label>Language</Label>
          <Value>{record.fields["Combined languages"]}</Value>
        </Field>

        <Field>
          <Label>Which of these ways are best to get in touch with you?</Label>
          <Value>
            {
              record.fields[
                "Which of these ways are best to get in touch with you?"
              ]
            }
          </Value>
        </Field>

        <SectionName>Household Info</SectionName>

        <Field>
          <Label>Address</Label>
          <Value>{record.fields["Address or cross streets"]}</Value>
        </Field>

        <Field>
          <Label>Neighborhood</Label>
          <Value>{record.fields.NeighborhoodLookup?.[0]}</Value>
        </Field>

        <Field>
          <Label># Adults</Label>
          <Value>{record.fields["# Adults"]}</Value>
        </Field>

        <Field>
          <Label># Children</Label>
          <Value>{record.fields["# Children"]}</Value>
        </Field>

        <Field bottomBorder={false}>
          <Label># Elderly</Label>
          <Value>{record.fields["# Elderly"]}</Value>
        </Field>

        <SectionName>Needs</SectionName>

        <Field>
          <Label>Has grocery needs?</Label>
          <Value>
            <Checkbox
              ref={groceryNeedsRef}
              defaultIsChecked={record.fields["Has grocery needs"]}
            />
          </Value>
        </Field>

        {/* <Field>
          <Label>Monday 9MR Delivery</Label>
          <Value>
            <Checkbox
              ref={monday9mrRef}
              defaultIsChecked={record.fields["Monday 9MR Delivery"]}
            />
          </Value>
        </Field> */}

        {/* <Field>
          <Label>Saturday 9MR Delivery</Label>
          <Value>
            <Checkbox
              ref={saturday9mrRef}
              defaultIsChecked={record.fields["Saturday 9MR Delivery"]}
            />
          </Value>
        </Field> */}

        <Field>
          <Label>9MR Waitlist</Label>
          <Checkbox
            ref={waitlist9mrRef}
            defaultIsChecked={record.fields["9MR wait list"]}
          />
        </Field>

        <Field>
          <Label>Notes</Label>
          <Value long>
            {record.fields["Notes"]?.trim() || <Text color="#ccc">n/a</Text>}
            <Textarea
              ref={newNotesRef}
              my={3}
              maxW="40em"
              placeholder="Add more intake notes"
            ></Textarea>
          </Value>
        </Field>
      </Record>

      <Button
        my={2}
        onClick={async () => {
          const newNotes = newNotesRef.current.value.trim()

          const updatedFields: Partial<RequesterFields> = {}

          updatedFields["Has grocery needs"] = groceryNeedsRef.current.checked
          // updatedFields["Monday 9MR Delivery"] = monday9mrRef.current.checked
          // updatedFields["Saturday 9MR Delivery"] = saturday9mrRef.current.checked
          updatedFields["9MR wait list"] = waitlist9mrRef.current.checked

          if (newNotes.length > 0) {
            newNotesRef.current.value = ""
            const user = session.user.email
            const date = new Date().toLocaleDateString()
            updatedFields["Notes"] = [record.fields["Notes"], newNotes]
              .join(`\n\nOn ${date}, ${user} added:\n\n`)
              .trim()
          }

          try {
            const updatedRecord = await updateRecord(updatedFields)
            mutate(updatedRecord)
            toast({
              title: "Record updated",
              description: "Thanks for adding your updates",
              status: "success",
              duration: 5000,
              isClosable: true,
            })
          } catch (e) {
            toast({
              title: e.message || e.toString(),
              description:
                "The record could not be updated. If this happens again, feel free to post about this in #mutualaid-data",
              status: "error",
              duration: null,
              isClosable: true,
            })
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

const SectionName = ({ children }) => (
  <Heading size="lg" bg="#eee" p="0.5em" my="1em">
    {children}
  </Heading>
)

const Field = ({ children, topBorder = false, bottomBorder = true }) => (
  <>
    {topBorder && <Divider />}
    <Flex flexDirection={["column", "row"]} my={"0.5em"}>
      {children}
    </Flex>
    {bottomBorder && <Divider />}
  </>
)

const Label = ({ children }) => (
  <Text
    flex={["0 0 auto", "0 0 20%"]}
    minWidth={["auto", "12em"]}
    textAlign={["left", "right"]}
    margin={["0", "0 1em 0 0"]}
    color="#999"
  >
    {children}
  </Text>
)

const Value: React.FC<{
  /** Preserve whitespace in long text fields? */
  long?: boolean
}> = ({ children, long = false }) => (
  <Box
    flex="1"
    width="100%"
    fontWeight="600"
    whiteSpace={long ? "pre-wrap" : undefined}
  >
    {children}
  </Box>
)

export default IntakePage
