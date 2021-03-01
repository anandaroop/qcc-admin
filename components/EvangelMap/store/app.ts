import { action, Action } from "easy-peasy"

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

  currentPickupLocationIndex: 1,

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
