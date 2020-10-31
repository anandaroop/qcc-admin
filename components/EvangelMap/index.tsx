import { useEffect } from "react"
import dynamic from "next/dynamic"

import { useStoreActions } from "./store"
import { Help } from "./Help"
import { Container } from "./Container"
import { Box } from "../common"
import { InfoSidebar } from "./InfoSidebar"
import { API } from "../../lib/api"

const MapWithNoSSR = dynamic(() => import("./Map"), { ssr: false })

interface EvangelMapProps {
  driversViewID: string
  recipientsViewID: string
}

export const EvangelMap = ({ driversViewID, recipientsViewID }) => {
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
      const driverRecords = await API.fetchRecordsFromView({
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
      const recipientRecords = await API.fetchRecordsFromView({
        tableName: recipientsView.fields["Table name"],
        viewName: recipientsView.fields["View name"],
        primaryFieldName: recipientsView.fields["Primary field name"],
        additionalFieldNames: [
          "Address (computed)",
          "Confirmed?",
          "Driver",
          "NameLookup",
          "Neighborhood",
          "Notes",
          "Recurring notes",
          "Dietary restrictions",
          "Language",
          "Phone",
          "Whatsapp Only",
        ],
      })
      setAllRecipientItems({ data: recipientRecords })
    }

    initialize()
  }, [])

  return (
    <>
      <Container direction="row">
        <Box flex="3">
          <MapWithNoSSR />
        </Box>
        <Box flex="1">
          <InfoSidebar />
        </Box>
        <Help />
      </Container>

      <style jsx global>
        {`
          * {
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
          }
        `}
      </style>
    </>
  )
}
