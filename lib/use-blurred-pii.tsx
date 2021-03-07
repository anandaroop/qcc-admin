import { CSSProperties, createContext, useContext } from "react"

const defaultShouldBlur = false
const BlurredPIIContext = createContext(defaultShouldBlur)

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

interface BlurredPIIOptions {
  color?: string
  blurAmount?: number
  additionalCSS?: CSSProperties
}

const withBlurredPII = (options?: BlurredPIIOptions): CSSProperties => {
  const { color, blurAmount, additionalCSS } = options ?? {}
  const shouldBlurPII = useContext(BlurredPIIContext)

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

interface BlurredPII {
  withBlurredPII: (options?: BlurredPIIOptions) => CSSProperties
}

export const useBlurredPII = (): BlurredPII => {
  return {
    withBlurredPII,
  }
}
