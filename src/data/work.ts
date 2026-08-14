import {
  addDias,
  appHoy,
  formatShortFecha,
  toDateClave,
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
  workTipo: string;
  field: string;
  date: string;
  dateClave: string; // YYYY-MM-DD for calendar
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

export const WORK_FILTROS = ['All', 'Today', 'Upcoming', 'Overdue'] as const;

function demoTarea(
  partial: Omit<WorkTask, 'date' | 'dateClave'> & {dayDesfase: number},
): WorkTask {
  const {dayDesfase, ...rest} = partial;
  const date = addDias(appHoy(), dayDesfase);
  return {
    ...rest,
    date: formatShortFecha(date),
    dateClave: toDateClave(date),
  };
}

/** Demo tasks anchored to nearby dates relative to today */
export const WORK_TAREAS: WorkTask[] = [
  demoTarea({
    id: 'plant-corn',
    title: 'Plant Corn',
    workTipo: 'Planting',
    field: 'North Field',
    dayDesfase: 0,
    time: '07:30 AM',
    worker: 'Daniel Reed',
    duration: '3h',
    priority: 'Normal',
    status: 'in_progress',
    equipment: 'Tractor T-150',
    materials: 'Corn Grain · 340 kg',
    cost: '$320',
    notes:
      'Check planting depth calibration before starting. Confirm moisture levels are within target range.',
  }),
  demoTarea({
    id: 'soil-prep',
    title: 'Soil Preparation',
    workTipo: 'Soil Preparation',
    field: 'South Field',
    dayDesfase: -1,
    time: '08:00 AM',
    worker: 'Chris Miller',
    duration: '4h',
    priority: 'High',
    status: 'overdue',
    equipment: 'Amazone UX 4200',
    materials: 'Glyphosate 360 · 30 L',
    cost: '$280',
  }),
  demoTarea({
    id: 'apply-fertilizer',
    title: 'Apply Fertilizer',
    workTipo: 'Fertilizing',
    field: 'River Plot',
    dayDesfase: 0,
    time: '11:00 AM',
    worker: 'Mark Lewis',
    duration: '2h',
    priority: 'Normal',
    status: 'planned',
    equipment: 'Sprayer UX 4200',
    materials: 'NPK · 240 kg',
    cost: '$320',
    notes:
      'Check planting depth calibration before starting. Confirm moisture levels are within target range.',
  }),
  demoTarea({
    id: 'spray-sunflower',
    title: 'Spray Sunflower',
    workTipo: 'Crop Protection',
    field: 'East Field',
    dayDesfase: 3,
    time: '09:00 AM',
    worker: 'Emily Stone',
    duration: '3h',
    priority: 'Normal',
    status: 'planned',
  }),
  demoTarea({
    id: 'harvest-wheat',
    title: 'Harvest Wheat',
    workTipo: 'Harvesting',
    field: 'River Plot',
    dayDesfase: 6,
    time: '06:30 AM',
    worker: 'Daniel Reed',
    duration: '6h',
    priority: 'High',
    status: 'planned',
  }),
  demoTarea({
    id: 'inspect-east',
    title: 'Field Inspection',
    workTipo: 'Inspection',
    field: 'East Field',
    dayDesfase: 1,
    time: '10:00 AM',
    worker: 'Emily Stone',
    duration: '1h',
    priority: 'Normal',
    status: 'planned',
  }),
];

export function getWorkTarea(id: string): WorkTask | undefined {
  return WORK_TAREAS.find(task => task.id === id);
}

export function workEstadisticas(tasks: WorkTask[]) {
  return {
    planned: tasks.filter(t => t.status === 'planned').length,
    active: tasks.filter(t => t.status === 'in_progress').length,
    done: tasks.filter(t => t.status === 'done').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
  };
}

export function statusEtiqueta(status: WorkTaskStatus) {
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
export function calendarDotsForMes(
  tasks: WorkTask[],
  year: number,
  monthIndice: number,
): Record<number, CalendarDotTone> {
  const prefix = `${year}-${String(monthIndice + 1).padStart(2, '0')}-`;
  const dots: Record<number, CalendarDotTone> = {};

  for (const task of tasks) {
    if (!task.dateClave.startsWith(prefix)) {
      continue;
    }
    const day = Number(task.dateClave.slice(-2));
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
