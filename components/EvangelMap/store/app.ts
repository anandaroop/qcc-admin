import { action, Action } from "easy-peasy"
import { readFromLocalStorage } from "../../../lib/localStorage"

const defaultPickupLocationIndex = (readFromLocalStorage(
  "pickupLocationIndex"
) || 0) as number

export interface AppModel {
  // STATE

  isHelpVisible: boolean

  isDriverListMinimized: boolean

  currentPickupLocationIndex: number

  // ACTIONS

  showHelp: Action<AppModel>

  hideHelp: Action<AppModel>

  maximizeDriverList: Action<AppModel>

  minimizeDriverList: Action<AppModel>

  setPickupLocationIndex: Action<AppModel, { pickupLocationIndex: number }>

  // LISTENERS
}

export const appModel: AppModel = {
  // STATE

  isHelpVisible: false,

  isDriverListMinimized: false,

  currentPickupLocationIndex: defaultPickupLocationIndex,

  // ACTIONS

  hideHelp: action((state) => {
    state.isHelpVisible = false
  }),

  showHelp: action((state) => {
    state.isHelpVisible = true
  }),

  maximizeDriverList: action((state) => {
    state.isDriverListMinimized = false
  }),

  minimizeDriverList: action((state) => {
    state.isDriverListMinimized = true
  }),

  setPickupLocationIndex: action((state, payload) => {
    state.currentPickupLocationIndex = payload.pickupLocationIndex
  }),

  // LISTENERS
}
