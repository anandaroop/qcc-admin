import dynamic from "next/dynamic"
import { useStoreState, useStoreActions } from "./store"
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react"
import { OptimizedRoute } from "../../lib/optimized-route"
import { PII } from "../../lib/blurred-pii"

// dynamic import to avoid ssr leaflet error
const RoutingResult = dynamic(() => import("./RoutingResult"), { ssr: false })

export const RouteOptimizer: React.FC = () => {
  const { isRouteOptimizerVisible, currentOptimizedRoute } = useStoreState(
    (state) => state.app
  )
  const { hideRouteOptimizer, clearCurrentOptimizedRoute } = useStoreActions(
    (actions) => actions.app
  )

  const teardown = () => {
    hideRouteOptimizer()
    clearCurrentOptimizedRoute()
  }

  return (
    <Modal isOpen={isRouteOptimizerVisible} onClose={teardown}>
      <ModalOverlay />
      <ModalContent minWidth={"60em"}>
        <ModalHeader>
          {currentOptimizedRoute ? (
            <>
              Optimized route for{" "}
              <PII blurAmount={12}>
                {currentOptimizedRoute?.driver?.fields?.Name}
              </PII>
            </>
          ) : (
            "Loading…"
          )}
        </ModalHeader>
        <ModalCloseButton />
        {currentOptimizedRoute ? (
          <RoutingResult
            currentOptimizedRoute={currentOptimizedRoute as OptimizedRoute}
          />
        ) : (
          <ModalBody>
            <Box textAlign="center">
              <Text display="inline-block">
                Loading results from Mapquest…&nbsp;
              </Text>
              <Spinner verticalAlign="middle" />
            </Box>
          </ModalBody>
        )}
        <ModalFooter>
          {/* <Button variant="ghost" onClick={teardown}> Cancel </Button> */}
          <Button colorScheme="blue" mr={3} onClick={teardown}>
            Got it
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
