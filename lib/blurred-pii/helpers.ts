import * as React from "react"
import { BlurredPIIContext } from "./context/BlurredPIIContext"

export interface BlurredPIIOptions {
  color?: string
  blurAmount?: number
  additionalCSS?: React.CSSProperties
}

export const withBlurredPII = (
  options?: BlurredPIIOptions
): React.CSSProperties => {
  const { color, blurAmount, additionalCSS } = options ?? {}
  const shouldBlurPII = React.useContext(BlurredPIIContext)

  if (!shouldBlurPII) {
    return additionalCSS ?? {}
  } else {
    return {
      ...(additionalCSS ?? {}),
      color: "transparent",
      textShadow: `0 0 ${blurAmount ?? 8}px ${color ?? "black"}`,
    }
  }
}
