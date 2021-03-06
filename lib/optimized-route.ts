import { RecipientRecord } from "../components/EvangelMap/store/recipients"
import { decodeGeodata } from "airtable-geojson"
import { DriverRecord } from "../components/EvangelMap/store/drivers"

/**
 * Represents an optimized routing request
 *
 * https://developer.mapquest.com/documentation/directions-api/optimized-route/post/
 */
export class OptimizedRoute {
  public pickupAddress: string
  private recipients: RecipientRecord[]
  public driver: DriverRecord
  private response: MapquestApiResponse

  /**
   * Factory method that encapsulates the creation of a Mapquest optimized
   * route request, and returns an instance that is ready to use.
   */
  static create = async (
    pickupAddress: string,
    recipients: RecipientRecord[],
    driver: DriverRecord
  ): Promise<OptimizedRoute> => {
    const route = new OptimizedRoute(pickupAddress, recipients, driver)
    await route.fetch()
    return route
  }

  /** Returns the input recipient records, in optimized order */
  public get orderedRecipients(): RecipientRecord[] {
    const recipientSequence = this.locationSequence
      .slice(1, -1) // i.e. the middle bit, without initial pickup and driver's final home stop
      .map((i) => i - 1) // decremented to the correct range
    return recipientSequence.map((idx) => this.recipients[idx])
  }

  public get stats(): Pick<Route, "distance" | "formattedTime"> {
    const {
      route: { distance, formattedTime },
    } = this.response

    return { distance, formattedTime }
  }

  /** Private constructor method, used only by the `create` factory method */
  private constructor(
    pickupAddress: string,
    recipients: RecipientRecord[],
    driver: DriverRecord
  ) {
    this.pickupAddress = pickupAddress
    this.recipients = recipients
    this.driver = driver
  }

  /** Returns an array corresponding to the optimized order of the input recipients */
  private get locationSequence(): number[] {
    return this.response.route.locationSequence
  }

  /** Returns the normalized addresses, using the cached Google geocoder result */
  private get allAddresses(): string[] {
    const recipientAddresses = this.recipients.map(
      (r) => decodeGeodata(r.fields["Geocode cache"]).o.formattedAddress
    )
    const driverAddress = decodeGeodata(this.driver.fields["Geocode cache"]).o
      .formattedAddress
    return [this.pickupAddress, ...recipientAddresses, driverAddress]
  }

  /** Performs the MapQuest API request and stores the result */
  private fetch = async (): Promise<void> => {
    try {
      console.log("Sending", this.allAddresses)
      const url = `http://www.mapquestapi.com/directions/v2/optimizedroute?key=${process.env.NEXT_PUBLIC_MAPQUEST_API_KEY}`
      const options = {
        method: "POST",
        mode: "cors" as RequestMode, // no-cors, *cors, same-origin
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          locations: this.allAddresses,
        }),
      }

      const response: Response = await fetch(url, options)
      const json: MapquestApiResponse = await response.json()
      this.response = json
    } catch (error) {
      console.error({ error })
      throw error
    }
  }
}

interface Route {
  distance: number
  formattedTime: string
  fuelUsed: number
  locations: Location[]
  locationSequence: number[]
  routeError: unknown
}
interface MapquestApiResponse {
  route: Route
}

interface Location {
  /** e.g. "US" */
  adminArea1: string

  /** e.g. "Country" */
  adminArea1Type: string

  /** e.g. "NY" */
  adminArea3: string

  /** e.g. "State" */
  adminArea3Type: string

  /** e.g. "Queens" */
  adminArea4: string

  /** e.g. "County" */
  adminArea4Type: string

  /** e.g. "Queens" */
  adminArea5: string

  /** e.g. "City" */
  adminArea5Type: string

  displayLatLng: {
    lng: number
    lat: number
  }

  dragPoint: boolean

  /** e.g. "ADDRESS" */
  geocodeQuality: string

  /** e.g. "L1AAA" */
  geocodeQualityCode: string

  latLng: {
    lng: number
    lat: number
  }

  /** e.g. "567850" */
  linkId: number

  /** e.g. "11101" */
  postalCode: string

  /** e.g. "L" */
  sideOfStreet: string

  /** e.g. "1337 42nd St" */
  street: string

  /** e.g. "s" */
  type: string
}
