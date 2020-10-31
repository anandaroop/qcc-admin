import { createStore, createTypedHooks } from "easy-peasy";

import { appModel, AppModel } from "./app";
import { recipientsModel, RecipientsModel } from "./recipients";
import { driversModel, DriversModel } from "./drivers";

export interface StoreModel {
  app: AppModel;
  recipients: RecipientsModel;
  drivers: DriversModel;
}

const storeModel: StoreModel = {
  app: appModel,
  recipients: recipientsModel,
  drivers: driversModel,
};

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

export const store = createStore(storeModel, { name: "Evangel" });
