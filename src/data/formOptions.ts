/** Shared select options for form dropdowns (demo season). */

export const START_TIME_OPTIONS = [
  '06:00 AM',
  '06:30 AM',
  '07:00 AM',
  '07:30 AM',
  '08:00 AM',
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '01:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
] as const;

export const WORK_TYPE_OPTIONS = [
  'Planting',
  'Spraying',
  'Fertilizing',
  'Harvesting',
  'Soil Prep',
  'Irrigation',
  'Transport',
  'Maintenance',
] as const;

export const WORKER_OPTIONS = [
  'Daniel Reed',
  'Chris Miller',
  'Mark Lewis',
  'Emily Stone',
  'Unassigned',
] as const;

export const PRIORITY_OPTIONS = ['Normal', 'High'] as const;

export const FIELD_STATUS_OPTIONS = [
  'Planned',
  'Prepared',
  'Planted',
  'Growing',
  'Ready to Harvest',
  'Harvested',
] as const;
