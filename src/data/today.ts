import {appToday, formatLongDate} from './dates';

export type TaskStatus = 'in_progress' | 'planned' | 'completed';

export type TodayTask = {
  id: string;
  title: string;
  status: TaskStatus;
  location: string;
  time: string;
  assignee?: string;
  equipment?: string;
  priority?: string;
};

export type UpcomingWork = {
  id: string;
  day: string;
  month: string;
  title: string;
  subtitle: string;
};

export type WeatherSnapshot = {
  temp: number;
  condition: string;
  location: string;
  icon: string;
  high: number;
  low: number;
  wind: string;
  rain: string;
  humidity: string;
  feelsLike: number;
};

export type HourlyForecast = {
  id: string;
  label: string;
  icon: string;
  temp: number;
};

export type DayForecast = {
  id: string;
  day: string;
  icon: string;
  rain: string;
  high: number;
  low: number;
};

export type QuickAction = {
  id: string;
  label: string;
  icon: string;
  tint: 'gold' | 'success' | 'danger' | 'info';
};

export const TODAY_HEADER = {
  greeting: 'Good morning',
  get dateLabel() {
    return formatLongDate(appToday());
  },
};

export const TODAY_WEATHER: WeatherSnapshot = {
  temp: 18,
  condition: 'Partly Cloudy',
  location: 'Oakridge Farm',
  icon: '⛅',
  high: 23,
  low: 11,
  wind: '12 km/h',
  rain: '20%',
  humidity: '64%',
  feelsLike: 17,
};

export const TODAY_PROGRESS = {
  done: 3,
  total: 6,
  planned: '5h 20m',
  overdue: 1,
};

export const TODAY_PROGRESS_DONE = {
  done: 6,
  total: 6,
  logged: '5h 20m',
  overdue: 0,
};

export const TODAY_TASKS: TodayTask[] = [
  {
    id: '1',
    title: 'Plant Corn',
    status: 'in_progress',
    location: 'North Field',
    time: '07:30 AM',
    assignee: 'Daniel Reed',
    equipment: 'Tractor T-150',
    priority: 'Normal',
  },
  {
    id: '2',
    title: 'Apply Fertilizer',
    status: 'planned',
    location: 'River Plot',
    time: '11:00 AM',
    assignee: 'Mark Lewis',
    equipment: 'Sprayer UX 4200',
  },
];

export const TODAY_TASKS_COMPLETED: TodayTask[] = [
  {
    id: '1',
    title: 'Plant Corn',
    status: 'completed',
    location: 'North Field',
    time: '07:30 AM',
  },
  {
    id: '2',
    title: 'Apply Fertilizer',
    status: 'completed',
    location: 'River Plot',
    time: '11:00 AM',
  },
];

export const UPCOMING_WORK: UpcomingWork[] = [
  {
    id: '1',
    day: '23',
    month: 'JUL',
    title: 'Planting — South Field',
    subtitle: 'Soybean · ES Mentor',
  },
  {
    id: '2',
    day: '25',
    month: 'JUL',
    title: 'Spray Sunflower',
    subtitle: 'East Field',
  },
  {
    id: '3',
    day: '28',
    month: 'JUL',
    title: 'Harvest Wheat',
    subtitle: 'River Plot',
  },
];

export const QUICK_ACTIONS: QuickAction[] = [
  {id: 'task', label: 'Add Task', icon: '➕', tint: 'gold'},
  {id: 'field', label: 'Add Field', icon: '🗺️', tint: 'success'},
  {id: 'expense', label: 'Add Expense', icon: '💵', tint: 'danger'},
  {id: 'work', label: 'Start Work', icon: '▶️', tint: 'info'},
];

export const HOURLY_FORECAST: HourlyForecast[] = [
  {id: '1', label: 'Now', icon: '⛅', temp: 18},
  {id: '2', label: '1PM', icon: '☀️', temp: 20},
  {id: '3', label: '2PM', icon: '☀️', temp: 21},
  {id: '4', label: '3PM', icon: '⛅', temp: 20},
];

export const WEEK_FORECAST: DayForecast[] = [
  {id: '1', day: 'Today', icon: '⛅', rain: '20%', high: 23, low: 11},
  {id: '2', day: 'Thu', icon: '🌧️', rain: '80%', high: 19, low: 12},
  {id: '3', day: 'Fri', icon: '⛅', rain: '30%', high: 22, low: 13},
];

/** Demo cycle matching Figma: empty → active → completed */
export type TodayDemoMode = 'empty' | 'active' | 'completed';
