import React, { useRef, useState } from "react"
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
  RadioGroup,
  Stack,
  Radio,
} from "@chakra-ui/react"
import { useSession } from "next-auth/client"
import { isEqual, pick, pickBy } from "lodash"

import { Layout } from "../../components/Layout"
import { Title } from "../../components/Title"
import { useAirtableRecord, useAirtableRecordUpdate } from "../../lib/hooks"
import { RequesterFields, RequesterStatus } from "../../schemas/requester"

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
  const immediateFoodNeedsRef = useRef<HTMLInputElement>()
  const waitlist9mrRef = useRef<HTMLInputElement>()
  const newNotesRef = useRef<HTMLTextAreaElement>()
  const [currentStatus, setCurrentStatus] = useState<string>()

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
            {record.fields[
              "Which of these ways are best to get in touch with you?"
            ]?.map((t) => (
              <div key={t}>{t}</div>
            ))}
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
              defaultChecked={record.fields["Has grocery needs"]}
            />
          </Value>
        </Field>

        <Field>
          <Label>Needs immediate food delivery?</Label>
          <Value>
            <Checkbox
              ref={immediateFoodNeedsRef}
              defaultChecked={record.fields["Needs immediate food delivery"]}
            />
          </Value>
        </Field>

        <Field>
          <Label>9MR Waitlist</Label>
          <Checkbox
            ref={waitlist9mrRef}
            defaultChecked={record.fields["9MR wait list"]}
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
              display="block"
            ></Textarea>
          </Value>
        </Field>

        {(record.fields?.Status === RequesterStatus.Intake ||
          record.fields?.Status === RequesterStatus.ResolvedAble ||
          record.fields?.Status === RequesterStatus.ResolvedDuplicate) && (
          <>
            <SectionName>Status</SectionName>

            <Field>
              <Label>Current status</Label>
              <Value>
                <RadioGroup
                  defaultValue={record.fields.Status}
                  onChange={(status) => setCurrentStatus(status as string)}
                >
                  <Stack direction="column">
                    <Radio mr={6} value={RequesterStatus.Intake}>
                      {RequesterStatus.Intake}
                    </Radio>
                    <Radio mr={6} value={RequesterStatus.ResolvedAble}>
                      {RequesterStatus.ResolvedAble}
                    </Radio>
                    <Radio mr={6} value={RequesterStatus.ResolvedDuplicate}>
                      {RequesterStatus.ResolvedDuplicate}
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Value>
            </Field>
          </>
        )}
      </Record>

      <Button
        my={2}
        onClick={async () => {
          const updatedFields: Partial<RequesterFields> = {}

          // update simple fields
          updatedFields["Has grocery needs"] = groceryNeedsRef.current.checked
          updatedFields["Needs immediate food delivery"] =
            immediateFoodNeedsRef.current.checked
          updatedFields["9MR wait list"] = waitlist9mrRef.current.checked
          updatedFields.Status = currentStatus

          // append new notes, if any
          const newNotes = newNotesRef.current.value.trim()
          if (newNotes.length > 0) {
            newNotesRef.current.value = ""
            const user = session.user.email
            const date = new Date().toLocaleDateString()
            updatedFields["Notes"] = [record.fields["Notes"], newNotes]
              .join(`\n\nOn ${date}, ${user} added:\n\n`)
              .trim()
          }

          // transition "new" records to "in progress" upon submission,
          // but only if fields are actually changing
          const existingFieldsBeforeUpdate = pick(
            record.fields,
            Object.keys(updatedFields)
          )
          const updatedFieldsWithoutEmpties = pickBy(updatedFields, (value) => {
            // Airtable omits these empties from the API response,
            // so we should as well in order to compare
            return value !== false && value !== null && value !== undefined
          })
          const recordIsChanging = !isEqual(
            existingFieldsBeforeUpdate,
            updatedFieldsWithoutEmpties
          )
          if (
            recordIsChanging &&
            record.fields.Status === "New - Needs intake"
          ) {
            updatedFields["Status"] = "Intake in progress"
          }

          // apply the update
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
