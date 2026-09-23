import type {NavigatorScreenParams} from '@react-navigation/native';

export type GuestTab =
  | 'TodayTab'
  | 'FieldsTab'
  | 'WorkTab'
  | 'CalcTab'
  | 'FarmTab';

export type TodayStackParamList = {
  TodayHome: undefined;
  WeatherDetails: undefined;
};

export type FieldsStackParamList = {
  FieldsHome: undefined;
  FieldDetail: {fieldId: string};
  NewField: undefined;
  EditField: {fieldId: string};
};

export type WorkStackParamList = {
  WorkHome: undefined;
  TaskDetail: {taskId: string};
  ActiveWork: {taskId: string};
  CompleteWork: {taskId: string};
  NewTask: undefined;
  WorkCompleted: {taskId: string};
};

export type FarmStackParamList = {
  FarmHome: undefined;
  InventoryItemDetail: {itemId: string};
  NewInventoryItem: undefined;
  EquipmentDetail: {equipmentId: string};
  AddMaintenance: {equipmentId?: string};
  AddIncome: undefined;
  ReportDetail: undefined;
};

export type MainTabParamList = {
  TodayTab: NavigatorScreenParams<TodayStackParamList>;
  FieldsTab: NavigatorScreenParams<FieldsStackParamList>;
  WorkTab: NavigatorScreenParams<WorkStackParamList>;
  CalcTab: undefined;
  FarmTab: NavigatorScreenParams<FarmStackParamList>;
};

export type RootStackParamList = {
  Loader: undefined;
  Onboarding: undefined;
  Main: undefined;
};
