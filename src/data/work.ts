import {
  addDays,
  appToday,
  formatShortDate,
  toDateKey,
} from './dates';

export type WorkTaskStatus =
  | 'planned'
  | 'in_progress'
  | 'done'
  | 'overdue';

export type WorkPriority = 'Normal' | 'High';

export type WorkTask = {
  id: string;
  title: string;
  workType: string;
  field: string;
  date: string;
  dateKey: string; // YYYY-MM-DD for calendar
  time: string;
  worker: string;
  duration: string;
  priority: WorkPriority;
  status: WorkTaskStatus;
  equipment?: string;
  materials?: string;
  cost?: string;
  notes?: string;
};

export const WORK_FILTERS = ['All', 'Today', 'Upcoming', 'Overdue'] as const;

function demoTask(
  partial: Omit<WorkTask, 'date' | 'dateKey'> & {dayOffset: number},
): WorkTask {
  const {dayOffset, ...rest} = partial;
  const date = addDays(appToday(), dayOffset);
  return {
    ...rest,
    date: formatShortDate(date),
    dateKey: toDateKey(date),
  };
}

/** Demo tasks anchored to nearby dates relative to today */
export const WORK_TASKS: WorkTask[] = [
  demoTask({
    id: 'plant-corn',
    title: 'Plant Corn',
    workType: 'Planting',
    field: 'North Field',
    dayOffset: 0,
    time: '07:30 AM',
    worker: 'Daniel Reed',
    duration: '3h',
    priority: 'Normal',
    status: 'in_progress',
    equipment: 'Tractor T-150',
    materials: 'Corn Seed · 340 kg',
    cost: '$320',
    notes:
      'Check seed depth calibration before starting. Confirm moisture levels are within target range.',
  }),
  demoTask({
    id: 'soil-prep',
    title: 'Soil Preparation',
    workType: 'Soil Preparation',
    field: 'South Field',
    dayOffset: -1,
    time: '08:00 AM',
    worker: 'Chris Miller',
    duration: '4h',
    priority: 'High',
    status: 'overdue',
    equipment: 'Amazone UX 4200',
    materials: 'Glyphosate 360 · 30 L',
    cost: '$280',
  }),
  demoTask({
    id: 'apply-fertilizer',
    title: 'Apply Fertilizer',
    workType: 'Fertilizing',
    field: 'River Plot',
    dayOffset: 0,
    time: '11:00 AM',
    worker: 'Mark Lewis',
    duration: '2h',
    priority: 'Normal',
    status: 'planned',
    equipment: 'Sprayer UX 4200',
    materials: 'NPK · 240 kg',
    cost: '$320',
    notes:
      'Check seed depth calibration before starting. Confirm moisture levels are within target range.',
  }),
  demoTask({
    id: 'spray-sunflower',
    title: 'Spray Sunflower',
    workType: 'Crop Protection',
    field: 'East Field',
    dayOffset: 3,
    time: '09:00 AM',
    worker: 'Emily Stone',
    duration: '3h',
    priority: 'Normal',
    status: 'planned',
  }),
  demoTask({
    id: 'harvest-wheat',
    title: 'Harvest Wheat',
    workType: 'Harvesting',
    field: 'River Plot',
    dayOffset: 6,
    time: '06:30 AM',
    worker: 'Daniel Reed',
    duration: '6h',
    priority: 'High',
    status: 'planned',
  }),
  demoTask({
    id: 'inspect-east',
    title: 'Field Inspection',
    workType: 'Inspection',
    field: 'East Field',
    dayOffset: 1,
    time: '10:00 AM',
    worker: 'Emily Stone',
    duration: '1h',
    priority: 'Normal',
    status: 'planned',
  }),
];

export function getWorkTask(id: string): WorkTask | undefined {
  return WORK_TASKS.find(task => task.id === id);
}

export function workStats(tasks: WorkTask[]) {
  return {
    planned: tasks.filter(t => t.status === 'planned').length,
    active: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
  };
}

export function statusLabel(status: WorkTaskStatus) {
  if (status === 'in_progress') {
    return 'In Progress';
  }
  if (status === 'overdue') {
    return 'Overdue';
  }
  if (status === 'done') {
    return 'Done';
  }
  return 'Planned';
}

export type CalendarDotTone = 'overdue' | 'gold' | 'info';

/** Build calendar day markers from tasks in the given month */
export function calendarDotsForMonth(
  tasks: WorkTask[],
  year: number,
  monthIndex: number,
): Record<number, CalendarDotTone> {
  const prefix = `${year}-${String(monthIndex + 1).padStart(2, '0')}-`;
  const dots: Record<number, CalendarDotTone> = {};

  for (const task of tasks) {
    if (!task.dateKey.startsWith(prefix)) {
      continue;
    }
    const day = Number(task.dateKey.slice(-2));
    const tone: CalendarDotTone =
      task.status === 'overdue'
        ? 'overdue'
        : task.status === 'in_progress' || task.priority === 'High'
          ? 'gold'
          : 'info';

    const existing = dots[day];
    if (
      !existing ||
      (tone === 'overdue' && existing !== 'overdue') ||
      (tone === 'gold' && existing === 'info')
    ) {
      dots[day] = tone;
    }
  }

  return dots;
}
