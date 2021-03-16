import dynamic from "next/dynamic"
import { useStoreState, useStoreActions } from "./store"
import {
  Box,
  Button,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react"
import { OptimizedRoute } from "../../lib/optimized-route"
import { PII } from "../../lib/blurred-pii"
import { useState } from "react"
import { useAirtableRecordUpdate } from "../../lib/hooks"
import { RecipientFields } from "./store/recipients"

// dynamic import to avoid ssr leaflet error
const RoutingResult = dynamic(() => import("./RoutingResult"), { ssr: false })

export const RouteOptimizer: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const toast = useToast()
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

  const handleUpdate = async () => {
    try {
      setIsUpdating(true)
      const result = await updateAirtableRecords()
      displaySuccessToast(result.length)
    } catch (e) {
      console.error(e)
      displayErrorToast(e)
    } finally {
      setIsUpdating(false)
      teardown()
    }
  }

  const updateAirtableRecords = () => {
    const promisedUpdates = currentOptimizedRoute.orderedRecipients.map(
      (recipient, i) => {
        const { updateRecord } = useAirtableRecordUpdate<RecipientFields>({
          tableIdOrName: "Delivery Recipients", // TODO: id?
          recordId: recipient.id as string,
        })

        return updateRecord({
          "Suggested order": i + 1,
        })
      }
    )

    return Promise.all(promisedUpdates)
  }

  const displaySuccessToast = (updateCount: number) => {
    toast({
      position: "top",
      duration: null,
      title: "Nice!",
      description: (
        <div>
          Updated the suggested order for {updateCount} stops. At this point you
          should{" "}
          <Link
            textDecoration="underline"
            onClick={() => window.location.reload()}
          >
            refresh the window
          </Link>{" "}
          to see the updated results
        </div>
      ),
      status: "success",
    })
  }

  const displayErrorToast = (e: Error) => {
    toast({
      position: "top",
      duration: null,
      title: "Uh-oh",
      description: (
        <div>
          Seems like that didn't work.
          {e.message && <p>{e.message}</p>}
          You can{" "}
          <Link
            textDecoration="underline"
            onClick={() => window.location.reload()}
          >
            refresh the window
          </Link>{" "}
          and try again, to see if that helps.
        </div>
      ),
      status: "error",
    })
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
          <Button variant="ghost" onClick={teardown} mr={3}>
            Cancel
          </Button>

          {currentOptimizedRoute && (
            <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
              Looks good, update Airtable for me
              {isUpdating && <Spinner ml={2} />}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
