import * as React from "react"
import { BlurredPIIContext } from "../context/BlurredPIIContext"

interface BlurredPIIProviderProps {
  shouldBlur: boolean
}

export const BlurredPIIProvider: React.FC<BlurredPIIProviderProps> = ({
  shouldBlur,
  children,
}) => {
  return (
    <BlurredPIIContext.Provider value={shouldBlur}>
      {children}
    </BlurredPIIContext.Provider>
  )
}
