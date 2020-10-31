import {
  action,
  Action,
  actionOn,
  ActionOn,
  computed,
  Computed,
  debug,
  thunk,
  Thunk,
  thunkOn,
  ThunkOn,
} from "easy-peasy";
import { FeatureCollection, Feature, Point } from "geojson";
import { createFeatureCollection } from "airtable-geojson";
import { CircleMarker } from "leaflet";
import { point, distance } from "@turf/turf";

import { MetaFields } from "../../../lib/airtable";
import { StoreModel } from "./index";
import { DriversModel } from "./drivers";
import { driverPalette } from "../../../lib/palette";
import { rootCertificates } from "tls";

export interface RecipientFields {
  /** Name lookup for the linked Request table record */
  NameLookup: string[];

  /** ID of the linked Volunteer table record for this driver */
  Driver: string[];

  /** True if point person has confirmed they want this delivery */
  "Confirmed?": boolean;

  /** Useful notes for driver */
  Notes: string;

  /** Weekly recurring notes, carried over per recipient */
  "Recurring notes": string;

  /** Dietary restrictions driver may need to know about */
  "Dietary restrictions": string;

  /** Recipient's preferred language  */
  Language: string;

  /** ID of the linked Neighborhood table record for this driver */
  Neighborhood: string[];

  /** Phone lookup for the linked Request table record */
  Phone: string[];

  /** WhatsApp lookup for the linked Request table record */
  "Whatsapp Only": boolean[];

  /** Best address */
  "Address (computed)": string;

  /** Geocoded address, encoded */
  "Geocode cache": string;
}

export type RecipientRecord = Airtable.Record<RecipientFields>;

export interface RecipientsModel {
  // STATE

  items: {
    [recordId: string]: RecipientRecord;
  };

  /** Computed tally of assigned/unassigned, etc */
  counts: Computed<
    RecipientsModel,
    {
      assigned: number;
      unassigned: number;
    }
  >;

  /** Warnings for shaky looking data */
  warnings: Computed<
    RecipientsModel,
    {
      missingGeocodes: string[];
      missingLatLngs: string[];
      genericLatLngs: string[];
      unavailableDrivers: string[];
    },
    StoreModel
  >;

  /** Meta info from Airtable's Meta table */
  metadata: MetaFields;

  /** Memoized GeoJSON representation of records */
  geojson: Computed<RecipientsModel, FeatureCollection<Point, RecipientFields>>;

  /** Mapping of driver IDs to colors */
  colorMap: {
    [driverRecordId: string]: string;
  };

  /** Mapping of recipient IDs to instantiated Leaflet markers */
  markerMap: {
    [recordId: string]: CircleMarker;
  };

  /** True if Features have been assigned distinct "marker-color" per driver */
  isColorCoded: boolean;

  // ACTIONS

  /** Set an individual item in the store by key/value */
  set: Action<RecipientsModel, { recordId: string; data: RecipientRecord }>;

  /** Set all items in the store by key/value */
  setAll: Action<RecipientsModel, { data: RecipientRecord[] }>;

  /** Set metadata from Meta table */
  setMetadata: Action<RecipientsModel, { data: MetaFields }>;

  /** Color-code the recipients according to assigned driver */
  colorize: Action<RecipientsModel, { data: DriversModel["items"] }>;

  /** Color-code the recipients according to assigned driver */
  setMarker: Action<
    RecipientsModel,
    { recordId: string; marker: CircleMarker }
  >;

  // LISTENERS

  /** Listen for updates, in order to update itineraries */
  onItineraryUpdate: ThunkOn<RecipientsModel, any, StoreModel>;
}

export const recipientsModel: RecipientsModel = {
  // STATE

  items: {},

  counts: computed((state) => {
    const recipients = Object.values(state.items);
    const total = recipients.length;
    const assigned = recipients.filter((r) => r.fields.Driver?.length > 0)
      .length;
    const unassigned = total - assigned;
    return { assigned, unassigned };
  }),

  warnings: computed(
    [
      // we only care about changes to recipients.items...
      (state) => state.items,
      // ...and drivers.items
      (_state, storeState) => storeState.drivers.items,
    ],
    (recipientItems, driverItems) => {
      const recipients = Object.values(recipientItems);
      const driverIds = Object.values(driverItems).map((d) => d.id);

      let missingGeocodes = [],
        missingLatLngs = [],
        genericLatLngs = [],
        unavailableDrivers = [];

      const GENERIC_LAT_LNG: Feature<Point> = point([-73.79485, 40.72822]);

      if (recipients.length > 0) {
        const [featureCollection, errors] = createFeatureCollection(recipients);
        missingLatLngs = errors.invalidGeocodes.map((r) => r.id);
        missingGeocodes = errors.missingGeocodes.map((r) => r.id);
        featureCollection.features.forEach((feature) => {
          // generic lat lng
          const [lng, lat] = feature.geometry.coordinates;
          const distanceToGenericPoint = distance(
            point([lng, lat]),
            GENERIC_LAT_LNG,
            { units: "meters" }
          );
          if (distanceToGenericPoint < 10) {
            genericLatLngs.push(feature.id);
          }

          // unavailable driver
          const assignedDriverId = feature.properties.Driver?.[0];
          if (assignedDriverId && !driverIds.includes(assignedDriverId)) {
            unavailableDrivers.push(feature.id);
          }
        });
      }

      return {
        missingGeocodes,
        missingLatLngs,
        genericLatLngs,
        unavailableDrivers,
      };
    }
  ),

  metadata: null,

  geojson: computed((state) => {
    const recipients = Object.values(state.items);
    if (recipients.length > 0) {
      const [featureCollection, _errors] = createFeatureCollection(recipients, {
        geocodedFieldName: "Geocode cache",
        decorate: (record: Airtable.Record<RecipientFields>) => ({
          meta: {
            title: record.fields[state.metadata["Primary field name"]],
            tblId: state.metadata["Table ID"],
            viwId: state.metadata["View ID"],
            recId: record.id,
          },
        }),
        colorize: (record: Airtable.Record<RecipientFields>) => {
          const driverId = record.fields.Driver?.[0];
          return state.colorMap[driverId];
        },
      });
      return featureCollection;
    }
  }),

  colorMap: {},

  markerMap: {},

  isColorCoded: false,

  // ACTIONS

  set: action((state, payload) => {
    const { recordId, data } = payload;
    state.items[recordId] = data;
  }),

  setAll: action((state, payload) => {
    const { data } = payload;
    const items = {};
    data.forEach((record) => {
      items[record.id] = record;
    });
    state.items = items;
  }),

  setMetadata: action((state, payload) => {
    const { data } = payload;
    state.metadata = data;
  }),

  colorize: action((state, payload) => {
    const drivers = payload.data;
    const driverIds = Object.keys(drivers);
    const colorMap = driverIds.reduce((acc, val) => {
      acc[val] = driverPalette[driverIds.indexOf(val)];
      return acc;
    }, {});

    state.colorMap = colorMap;
    state.isColorCoded = true;
  }),

  setMarker: action((state, payload) => {
    const { recordId, marker } = payload;
    state.markerMap[recordId] = marker;
  }),

  // LISTENERS
  onItineraryUpdate: thunkOn(
    (_actions, storeActions) => [storeActions.drivers.updateItineraries],
    (actions, _target, { getStoreState }) => {
      const state = getStoreState();
      const drivers = state.drivers.items;

      actions.colorize({ data: drivers });
    }
  ),
};
