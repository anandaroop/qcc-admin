import React from "react"
import { Button } from "@chakra-ui/core"

interface StepButtonProps {
  /**
   * The action that should take place when the button is clicked, usually
   * setting the desired global status for the pseudo state machine.
   */
  onClick: () => void

  /**
   * Whether the button should be disabled or not, e.g. when it is either
   * too early or too late in the state machine for this step to be performed
   */
  isDisabled: boolean
}

/**
 * Acts as a trigger for a step to be performed.
 */
export const StepButton: React.FC<StepButtonProps> = ({
  onClick,
  isDisabled,
  children,
}) => (
  <Button onClick={onClick} my={4} size="lg" isDisabled={isDisabled}>
    {children}
  </Button>
)
