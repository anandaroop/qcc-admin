import { useEffect } from "react"
import dynamic from "next/dynamic"
import { Box, Flex } from "@chakra-ui/react"

import { useStoreActions } from "./store"
import { Help } from "./Help"
import { InfoSidebar } from "./InfoSidebar"
import { API } from "../../lib/api"
import { DriverFields } from "./store/drivers"
import { RecipientFields } from "./store/recipients"

const MapWithNoSSR = dynamic(() => import("./Map"), { ssr: false })

interface EvangelMapProps {
  driversViewID: string
  recipientsViewID: string
}

export const EvangelMap: React.FC<EvangelMapProps> = ({
  driversViewID,
  recipientsViewID,
}) => {
  const setAllRecipientItems = useStoreActions(
    (actions) => actions.recipients.setAll
  )
  const setRecipientMetadata = useStoreActions(
    (actions) => actions.recipients.setMetadata
  )
  const setAllDriverItems = useStoreActions((actions) => actions.drivers.setAll)
  const setDriverMetadata = useStoreActions(
    (actions) => actions.drivers.setMetadata
  )

  useEffect(() => {
    async function initialize() {
      const views = await API.fetchMetaRecords()

      // fetch drivers' metadata
      const driversView = views.filter(
        (r) => r.fields["View ID"] == driversViewID // aka Volunteers: Current Delivery Drivers Map
      )[0]
      setDriverMetadata({ data: driversView.fields })

      // fetch driver records
      const driverRecords = await API.fetchRecordsFromView<DriverFields>({
        tableName: driversView.fields["Table name"],
        viewName: driversView.fields["View name"],
        additionalFieldNames: ["Name"],
        primaryFieldName: driversView.fields["Primary field name"],
      })
      setAllDriverItems({ data: driverRecords })

      // fetch recipients' metadata
      const recipientsView = views.filter(
        (r) => r.fields["View ID"] == recipientsViewID // aka Delivery Recipients: Map
      )[0]
      setRecipientMetadata({ data: recipientsView.fields })

      // fetch recipient records
      const recipientRecords = await API.fetchRecordsFromView<RecipientFields>({
        tableName: recipientsView.fields["Table name"],
        viewName: recipientsView.fields["View name"],
        primaryFieldName: recipientsView.fields["Primary field name"],
        additionalFieldNames: [
          "Address (computed)",
          "Confirmed?",
          "Driver",
          "NameLookup",
          "Neighborhood",
          "Delivery notes",
          "Recipient notes",
          "Dietary restrictions",
          "Language",
          "Phone",
          "Suggested order",
        ],
      })
      setAllRecipientItems({ data: recipientRecords })
    }

    initialize()
  }, [])

  return (
    <>
      <Flex direction="row">
        <Box flex="3">
          <MapWithNoSSR />
        </Box>
        <Box flex="1" height="calc(100vh - 5rem)" minW="25em" overflow="scroll">
          <InfoSidebar />
        </Box>
        <Help />
      </Flex>

      <style jsx global>
        {`
           {
            /* * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          h1,
          h2,
          h3,
          p,
          li {
            padding-top: 0.5em;
            padding-bottom: 0.5em;
          }

          ol,
          ul {
            padding-left: 1.5em;
          } */
          }
        `}
      </style>
    </>
  )
}
