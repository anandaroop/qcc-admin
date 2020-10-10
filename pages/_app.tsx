/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Head from "next/head"
import { ThemeProvider, CSSReset, Box } from "@chakra-ui/core"
import { Navigation } from "../components/Navigation"

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <CSSReset />
      <Box maxW={1200} minH="100vh" margin="auto" py={5} px={5}>
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <header>
          <nav>
            <Navigation />
          </nav>
        </header>

        <main>
          <Component {...pageProps} />
        </main>

        <footer></footer>
      </Box>
    </ThemeProvider>
  )
}

export default MyApp
