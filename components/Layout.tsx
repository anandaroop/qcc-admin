import { Box } from "@chakra-ui/react"
import { Navigation } from "../components/Navigation"
import { BlurredPIIProvider } from "../lib/blurred-pii"

export const Layout: React.FC = ({ children }) => {
  /* TODO: restore maxW={1200} for default layout */
  return (
    <BlurredPIIProvider shouldBlur={false}>
      <Box minH="100vh" margin="auto" py="1rem" px="1rem">
        <header>
          <nav>
            <Navigation />
          </nav>
        </header>

        <main>{children}</main>

        <footer></footer>
      </Box>
    </BlurredPIIProvider>
  )
}
