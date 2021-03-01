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
} from "@chakra-ui/react"
import { signOut, useSession } from "next-auth/client"

export const Navigation: React.FC = () => {
  const [session] = useSession()

  return (
    <Flex
      direction={["column", "row"]}
      justify="space-between"
      alignItems="baseline"
      h="3rem"
    >
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
              {session.user.name}
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
