import React, { useEffect, useRef } from "react"
import {
  Box,
  Flex,
  ListItem,
  ModalBody,
  OrderedList,
  Text,
  UnorderedList,
} from "@chakra-ui/react"
import { decodeGeodata } from "airtable-geojson"
import * as L from "leaflet"
import { OptimizedRoute } from "../../lib/optimized-route"
import { useBlurredPII } from "../../lib/blurred-pii"

interface Props {
  currentOptimizedRoute: OptimizedRoute
}

const RoutingResult: React.FC<Props> = ({ currentOptimizedRoute }) => {
  const { withBlurredPII } = useBlurredPII()

  let startAt: string, endAt: string

  if (currentOptimizedRoute) {
    startAt = currentOptimizedRoute.pickupAddress.split(/,/)[0]
    endAt = decodeGeodata(
      currentOptimizedRoute.driver.fields["Geocode cache"]
    )?.o?.formattedAddress?.replace(/, USA$/, "")
  }

  const mapDiv = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentOptimizedRoute.orderedRecipients.length > 20)
      throw new Error("Holy crap, I can't handle this many stops")

    const map = L.map(mapDiv.current).setView([40.7, -73.85], 11)

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution:
          ' &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }
    ).addTo(map)

    const icons = Array.from({ length: 20 }).map((_, i) =>
      L.divIcon({ className: `my-div-icon my-div-icon-${i}` })
    )

    const latLngs: L.LatLngExpression[] = currentOptimizedRoute.orderedRecipients.map(
      (r) => {
        const {
          o: { lat, lng },
        } = decodeGeodata(r.fields["Geocode cache"])
        return [lat, lng]
      }
    )

    const routeSegments = L.polyline(latLngs, { color: "#00000022", weight: 4 })
    routeSegments.addTo(map)

    const stops = latLngs.map((ll, i) => {
      return L.marker(ll, { icon: icons[i] })
    })
    L.layerGroup(stops).addTo(map)

    const bounds = L.latLngBounds(stops.map((s) => s.getLatLng()))
    map.fitBounds(bounds)
  }, [])

  return (
    <ModalBody>
      <Text my={4}>
        According to Mapquest this is the optimized order for the stops on this
        driver’s list:
      </Text>

      <Flex w="100%" h={"auto"}>
        <Box flex="1">
          <OrderedList>
            <Text color="gray.400">Starting at {startAt}</Text>

            {currentOptimizedRoute.orderedRecipients.map((r) => {
              const recipientAddress = decodeGeodata(
                r.fields["Geocode cache"]
              )?.o?.formattedAddress?.replace(/, USA$/, "")

              return (
                <ListItem key={r.id} my={1}>
                  <Text fontWeight="bold" style={withBlurredPII()}>
                    {r.fields.NameLookup}
                  </Text>
                  <Text color="gray.600" style={withBlurredPII()}>
                    {recipientAddress}
                  </Text>
                </ListItem>
              )
            })}

            <Text color="gray.400">
              Ending at{" "}
              <span style={withBlurredPII({ color: "#A0AEC0" })}>
                {endAt || "?"}
              </span>
            </Text>
            <Text mt={2} color="gray.500" fontSize={12}>
              After pickup, estimated distance/time:{" "}
              {currentOptimizedRoute.stats.distance.toFixed()} mi /{" "}
              {currentOptimizedRoute.stats.formattedTime}
            </Text>
          </OrderedList>
        </Box>
        <Box ref={mapDiv} flex="1" minHeight="30em"></Box>
      </Flex>

      <Text mt={4} color="gray.600">
        <strong>Notes</strong>
      </Text>

      <UnorderedList color="gray.600">
        <ListItem>
          Some adjacent stops might be sitting on top of one another on the map
          above. You can zoom in to try to get a closer look.
        </ListItem>
        <ListItem>
          The line shown on the map is just to make the order clearer; it does
          not indicate the turn-by-turn travel directions.
        </ListItem>
      </UnorderedList>

      <Text my={4}>
        If this route looks reasonable, go ahead and enter this order into
        Airtable. Then reload the route planning app to see the order reflected
        on the big map, and verify that it makes sense.
      </Text>

      <style jsx global>{`
        .my-div-icon {
          color: black;
          font-weight: bold;
          font-size: 1.25rem;
          white-space: nowrap;
          text-shadow: 0 0 3px white, 0 0 2px white, 0 0 1px white;
        }
        .my-div-icon-0::before {
          content: "1";
        }
        .my-div-icon-1::before {
          content: "2";
        }
        .my-div-icon-2::before {
          content: "3";
        }
        .my-div-icon-3::before {
          content: "4";
        }
        .my-div-icon-4::before {
          content: "5";
        }
        .my-div-icon-5::before {
          content: "6";
        }
        .my-div-icon-6::before {
          content: "7";
        }
        .my-div-icon-7::before {
          content: "8";
        }
        .my-div-icon-8::before {
          content: "9";
        }
        .my-div-icon-9::before {
          content: "10";
        }
        .my-div-icon-10::before {
          content: "11";
        }
        .my-div-icon-11::before {
          content: "12";
        }
        .my-div-icon-12::before {
          content: "13";
        }
        .my-div-icon-13::before {
          content: "14";
        }
        .my-div-icon-14::before {
          content: "15";
        }
        .my-div-icon-15::before {
          content: "16";
        }
        .my-div-icon-16::before {
          content: "17";
        }
        .my-div-icon-17::before {
          content: "18";
        }
        .my-div-icon-18::before {
          content: "19";
        }
        .my-div-icon-19::before {
          content: "20";
        }
      `}</style>
    </ModalBody>
  )
}

export default RoutingResult
