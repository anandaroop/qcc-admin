export { StepButton } from "./StepButton"
export { StepFeedback } from "./StepFeedback"

export interface StepProps<T> {
  status: T
  setStatus: (status: T) => void
}
