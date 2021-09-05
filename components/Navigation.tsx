import React from "react"
import NextLink from "next/link"
import {
  Button,
  Flex,
  Heading,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react"
import { signOut, useSession } from "next-auth/client"

import { PII } from "../lib/blurred-pii"

export const Navigation: React.FC = () => {
  const [session] = useSession()

  return (
    <Flex justify="space-between" alignItems="baseline" minHeight="3rem">
      <Heading as="h1" size="md" pb={[2, 0]}>
        {/* @ts-ignore */}
        <Link href="/" as={NextLink}>
          Queens Care Collective
        </Link>
      </Heading>

      {session && (
        <Flex>
          <Menu>
            <MenuButton as={Button} variant="outline">
              <Text display={["none", "inline"]}>
                <PII>{session.user.name}</PII>
              </Text>
              <Text display={["inline", "none"]}>👤</Text>
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  signOut()
                }}
              >
                Log out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      )}
    </Flex>
  )
}
