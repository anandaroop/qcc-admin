/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ThemeProvider } from "@chakra-ui/core"

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
