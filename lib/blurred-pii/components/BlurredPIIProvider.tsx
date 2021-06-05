import * as React from "react"
import { BlurredPIIContext } from "../context/BlurredPIIContext"

interface BlurredPIIProviderProps {
  /**
   * When true, any descendant `<PII>` components and `useBlurredPII`
   * hooks will perform the blurring.
   */
  shouldBlur: boolean
}

/**
 * This context provider can be placed in a component tree,
 * and will provide to descendant components the boolean value of its
 * `shouldBlur` prop, thus indicating whether PII should be blurred.
 *
 * Any `<PII>` subcomponents will blur, if necessary.
 *
 * Any components using the `withBlurredPII` CSS helper
 * (via the `useBlurredPII` hook) will also blur, if necessary.
 */
export const BlurredPIIProvider: React.FC<BlurredPIIProviderProps> = ({
  shouldBlur,
  children,
}) => {
  const isCurrentlyBlurred = shouldBlur || shouldForcePIIBlur()
  return (
    <BlurredPIIContext.Provider value={isCurrentlyBlurred}>
      {children}
    </BlurredPIIContext.Provider>
  )
}

/**
 * Check URL for a magic `pii` parameter that will force
 * the blur to be enabled on a specific request
 */
const shouldForcePIIBlur = (): boolean => {
  const urlContainsMagicParam = new URLSearchParams(window.location.search).has(
    "pii"
  )
  return urlContainsMagicParam
}
