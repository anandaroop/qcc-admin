/* eslint-disable no-irregular-whitespace */
import ReactDOM from "react-dom/server"
import Head from "next/head"
import { GeoJSON, Map as ReactLeafletMap, TileLayer } from "react-leaflet"
import { CircleMarker } from "leaflet"
import { Feature, Point } from "geojson"
import { distance, getCoord } from "@turf/turf"
import { Box, Divider } from "@chakra-ui/core"

import { useStoreState, useStoreActions } from "./store"
import { RecipientFields } from "./store/recipients"
import { DriverRecord } from "./store/drivers"
import { AirtableRecordMetadata } from "../../lib/airtable"

const Map: React.FC = () => {
  const recipients = useStoreState((state) => state.recipients)
  const drivers = useStoreState((state) => state.drivers)
  const recipientActions = useStoreActions((actions) => actions.recipients)

  return (
    <>
      <Head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
        />
      </Head>

      {recipients.isColorCoded && (
        <ReactLeafletMap
          center={{ lat: 40.7, lng: -73.85 }}
          zoom={11}
          boxZoom={true}
        >
          <TileLayer
            attribution=' &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <GeoJSON
            data={recipients.geojson}
            pointToLayer={(
              feature: Feature<Point, RecipientFields & AirtableRecordMetadata>,
              latLng
            ) => {
              const isInvalidGenericPoint = recipients.warnings.genericLatLngs.includes(
                feature.id as string
              )

              if (isInvalidGenericPoint) {
                return null
              }

              // look for nearby neighbors to help with clustered points
              const neighbors: Feature<
                Point,
                RecipientFields & AirtableRecordMetadata
              >[] = recipients.geojson.features.filter((f) => {
                if (f.id === feature.id) return false

                const thisPt = getCoord(feature)
                const thatPt = getCoord(f)
                const distanceInMeters = distance(thisPt, thatPt, {
                  units: "meters",
                })

                return distanceInMeters < 20
              })

              const fillColor = feature.properties["marker-color"] || "gray"

              const marker = new CircleMarker(latLng, {
                radius: 8,
                weight: 1,
                color: "white",
                fillColor,
                fillOpacity: 0.5,
              })
                .bindPopup(
                  ReactDOM.renderToString(
                    <PopupContent
                      feature={feature}
                      neighbors={neighbors}
                      drivers={drivers.items}
                    />
                  )
                )
                .on("mouseover", () => marker.openPopup())

              recipientActions.setMarker({
                recordId: feature.id as string,
                marker: marker,
              })

              return marker
            }}
          />

          <GeoJSON
            data={drivers.geojson}
            pointToLayer={(point: Feature<Point>, latLng) => {
              const color = recipients.colorMap[point.id as string] || "gray"

              const marker = new CircleMarker(latLng, {
                color,
                radius: 8,
                weight: 4,
                opacity: 0.75,
                fillColor: "transparent",
              })
                .bindPopup(airtableHyperlinkFor(point))
                .on("mouseover", () => marker.openPopup())

              return marker
            }}
          />
        </ReactLeafletMap>
      )}

      <style jsx global>
        {`
          .leaflet-container {
            width: 100%;
            height: calc(100vh - 5rem);
          }
        `}
      </style>
    </>
  )
}

const airtableHyperlinkFor = (feature: Feature<Point>) => {
  const { recId, viwId, tblId } = feature?.properties?.meta

  const recordUrl = `https://airtable.com/${tblId}/${viwId}/${recId}`
  const linkText = feature.properties.meta.title

  return `<a href="${recordUrl}" target="airtable">${linkText}</a>`
}

export default Map // default bc of dynamic import

const PopupContent: React.FC<{
  feature: Feature<Point, RecipientFields & AirtableRecordMetadata>
  neighbors: Feature<Point, RecipientFields & AirtableRecordMetadata>[]
  drivers: { [recordId: string]: DriverRecord }
}> = ({ feature, neighbors, drivers }) => {
  if (neighbors.length === 0)
    return (
      <AirtableRecordLink
        feature={feature}
        drivers={drivers}
      ></AirtableRecordLink>
    )

  return (
    <Box>
      <AirtableRecordLink
        feature={feature}
        drivers={drivers}
      ></AirtableRecordLink>
      <Divider my={2} borderColor="#999" />
      Other stops at or near this address:
      <Box>
        {neighbors.map((n) => (
          <Box my={1} key={n.id}>
            <AirtableRecordLink
              feature={n}
              drivers={drivers}
            ></AirtableRecordLink>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

const AirtableRecordLink: React.FC<{
  feature: Feature<Point, RecipientFields & AirtableRecordMetadata>
  drivers: { [recordId: string]: DriverRecord }
}> = ({ feature, drivers }) => {
  const { recId, viwId, tblId } = feature?.properties?.meta

  const recipientName = feature.properties.NameLookup?.[0]
  const assignedDriverName =
    drivers[feature.properties.Driver?.[0]]?.fields?.Name
  const suggestedOrder = feature.properties["Suggested order"]

  const recordUrl = `https://airtable.com/${tblId}/${viwId}/${recId}`

  return (
    <a href={recordUrl} target="airtable">
      <strong>{recipientName}</strong>
      {assignedDriverName && (
        <span>
          [ 🚗   {assignedDriverName} {suggestedOrder && `#${suggestedOrder}`}]
        </span>
      )}
      <style jsx>
        {`
        span {
          margin-left: 0.5em;
        `}
      </style>
    </a>
  )
}
