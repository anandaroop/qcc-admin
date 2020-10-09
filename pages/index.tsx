import Head from "next/head"

import { Heading, Link, Icon, Text } from "@chakra-ui/core"

const Home: React.FC = () => {
  return (
    <div>
      <Head>
        <title>QCC</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Heading as="h1">QCC</Heading>

        <Text>
          <Link href="https://airtable.com" isExternal>
            Go to Airtable <Icon name="external-link" mx="2px" />
          </Link>
        </Text>
      </main>
    </div>
  )
}

export default Home
