import NextLink from "next/link"
import { Text, Box, Flex, Icon, Heading } from "@chakra-ui/core"
import { Title } from "../components/Title"
import { Layout } from "../components/Layout"

const Home: React.FC = () => {
  return (
    <Layout>
      <Title silent>Home</Title>

      <Heading as="h2" size="xl" my={4}>
        Airtable tools
      </Heading>

      <Text my={4}>
        The following tools aid in managing the Airtable databases
      </Text>

      <Flex flexDir={["column", "row"]} wrap="wrap">
        <CardLink
          title="Route planning"
          href="/route-planning"
          disableClientSideNavigation
        >
          <Text>Plan driver routes for Evangel/9MR food deliveries</Text>
        </CardLink>

        <CardLink
          title="Community Fridges"
          href="https://community-fridges.vercel.app/"
          external
        >
          <Text>Based on the list of fridges we manage in Airtable</Text>
        </CardLink>

        <CardLink title="Dedupe" href="/dedupe">
          <Text>
            Dedupe the Airtable <strong>Requesters</strong> table
          </Text>
        </CardLink>
      </Flex>
    </Layout>
  )
}

interface CardLinkProps {
  title: string
  href: string
  external?: boolean
  disableClientSideNavigation?: boolean
}

const CardLink: React.FC<CardLinkProps> = ({
  title,
  href,
  children,
  external = false,
  disableClientSideNavigation = false,
}) => {
  const link = (
    <a href={href} target={external ? "_external" : undefined}>
      <Box
        border="1px"
        borderColor="red.200"
        flex={["1", "0 0 31%"]}
        mb={4}
        mr={4}
        p={4}
        rounded="md"
      >
        <Heading size="lg" pb={2}>
          {title} {external && <Icon name="external-link" mx="2px" />}
        </Heading>
        {children}
      </Box>
    </a>
  )

  if (disableClientSideNavigation) {
    return link
  } else {
    return (
      <NextLink href={href} passHref>
        {link}
      </NextLink>
    )
  }
}

export default Home
