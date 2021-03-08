import { CSSProperties, createContext, createElement, useContext } from "react"

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

export const PII: React.FC<BlurredPIIOptions & { as?: React.ElementType }> = (
  props
) => {
  const { color, blurAmount, additionalCSS, children } = props
  const htmlElement = props.as ?? "span"

  return createElement(
    htmlElement,
    {
      style: withBlurredPII({ color, blurAmount, additionalCSS }),
    },
    children
  )
}

interface BlurredPII {
  withBlurredPII: (options?: BlurredPIIOptions) => CSSProperties
}

export const useBlurredPII = (): BlurredPII => {
  return {
    withBlurredPII,
  }
}
