import { useStoreState, useStoreActions } from "./store"
import { writeToLocalStorage } from "../../lib/localStorage"
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
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react"

export interface PickupLocation {
  name: string
  address: string
}

export const PICKUP_LOCATIONS: PickupLocation[] = [
  {
    name: "Evangel 1",
    address: "3920 27th St, Long Island City, Queens, NY",
  },
  {
    name: "Evangel 2",
    address: "3921 Crescent St, Long Island City, Queens, NY",
  },
  {
    name: "Connected Chef",
    address: "4909 5th St, Long Island City, Queens NY",
  },
]

export const PickupLocations: React.FC = () => {
  const currentPickupLocationIndex = useStoreState(
    (state) => state.app.currentPickupLocationIndex
  )

  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box mt={2} mb={-1}>
      <Text display="inline-block" color="gray.500" fontSize={14}>
        Current pickup location:{" "}
        {PICKUP_LOCATIONS[currentPickupLocationIndex]?.address?.split(/,/)[0]}
      </Text>
      <Button size="xs" ml={2} onClick={onOpen}>
        Change…
      </Button>
      <PickupLocationModal isOpen={isOpen} onClose={onClose} />
    </Box>
  )
}

const PickupLocationModal = ({ isOpen, onClose }) => {
  const currentPickupLocationIndex = useStoreState(
    (state) => state.app.currentPickupLocationIndex
  )

  const setPickupLocationIndex = useStoreActions(
    (actions) => actions.app.setPickupLocationIndex
  )

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            const form = e.target as HTMLFormElement
            const value = form.elements["pickupLocation"].value
            writeToLocalStorage("pickupLocationIndex", parseInt(value))
            setPickupLocationIndex({ pickupLocationIndex: parseInt(value) })
            onClose()
          }}
        >
          <ModalHeader>Choose pickup location</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text my={4}>
              Choose a pickup location for this delivery project:
            </Text>

            <Stack>
              {PICKUP_LOCATIONS.map((loc, i) => {
                return (
                  <label key={i}>
                    <input
                      type="radio"
                      name="pickupLocation"
                      value={i}
                      defaultChecked={i === currentPickupLocationIndex}
                    />{" "}
                    {loc.address}
                  </label>
                )
              })}
            </Stack>

            <Text my={4} color="gray.500">
              This will be used as the starting location for the optimized
              route.
            </Text>

            <Text my={4} color="gray.500">
              If you don't see the right pickup location listed here drop a note
              in the #data channel to get it added.
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" mr={3} type="submit">
              Update
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
