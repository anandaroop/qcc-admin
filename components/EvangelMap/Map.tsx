import Head from "next/head";
import { GeoJSON, Map as ReactLeafletMap, TileLayer } from "react-leaflet";
import { CircleMarker } from "leaflet";
import { Feature, Point } from "geojson";

import { useStoreState, useStoreActions } from "./store";
import { RecipientFields } from "./store/recipients";

const Map = () => {
  const recipients = useStoreState((state) => state.recipients);
  const drivers = useStoreState((state) => state.drivers);
  const recipientActions = useStoreActions((actions) => actions.recipients);

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
              feature: Feature<Point, RecipientFields & { recordId: string }>,
              latLng
            ) => {
              const isInvalidGenericPoint = recipients.warnings.genericLatLngs.includes(
                feature.id as string
              );

              if (isInvalidGenericPoint) {
                return null;
              }

              const fillColor = feature.properties["marker-color"] || "gray";

              const marker = new CircleMarker(latLng, {
                radius: 8,
                weight: 1,
                color: "white",
                fillColor,
                fillOpacity: 0.5,
              })
                .bindPopup(airtableHyperlinkFor(feature))
                .on("mouseover", () => marker.openPopup());

              recipientActions.setMarker({
                recordId: feature.id as string,
                marker: marker,
              });

              return marker;
            }}
          />

          <GeoJSON
            data={drivers.geojson}
            pointToLayer={(point: Feature<Point>, latLng) => {
              const color =
                recipients.colorMap[point.id as string] || "gray";

              const marker = new CircleMarker(latLng, {
                color,
                radius: 8,
                weight: 4,
                opacity: 0.75,
                fillColor: "transparent",
              })
                .bindPopup(airtableHyperlinkFor(point))
                .on("mouseover", () => marker.openPopup());

              return marker;
            }}
          />
        </ReactLeafletMap>
      )}

      <style jsx global>
        {`
          .leaflet-container {
            width: 100%;
            height: 100vh;
          }
        `}
      </style>
    </>
  );
};

const airtableHyperlinkFor = (feature: Feature<Point>) => {
  const { recId, viwId, tblId } = feature?.properties?.meta;

  const recordUrl = `https://airtable.com/${tblId}/${viwId}/${recId}`;
  const linkText = feature.properties.meta.title;

  return `<a href="${recordUrl}" target="airtable">${linkText}</a>`;
};

export default Map; // default bc of dynamic import
