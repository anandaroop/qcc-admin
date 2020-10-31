import { action, Action } from "easy-peasy";

export interface AppModel {
  // STATE

  isHelpVisible: boolean;

  isDriverListMinimized: boolean;

  // ACTIONS

  showHelp: Action<AppModel>;

  hideHelp: Action<AppModel>;

  maximizeDriverList: Action<AppModel>;

  minimizeDriverList: Action<AppModel>;

  // LISTENERS
}

export const appModel: AppModel = {
  // STATE

  isHelpVisible: false,

  isDriverListMinimized: false,

  // ACTIONS

  hideHelp: action((state) => {
    state.isHelpVisible = false;
  }),

  showHelp: action((state) => {
    state.isHelpVisible = true;
  }),

  maximizeDriverList: action((state) => {
    state.isDriverListMinimized = false;
  }),

  minimizeDriverList: action((state) => {
    state.isDriverListMinimized = true;
  }),

  // LISTENERS
};
