import React from "react"
import { Box, Collapse, Spinner, Text } from "@chakra-ui/react"

interface StepFeedbackProps {
  /**
   * Whether the collapsible component should be expanded
   */
  isOpen: boolean

  /**
   * Whether the step is currently being performed (and should show a spinner)
   */
  isLoading: boolean

  /**
   * Whether performing the step resulted in an error
   */
  isError: boolean
}

/**
 * Allows for the results of a step to be displayed once available.
 */
export const StepFeedback: React.FC<StepFeedbackProps> = ({
  isOpen,
  isLoading,
  isError,
  children,
}) => (
  <Collapse in={isOpen}>
    <Box bg={isError ? "red.100" : "gray.100"} p={4} whiteSpace="pre">
      {isLoading ? <Spinner /> : <Text fontFamily="monospace">{children}</Text>}
    </Box>
  </Collapse>
)
