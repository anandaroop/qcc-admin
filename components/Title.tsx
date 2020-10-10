import React from "react"
import Head from "next/head"
import { Heading } from "@chakra-ui/core"

interface Props {
  silent?: boolean
}
export const Title: React.FC<Props> = ({ children, silent = false }) => {
  return (
    <>
      <Head>
        <title>{children} | QCC</title>
      </Head>

      {!silent && (
        <Heading as="h1" size="xl" py={4}>
          {children}
        </Heading>
      )}
    </>
  )
}
