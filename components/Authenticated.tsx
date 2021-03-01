import React from "react"
import { Box, Button, Flex, Heading, Spinner, Text } from "@chakra-ui/react"
import { signIn, useSession } from "next-auth/client"

export const Authenticated: React.FC = ({ children }) => {
  const [session, loading] = useSession()

  return (
    <>
      {session && <>{children}</>}

      {loading && <Spinner />}

      {!session && (
        <Box>
          <Flex h="90vh" justify="center" align="center" direction="column">
            <Heading as="h1" mb={3}>
              Queens Care Collective
            </Heading>
            <Button
              onClick={() => {
                signIn()
              }}
            >
              Please sign in to continue…
            </Button>
            <Text pt={4} color="gray.500">
              You will be asked to use your Slack account to sign in to this
              website.
            </Text>
          </Flex>
        </Box>
      )}
    </>
  )
}
