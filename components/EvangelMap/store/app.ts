import { action, Action } from "easy-peasy"
import { OptimizedRoute } from "../../../lib/optimized-route"
import { readFromLocalStorage } from "../../../lib/localStorage"

const defaultPickupLocationIndex = (readFromLocalStorage(
  "pickupLocationIndex"
) || 0) as number

export interface AppModel {
  // STATE

  isHelpVisible: boolean

  isDriverListMinimized: boolean

  currentPickupLocationIndex: number

  currentOptimizedRoute: OptimizedRoute

  isRouteOptimizerVisible: boolean

  // ACTIONS

  showHelp: Action<AppModel>

  hideHelp: Action<AppModel>

  maximizeDriverList: Action<AppModel>

  minimizeDriverList: Action<AppModel>

  setPickupLocationIndex: Action<AppModel, { pickupLocationIndex: number }>

  setCurrentOptimizedRoute: Action<AppModel, { optimizedRoute: OptimizedRoute }>

  clearCurrentOptimizedRoute: Action<AppModel>

  showRouteOptimizer: Action<AppModel>

  hideRouteOptimizer: Action<AppModel>

  // LISTENERS
}

export const appModel: AppModel = {
  // STATE

  isHelpVisible: false,

  isDriverListMinimized: false,

  currentPickupLocationIndex: defaultPickupLocationIndex,

  currentOptimizedRoute: null,

  isRouteOptimizerVisible: false,

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

  setCurrentOptimizedRoute: action((state, payload) => {
    state.currentOptimizedRoute = payload.optimizedRoute
  }),

  clearCurrentOptimizedRoute: action((state) => {
    state.currentOptimizedRoute = null
  }),

  hideRouteOptimizer: action((state) => {
    state.isRouteOptimizerVisible = false
  }),

  showRouteOptimizer: action((state) => {
    state.isRouteOptimizerVisible = true
  }),

  // LISTENERS
}
