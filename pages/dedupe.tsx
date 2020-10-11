import React, { ReactNode, useEffect } from "react"
import { Text } from "@chakra-ui/core"

import { Title } from "../components/Title"
import { StepButton, StepFeedback, StepProps } from "../components/Steps"
import { Authenticated } from "../components/Authenticated"

/** A list of valid statuses for this multi-step process. Off-brand version of a state machine. */
type Status =
  | "waiting"
  | "finding"
  | "found"
  | "findingError"
  | "updating"
  | "updated"
  | "updatingError"

/**
 * Multi step tool for marking Requesters as dupes (by phone number)
 */
const Dedupe: React.FC = () => {
  const [status, setStatus] = React.useState<Status>("waiting")

  return (
    <Authenticated>
      <Title>Deduper</Title>

      <Text my={4}>
        Use this tool to examine all the Requester records and mark ones that
        share a phone number as "related" to one another.
      </Text>

      <Step1 status={status} setStatus={setStatus} />

      <Step2 status={status} setStatus={setStatus} />
    </Authenticated>
  )
}

/**
 * Step 1: Find the dupes
 */
const Step1: React.FC<StepProps<Status>> = (props) => {
  const { status, setStatus } = props
  const [feedback, setFeedback] = React.useState<ReactNode>("")

  useEffect(() => {
    const performStep = async () => {
      try {
        const headers = { "Content-type": "application/json" }
        const options = { headers }
        const response = await fetch("/api/dedupe", options)
        const json = await response.json()
        const { stats } = json

        const feedback =
          `• Found ${stats.requesterCount} total requesters \n` +
          `• Found ${stats.clusterCount} phone numbers that had multiple requests`

        setFeedback(feedback)
        setStatus("found")
      } catch (e) {
        setFeedback(e.toString())
        setStatus("findingError")
      }
    }

    if (status === "finding") {
      performStep()
    }
  }, [status])

  return (
    <>
      <StepButton
        isDisabled={status !== "waiting"}
        onClick={() => {
          if (status === "waiting") {
            setStatus("finding")
          }
        }}
      >
        Step 1: Find duplicates
      </StepButton>

      <StepFeedback
        isOpen={
          status === "finding" ||
          status === "found" ||
          status === "findingError" ||
          status === "updating" ||
          status === "updated" ||
          status === "updatingError"
        }
        isLoading={status === "finding"}
        isError={status === "findingError"}
      >
        {feedback}
      </StepFeedback>
    </>
  )
}

/**
 * Step 2: Mark the dupes
 */
const Step2: React.FC<StepProps<Status>> = (props) => {
  const { status, setStatus } = props
  const [feedback, setFeedback] = React.useState<ReactNode>("")

  useEffect(() => {
    const updateDuplicates = async () => {
      try {
        const headers = { "Content-type": "application/json" }
        const options = { headers, method: "POST" }
        const response = await fetch("/api/dedupe?update=true", options)
        const json = await response.json()
        const { updated } = json
        const feedback = `• Updated the "Related To" column in ${updated} records`
        setFeedback(feedback)
        setStatus("updated")
      } catch (e) {
        setFeedback(e.toString())
        setStatus("updatingError")
      }
    }

    if (status === "updating") {
      updateDuplicates()
    }
  }, [status])

  return (
    <>
      <StepButton
        isDisabled={status !== "found"}
        onClick={() => {
          if (status === "found") {
            setStatus("updating")
          }
        }}
      >
        Step 2: Mark duplicates
      </StepButton>

      <StepFeedback
        isOpen={
          status === "updating" ||
          status === "updated" ||
          status === "updatingError"
        }
        isLoading={status === "updating"}
        isError={status === "updatingError"}
      >
        {feedback}
      </StepFeedback>
    </>
  )
}

export default Dedupe
