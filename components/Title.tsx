import React from "react"
import Head from "next/head"
import { Heading } from "@chakra-ui/react"

interface Props {
  silent?: boolean
}
export const Title: React.FC<Props> = ({ children, silent = false }) => {
  const title = React.Children.toArray(children).join("")
  return (
    <>
      <Head>
        <title>{title} | QCC</title>
      </Head>

      {!silent && (
        <Heading as="h1" size="xl" py={4}>
          {children}
        </Heading>
      )}
    </>
  )
}
