import NextLink from "next/link"
import {
  Text,
  Box,
  Button,
  Flex,
  Icon,
  Heading,
  Spinner,
} from "@chakra-ui/core"
import { signIn, signOut, useSession } from "next-auth/client"
import { Title } from "../components/Title"
import { Authenticated } from "../components/Authenticated"

const Home: React.FC = () => {
  const [session, loading] = useSession()

  return (
    <Authenticated>
      <Title silent>Home</Title>

      <>
        <Heading as="h2" size="xl" my={4}>
          Airtable tools
        </Heading>

        <Text my={4}>
          The following tools aid in managing the Airtable databases
        </Text>

        <Flex flexDir={["column", "row"]} wrap="wrap">
          <CardLink
            title="Route planning"
            href="https://qdsama-maps.vercel.app/evangel"
            external
          >
            <Text>Plan driver routes for Evangel/9MR food deliveries</Text>
          </CardLink>

          <CardLink
            title="Community Fridges"
            href="https://qdsama-maps.vercel.app/fridges"
            external
          >
            <Text>Nothing much to see here yet</Text>
          </CardLink>

          <CardLink title="Dedupe" href="/dedupe">
            <Text>
              Dedupe the Airtable <strong>Requesters</strong> table
            </Text>
          </CardLink>
        </Flex>
      </>
    </Authenticated>
  )
}

interface CardLinkProps {
  title: string
  href: string
  external?: boolean
}

const CardLink: React.FC<CardLinkProps> = ({
  title,
  href,
  children,
  external = false,
}) => {
  return (
    <NextLink href={href} passHref>
      <Box
        as="a"
        border="1px"
        borderColor="red.200"
        flex={["1", "0 0 31%"]}
        mb={4}
        mr={4}
        p={4}
        rounded="md"
        target={external ? "_external" : undefined}
      >
        <Heading size="lg" pb={2}>
          {title} {external && <Icon name="external-link" mx="2px" />}
        </Heading>
        {children}
      </Box>
    </NextLink>
  )
}

export default Home
