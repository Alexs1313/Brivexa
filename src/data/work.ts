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

export const WORK_TASKS: WorkTask[] = [
  {
    id: 'plant-corn',
    title: 'Plant Corn',
    workType: 'Planting',
    field: 'North Field',
    date: 'Jul 22',
    dateKey: '2026-07-22',
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
  },
  {
    id: 'soil-prep',
    title: 'Soil Preparation',
    workType: 'Soil Preparation',
    field: 'South Field',
    date: 'Jul 21',
    dateKey: '2026-07-21',
    time: '08:00 AM',
    worker: 'Chris Miller',
    duration: '4h',
    priority: 'High',
    status: 'overdue',
    equipment: 'Amazone UX 4200',
    materials: 'Glyphosate 360 · 30 L',
    cost: '$280',
  },
  {
    id: 'apply-fertilizer',
    title: 'Apply Fertilizer',
    workType: 'Fertilizing',
    field: 'River Plot',
    date: 'Jul 22',
    dateKey: '2026-07-22',
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
  },
  {
    id: 'spray-sunflower',
    title: 'Spray Sunflower',
    workType: 'Crop Protection',
    field: 'East Field',
    date: 'Jul 25',
    dateKey: '2026-07-25',
    time: '09:00 AM',
    worker: 'Emily Stone',
    duration: '3h',
    priority: 'Normal',
    status: 'planned',
  },
  {
    id: 'harvest-wheat',
    title: 'Harvest Wheat',
    workType: 'Harvesting',
    field: 'River Plot',
    date: 'Jul 28',
    dateKey: '2026-07-28',
    time: '06:30 AM',
    worker: 'Daniel Reed',
    duration: '6h',
    priority: 'High',
    status: 'planned',
  },
  {
    id: 'inspect-east',
    title: 'Field Inspection',
    workType: 'Inspection',
    field: 'East Field',
    date: 'Jul 23',
    dateKey: '2026-07-23',
    time: '10:00 AM',
    worker: 'Emily Stone',
    duration: '1h',
    priority: 'Normal',
    status: 'planned',
  },
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

/** Calendar markers for July 2026 */
export const CALENDAR_DOTS: Record<
  number,
  'overdue' | 'gold' | 'info'
> = {
  21: 'overdue',
  23: 'gold',
  25: 'info',
  28: 'gold',
};
