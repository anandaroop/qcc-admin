import { Box, Heading, Link, List, ListItem, Text } from "@chakra-ui/react"

import { useStoreState, useStoreActions } from "../EvangelMap/store"

export const Help: React.FC = () => {
  const isHelpVisible = useStoreState((state) => state.app.isHelpVisible)
  const showHelp = useStoreActions((actions) => actions.app.showHelp)
  const hideHelp = useStoreActions((actions) => actions.app.hideHelp)

  return (
    <>
      <Box
        position="absolute"
        left="2em"
        bottom="2em"
        zIndex={1000}
        backgroundColor="#ffffffdd"
        boxShadow="0 0 8px #00000033"
        borderRadius="0.5em"
        lineHeight={1.4}
      >
        {isHelpVisible ? (
          <Box p="1em" w="22em">
            <Toggle onClick={() => hideHelp()}>Close ✕</Toggle>
            <Box maxH="calc(100vh - 10rem - 80px)" overflow="scroll">
              <Heading as="h2" fontSize="24px">
                Airtable Route Planner
              </Heading>
              <Text my={3}>Check out the notes below.</Text>
              <Text my={3}>
                If you still have questions drop em in the the{" "}
                {/* TODO: figure out how to color hyperlinks?! */}
                <Text as="span" textDecoration="underline">
                  <Link href="https://queensdsa.slack.com/archives/C012THPS340">
                    #mutualaid-data-tech
                  </Link>
                </Text>{" "}
                channel
              </Text>
              <Heading as="h3" mt={4} fontSize="18px">
                What this is
              </Heading>
              <Text my={3}>
                This map app provides a friendlier view into the Airtable tables
                we use to manage deliveries.
              </Text>
              <Text my={3}>
                All <em>updates</em> to driving assignments are still made in
                the Airtable interface, but this map interface should make it
                much easier to <em>visualize</em> what drivers are available,
                where they are coming from, which stops are assigned to them,
                which stops still need to be assigned, and so on.
              </Text>
              <Heading as="h3" mt={4} fontSize="18px">
                How to use this
              </Heading>
              <Text my={3}>
                There are basically two different ways to get this done:
              </Text>
              <List
                as="ol"
                pl="1em"
                styleType="decimal"
                stylePosition="outside"
              >
                <ListItem d="list-item" ml={2}>
                  Keep the Airtable{" "}
                  <Text as="span" textDecoration="underline">
                    <Link
                      target="grid"
                      href={`https://airtable.com/${process.env.NEXT_PUBLIC_AIRTABLE_RECIPIENTS_TABLE_ID}/${process.env.NEXT_PUBLIC_AIRTABLE_RECIPIENTS_MAP_VIEW_ID}`}
                    >
                      grid view for this delivery
                    </Link>
                  </Text>{" "}
                  open in another window and make assignments row-by-row in the{" "}
                  <strong>Driver</strong> column. Refresh this map view
                  frequently, to see the current state of the assignments.
                </ListItem>

                <ListItem my={3} ml={2}>
                  Hover over the map markers to see a link to the associated
                  Airtable record. Click through to open that individual record
                  and assign a driver. (You'll have to scroll down to the{" "}
                  <strong>Driver</strong> field.) Refresh this map view
                  frequently, to see the current state of the assignments.
                </ListItem>
              </List>

              <Text my={3}>
                <svg
                  height="20"
                  width="20"
                  style={{ display: "inline", verticalAlign: "middle" }}
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="red"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>{" "}
                Open rings represent drivers.
                <br />
                <br />
                <svg
                  height="20"
                  width="20"
                  style={{ display: "inline", verticalAlign: "middle" }}
                >
                  <circle
                    cx="10"
                    cy="10"
                    r="8"
                    stroke="red"
                    strokeWidth="0"
                    fill="red"
                  />
                </svg>{" "}
                Filled discs represent stops. Stops will be gray until they are
                assigned; then they will be color-coded to match their driver.
              </Text>

              <Text my={3}>
                Once all assignments are done, use the{" "}
                <LilButton>Mapquest</LilButton> buttons to see an optimized
                route for each driver, according to Mapquest. If the route
                information and preview map look reasonable, go ahead and allow
                the tool to update Airtable with the optimized itinerary.
              </Text>

              <Text my={3}>
                If the route looks funky you may need to optimize the route the
                old-fashioned way:
              </Text>

              <Text
                my={3}
                fontSize={14}
                pl={3}
                lineHeight={1.5}
                borderLeft="solid 1px gray"
              >
                Pressing the <LilButton>Mapquest</LilButton> button also copies
                that driver's itinerary to your clipboard, so you can copy a
                driver itinerary into{" "}
                <Text as="span" textDecoration="underline">
                  <Link
                    target="mapquest"
                    href="https://www.mapquest.com/routeplanner/copy-paste"
                  >
                    Mapquest's route optimization tool
                  </Link>
                </Text>
                . Be sure to turn on the "Allow us to re-order stops on your
                route" option before submitting the route, as that's what tells
                Mapquest to come up with the most time/fuel-efficient route. You
                can then populate the "Suggested order" column in the{" "}
                <strong>Delivery Recipients</strong> table to indicate the
                optimized itinerary.
              </Text>

              <Text my={3}>
                Once all itineraries are complete, use the{" "}
                <LilButton>Slack</LilButton> button to copy a driver itinerary
                for pasting into Slack.
              </Text>

              <Heading as="h3" mt={4} fontSize="18px">
                Pre-preparation
              </Heading>

              <Text my={3}>
                If you are about to do route planning, this has probably already
                been done for you, but just in case…
              </Text>

              <Text my={3}>
                These steps need to be performed beforehand, to get the tool set
                up for the next round of deliveries
              </Text>

              <List
                as="ol"
                pl="1em"
                styleType="decimal"
                stylePosition="outside"
              >
                <ListItem my={3}>
                  Change filter on the view{" "}
                  <strong>
                    Volunteers: <em>Current Delivery Drivers Map</em>
                  </strong>{" "}
                  to match the name of the upcoming delivery, e.g. `Evangel -
                  2020-07-07`
                </ListItem>

                <ListItem my={3}>
                  Change filter on the view{" "}
                  <strong>
                    Delivery Recipients: <em>Map</em>
                  </strong>{" "}
                  to match the name of the upcoming delivery, e.g. `Evangel -
                  2020-07-07`
                </ListItem>

                <ListItem my={3}>
                  Double check that the Map App in{" "}
                  <strong>
                    Maps: Coordinated Deliveries &gt;{" "}
                    <em>Delivery Recipients: Map</em>
                  </strong>{" "}
                  is configured correctly (i.e. pulling from the Map view)
                </ListItem>

                <ListItem my={3}>
                  Double check that the Map App in{" "}
                  <strong>
                    Maps: Coordinated Deliveries &gt;{" "}
                    <em>Volunteers: Current Delivery Drivers Map</em>
                  </strong>{" "}
                  is configured correctly (i.e. pulling from the Current
                  Delivery Drivers Map view)
                </ListItem>
              </List>

              <Text my={3}>
                <em>
                  NOTE: Sometimes it seems that simply opening the the Map App
                  configuration is necessary to kick off geocoding of all the
                  recipient records.
                </em>
              </Text>
            </Box>
          </Box>
        ) : (
          <Toggle onClick={() => showHelp()}>Need help?</Toggle>
        )}
      </Box>
    </>
  )
}

const LilButton: React.FC = ({ children }) => (
  <Text
    as="span"
    p="0 0.25em"
    bg="#ffffff33"
    border="solid 1px gray"
    borderRadius="0.25em"
  >
    {children}
  </Text>
)

const Toggle: React.FC<{ onClick: () => void }> = ({ onClick, children }) => (
  <Box
    onClick={onClick}
    color="#e7212f"
    p="1em"
    cursor="pointer"
    textAlign="right"
  >
    {children}
  </Box>
)
