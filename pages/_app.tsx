/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Head from "next/head"
import { ChakraProvider } from "@chakra-ui/react"
import { Provider } from "next-auth/client"
import { Authenticated } from "../components/Authenticated"

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <ChakraProvider>
        {/* includes CSS reset */}
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Authenticated>
          <Component {...pageProps} />
        </Authenticated>
      </ChakraProvider>
    </Provider>
  )
}

export default MyApp
