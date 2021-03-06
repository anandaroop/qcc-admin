import { useStoreState, useStoreActions } from "./store"
import { decodeGeodata } from "airtable-geojson"
import {
  Box,
  Button,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  OrderedList,
  Spinner,
  Text,
} from "@chakra-ui/react"

export const RouteOptimizer: React.FC = () => {
  const { isRouteOptimizerVisible, currentOptimizedRoute } = useStoreState(
    (state) => state.app
  )
  const { hideRouteOptimizer, clearCurrentOptimizedRoute } = useStoreActions(
    (actions) => actions.app
  )

  let startAt: string, endAt: string

  if (currentOptimizedRoute) {
    startAt = currentOptimizedRoute.pickupAddress.split(/,/)[0]
    endAt = decodeGeodata(
      currentOptimizedRoute.driver.fields["Geocode cache"]
    )?.o?.formattedAddress?.replace(/, USA$/, "")
  }

  const teardown = () => {
    hideRouteOptimizer()
    clearCurrentOptimizedRoute()
  }

  return (
    <Modal isOpen={isRouteOptimizerVisible} onClose={teardown}>
      <ModalOverlay />
      <ModalContent minWidth={"40em"}>
        <ModalHeader>
          {currentOptimizedRoute
            ? `Optimized route for ${currentOptimizedRoute?.driver?.fields?.Name}`
            : "Loading…"}
        </ModalHeader>
        <ModalCloseButton />
        {currentOptimizedRoute ? (
          <ModalBody>
            <Text my={4}>
              According to Mapquest this is the optimized order for the stops on
              this driver's list — starting with the pickup location, continuing
              through all the stops, and ending at the driver's home location:
            </Text>

            <OrderedList>
              <Text color="gray.400">Starting at {startAt}</Text>

              {currentOptimizedRoute.orderedRecipients.map((r) => {
                const recipientAddress = decodeGeodata(
                  r.fields["Geocode cache"]
                )?.o?.formattedAddress?.replace(/, USA$/, "")

                return (
                  <ListItem key={r.id} my={1}>
                    <Text fontWeight="bold">{r.fields.NameLookup}</Text>
                    <Text color="gray.600">{recipientAddress}</Text>
                  </ListItem>
                )
              })}

              <Text color="gray.400">Ending at {endAt || "?"}</Text>
              <Text mt={2} color="gray.500" fontSize={12}>
                After pickup, estimated:{" "}
                {currentOptimizedRoute.stats.distance.toFixed()} mi /{" "}
                {currentOptimizedRoute.stats.formattedTime}
              </Text>
            </OrderedList>

            <Text my={4}>
              If this looks reasonable, go ahead and enter this order into
              Airtable. Then reload the route planning page to see the order
              reflected on the big map, and verify that it makes sense.
            </Text>
          </ModalBody>
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
