import { useStoreState } from "./store"
import { DriverList } from "./DriverList"
import { UnassignedRecipients } from "./UnassignedRecipients"
import { Warnings } from "./Warnings"
import { Summary } from "./Summary"

export const InfoSidebar = () => {
  const {
    items: recipientItems,
    warnings: { genericLatLngs },
  } = useStoreState((state) => state.recipients)
  const colorMap = useStoreState((state) => state.recipients.colorMap)
  const markerMap = useStoreState((state) => state.recipients.markerMap)

  const driverItems = useStoreState((state) => state.drivers.items)
  const itineraryMap = useStoreState((state) => state.drivers.itineraryMap)

  const unassignedRecipients = Object.values(recipientItems)
    .filter((r) => !r.fields?.Driver?.length)
    .filter((r) => !genericLatLngs.includes(r.id))

  return (
    <>
      <div className="info">
        <Summary />
        <DriverList
          driverItems={driverItems}
          colorMap={colorMap}
          itineraryMap={itineraryMap}
          markerMap={markerMap}
        />
        <Warnings />
        <UnassignedRecipients
          recipients={unassignedRecipients}
          markerMap={markerMap}
        />
      </div>
      <style jsx>{`
        .info {
          width: 100%;
          overflow: scroll;
          padding: 1em;
        }
      `}</style>
    </>
  )
}
