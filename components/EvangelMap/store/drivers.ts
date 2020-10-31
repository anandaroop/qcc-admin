import {
  action,
  Action,
  computed,
  Computed,
  thunkOn,
  ThunkOn,
} from "easy-peasy";
import { FeatureCollection, Point } from "geojson";
import { createFeatureCollection } from "airtable-geojson";

import { MetaFields } from "../../../lib/airtable";
import { StoreModel } from "./index";
import { RecipientRecord } from "./recipients";

interface DriverFields {
  Name: string;

  /** Geocoded address, encoded */
  "Geocode cache": string;
}

export type DriverRecord = Airtable.Record<DriverFields>;

export interface DriversModel {
  // STATE

  items: {
    [recordId: string]: DriverRecord;
  };

  itineraryMap: {
    [recordId: string]: RecipientRecord[];
  };

  /** Meta info from Airtable's Meta table */
  metadata: MetaFields;

  /** Memoized GeoJSON representation of records */
  geojson: Computed<DriversModel, FeatureCollection<Point, DriverFields>>;

  // ACTIONS

  /** Set an individual item in the store by key/value */
  set: Action<DriversModel, { recordId: string; data: DriverRecord }>;

  /** Set all items in the store by key/value */
  setAll: Action<DriversModel, { data: DriverRecord[] }>;

  /** Set metadata from Meta table */
  setMetadata: Action<DriversModel, { data: MetaFields }>;

  /** Recalculate routes based on Recipient/Driver data */
  updateItineraries: Action<DriversModel, { data: RecipientRecord[] }>;

  // LISTENERS

  /** Listen for updates, in order to update itineraries */
  onRecipientOrDriverUpdate: ThunkOn<DriversModel, any, StoreModel>;
}

export const driversModel: DriversModel = {
  // STATE

  items: {},

  itineraryMap: {},

  metadata: null,

  geojson: computed((state) => {
    const drivers = Object.values(state.items);
    if (drivers.length > 0) {
      const [featureCollection, _errors] = createFeatureCollection(drivers, {
        geocodedFieldName: "Geocode cache",
        decorate: (record: Airtable.Record<DriverFields>) => ({
          meta: {
            title: record.fields[state.metadata["Primary field name"]],
            tblId: state.metadata["Table ID"],
            viwId: state.metadata["View ID"],
            recId: record.id
          }
        }),
      });
      return featureCollection;
    }
  }),

  // ACTIONS

  set: action((state, payload) => {
    const { recordId, data } = payload;
    state.items[recordId] = data;
  }),

  setAll: action((state, payload) => {
    const { data } = payload;
    data.forEach((record) => {
      state.items[record.id] = record;
    });
  }),

  setMetadata: action((state, payload) => {
    const { data } = payload;
    state.metadata = data;
  }),

  updateItineraries: action((state, payload) => {
    const recipients = payload.data;
    recipients.forEach((recipient) => {
      if (recipient.fields.Driver?.length) {
        const driverId = recipient.fields.Driver[0];
        state.itineraryMap[driverId] = state.itineraryMap[driverId] || [];
        state.itineraryMap[driverId].push(recipient);
      }
    });
  }),

  // LISTENERS

  onRecipientOrDriverUpdate: thunkOn(
    (_actions, storeActions) => [
      storeActions.recipients.set,
      storeActions.recipients.setAll,
      storeActions.drivers.set,
      storeActions.drivers.setAll,
    ],
    (actions, _target, { getStoreState }) => {
      const state = getStoreState();
      const drivers = Object.values(state.drivers.items);
      const recipients = Object.values(state.recipients.items);

      if (drivers.length > 0 && recipients.length > 0) {
        actions.updateItineraries({ data: recipients });
      }
    }
  ),
};
