import React from "react"
import Head from "next/head"
import { Heading } from "@chakra-ui/react"

import { PII, BlurredPIIContext } from "../lib/blurred-pii"

interface Props {
  silent?: boolean
  pii?: boolean
}
export const Title: React.FC<Props> = ({
  children,
  silent = false,
  pii = false,
}) => {
  const title = React.Children.toArray(children).join("")
  const shouldBlurPII = React.useContext(BlurredPIIContext)

  return (
    <>
      <Head>
        <title>{pii && shouldBlurPII ? "[redacted]" : title} | QCC</title>
      </Head>

      {!silent && (
        <Heading as="h1" size="xl" py={4}>
          {pii ? <PII blurAmount={20}>{children}</PII> : children}
        </Heading>
      )}
    </>
  )
}
