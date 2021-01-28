import NextLink from "next/link"
import { Text, Box, Flex, Icon, Heading } from "@chakra-ui/core"
import { Title } from "../components/Title"
import { Layout } from "../components/Layout"

const Home: React.FC = () => {
  return (
    <Layout>
      <Title silent>Home</Title>

      <SectionHeading>Quick links</SectionHeading>

      <Text my={5}>
        Shortcuts to some common destinations when doing QCC work
      </Text>

      <Flex flexDir={["column", "column", "row"]} wrap="wrap">
        <CardLink
          title="Sign-in"
          href={process.env.NEXT_PUBLIC_SIGN_IN_FORM_URL}
          external
        >
          <Text>
            Fill out this form when attending, for example, all-hands meetings.
          </Text>
        </CardLink>

        <CardLink
          title="Request Access"
          href={process.env.NEXT_PUBLIC_REQUEST_ACCESS_FORM_URL}
          external
        >
          <Text>
            Fill out this form to request access to one of our systems or
            accounts, e.g. Airtable, social media accounts, financial trackers.
          </Text>
        </CardLink>

        <CardLink
          title="Google Drive"
          href="https://drive.google.com/drive/folders/0AHz3nJDdbh9EUk9PVA"
          external
        >
          <Text>
            Home for shared documents, including archive of agendas and minutes
          </Text>
        </CardLink>
      </Flex>

      <SectionHeading>Airtable tools</SectionHeading>

      <Text my={5}>Tools that aid in managing the Airtable databases</Text>

      <Flex flexDir={["column", "column", "row"]} wrap="wrap">
        <CardLink
          title="Route planning"
          href="/route-planning"
          disableClientSideNavigation
        >
          <Text>Plan driver routes for 9MR/TCC food deliveries</Text>
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
            Dedupe the Airtable <strong>Requesters</strong> table. (This also
            gets executed automatically, approximately once per hour.)
          </Text>
        </CardLink>
      </Flex>

      <Box mt={10} width={["95%", "95%", "91%"]}>
        <SectionHeading>Calendar of public events</SectionHeading>

        <iframe
          src="https://calendar.google.com/calendar/embed?height=600&amp;wkst=1&amp;bgcolor=%23ffffff&amp;ctz=America%2FNew_York&amp;src=N21ob3E1ZjJsaTh1YmhsNmdmN2hrYWU4NWNAZ3JvdXAuY2FsZW5kYXIuZ29vZ2xlLmNvbQ&amp;color=%23F09300&amp;showPrint=0&amp;showTitle=0&amp;showCalendars=0&amp;showTz=0"
          width="100%"
          height="500px"
          scrolling="no"
        ></iframe>
      </Box>
    </Layout>
  )
}

const SectionHeading: React.FC = ({ children }) => (
  <Heading as="h2" size="xl" my={5} color="red.500">
    {children}
  </Heading>
)

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
        backgroundColor="red.500"
        color="white"
        w={["98%", "98%", "29vw"]}
        minH="8rem"
        mb={4}
        mr={4}
        p={4}
        rounded="md"
        boxShadow="0 5px 5px hsla(0, 0%, 0%, 0.15)"
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
