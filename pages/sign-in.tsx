import React, { useState } from "react"
import {
  Text,
  Box,
  Radio,
  RadioGroup,
  Button,
  useToast,
  Link,
  Spinner,
} from "@chakra-ui/react"

import { parseISO, format } from "date-fns"

import { Title } from "../components/Title"
import { Layout } from "../components/Layout"
import { useAirtableRecords, useAirtableRecordCreate } from "../lib/hooks"
import { useSession } from "next-auth/client"
import { MeetingFields } from "../schemas/meeting"
import { PII } from "../lib/blurred-pii"

const prettyDate = (date: Date) => {
  return format(date, "eee, PPP")
}

const SignInPage: React.FC = () => {
  const [session, loading] = useSession()
  const { records, isLoading, isError } = useAirtableRecords<MeetingFields>({
    tableIdOrName: "Meetings",
    view: "Current",
  })

  if (isLoading || loading) return <div>...</div>
  if (isError) return <div>oh shit</div>

  return (
    <Layout>
      <Title>Sign-In for {prettyDate(new Date())}</Title>

      <SignInForm
        name={session.user.name}
        email={session.user.email}
        meetings={records}
      />
    </Layout>
  )
}

interface SignInFormProps {
  name: string
  email: string
  meetings: Airtable.Records<MeetingFields>
}

const SignInForm: React.FC<SignInFormProps> = (props) => {
  const { name, email, meetings } = props

  const isOnlyOneMeeting = meetings.length === 1
  const initialSelection = isOnlyOneMeeting ? meetings[0].id : null

  const [meetingId, setMeetingId] = useState<string | number>(initialSelection)

  const { createRecords } = useAirtableRecordCreate<{
    Meeting: string[]
    Attendee: string
  }>({ tableIdOrName: "Attendances" })

  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const toast = useToast()

  const displaySuccessToast = () => {
    toast({
      status: "success",
      position: "top",
      duration: 3000,
      title: "Thanks!",
      description: (
        <div>
          You're signed in. You may close this window now or go to the{" "}
          <Link href="/" textDecoration="underline">
            homepage
          </Link>
          .
        </div>
      ),
      onCloseComplete: () => {
        window.location.assign("/")
      },
    })
  }

  const displayErrorToast = (e: Error) => {
    toast({
      status: "error",
      position: "top",
      duration: null,
      title: "Uh-oh",
      description: (
        <div>
          Seems like that didn't work.
          {e.message && <p>{e.message}</p>}
          You can{" "}
          <Link
            textDecoration="underline"
            onClick={() => window.location.reload()}
          >
            refresh the window
          </Link>{" "}
          and try again, to see if that helps.
        </div>
      ),
    })
  }

  return (
    <Box fontSize="1.5em">
      <Box my={5}>
        <Text color="red.500" fontWeight={700}>
          I am
        </Text>

        <Text as="span" fontWeight="bold">
          <PII blurAmount={15}>{name}</PII>
        </Text>
        <Text as="span" ml={1} color="gray.500">
          (<PII blurAmount={15}>{email}</PII>)
        </Text>
      </Box>

      <Box my={8}>
        <Text color="red.500" fontWeight={700}>
          I am attending {isOnlyOneMeeting ? "" : "(choose one)"}
        </Text>

        <RadioGroup onChange={setMeetingId} value={meetingId}>
          {meetings.map((meeting) => {
            const formattedDate = prettyDate(parseISO(meeting.fields.Date))

            return (
              <Box my={2} key={meeting.id}>
                <Radio
                  size="lg"
                  value={meeting.id}
                  bg="gray.100"
                  display="block"
                >
                  <Text as="span" fontSize="1.25em" fontWeight="bold">
                    {meeting.fields.Group}
                  </Text>
                  <Text as="span" fontSize="1.25em" ml="0.5em">
                    {formattedDate}
                  </Text>
                </Radio>
              </Box>
            )
          })}
        </RadioGroup>

        <Button
          size="lg"
          fontSize="1em"
          my={10}
          isDisabled={!meetingId || isUpdating}
          onClick={async () => {
            try {
              setIsUpdating(true)
              const fields = {
                Meeting: [meetingId as string],
                Attendee: email,
              }
              await createRecords([{ fields }])
              displaySuccessToast()
            } catch (e) {
              console.error(e)
              displayErrorToast(e)
            } finally {
              setIsUpdating(false)
            }
          }}
        >
          Sign in!
          {isUpdating && <Spinner ml={2} />}
        </Button>
      </Box>
    </Box>
  )
}

export default SignInPage
