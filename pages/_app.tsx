/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import Head from "next/head"
import { ThemeProvider, CSSReset } from "@chakra-ui/core"
import { Provider } from "next-auth/client"
import { Authenticated } from "../components/Authenticated"

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <ThemeProvider>
        <CSSReset />
        <Head>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Authenticated>
          <Component {...pageProps} />
        </Authenticated>
      </ThemeProvider>
    </Provider>
  )
}

export default MyApp
