import type {NavigatorScreenParams} from '@react-navigation/native';

import type {CalculatorId} from '../data/calculators';

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

export type CalcStackParamList = {
  CalcHome: undefined;
  SeedRate: undefined;
  Fertilizer: undefined;
  SprayMixture: undefined;
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
  CalcTab: NavigatorScreenParams<CalcStackParamList>;
  FarmTab: NavigatorScreenParams<FarmStackParamList>;
};

export type RootStackParamList = {
  Loader: undefined;
  Onboarding: undefined;
  Main: undefined;
};

export const CALCULATOR_ROUTES: Record<
  CalculatorId,
  keyof CalcStackParamList
> = {
  seed: 'SeedRate',
  fertilizer: 'Fertilizer',
  spray: 'SprayMixture',
};
