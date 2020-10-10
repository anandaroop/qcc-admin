import React from "react"
import NextLink from "next/link"
import {
  // Box,
  // Button,
  Flex,
  Heading,
  // Icon,
  Link,
  // Menu,
  // MenuButton,
  // MenuItem,
  // MenuList,
} from "@chakra-ui/core"

export const Navigation: React.FC = () => {
  return (
    <Flex
      direction={["column", "row"]}
      justify="space-between"
      alignItems="baseline"
    >
      <Heading as="h1" size="sm" pb={[2, 0]}>
        <Link href="/" as={NextLink}>
          Queens Care Collective
        </Link>
      </Heading>
      {/*
      <Flex>
        <Menu>
          <MenuButton as={Button} rightIcon="chevron-down">
            Shortcuts
          </MenuButton>
          <MenuList>
            <MenuItem>
              <Link href="https://airtable.com" isExternal>
                Airtable <Icon name="external-link" mx="2px" />
              </Link>
            </MenuItem>
            <MenuItem>
              <Link href="https://qdsama-maps.vercel.app/evangel" isExternal>
                Route planning tool <Icon name="external-link" mx="2px" />
              </Link>
            </MenuItem>
          </MenuList>
        </Menu>

        <Box w={2} />

        <Menu>
          <MenuButton as={Button} variantColor="pink">
            Profile
          </MenuButton>
          <MenuList>
            <MenuItem>Log out</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      */}
    </Flex>
  )
}
