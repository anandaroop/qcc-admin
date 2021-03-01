import { Box } from "@chakra-ui/react"
import { Navigation } from "../components/Navigation"

export const Layout: React.FC = ({ children }) => {
  /* TODO: restore maxW={1200} for default layout */
  return (
    <Box minH="100vh" margin="auto" py="1rem" px="1rem">
      <header>
        <nav>
          <Navigation />
        </nav>
      </header>

      <main>{children}</main>

      <footer></footer>
    </Box>
  )
}
