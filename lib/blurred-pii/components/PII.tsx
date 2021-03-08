import * as React from "react"
import { withBlurredPII, BlurredPIIOptions } from "../helpers"

export const PII: React.FC<BlurredPIIOptions & { as?: React.ElementType }> = (
  props
) => {
  const { color, blurAmount, additionalCSS, children } = props
  const htmlElement = props.as ?? "span"

  return React.createElement(
    htmlElement,
    {
      style: withBlurredPII({ color, blurAmount, additionalCSS }),
    },
    children
  )
}
