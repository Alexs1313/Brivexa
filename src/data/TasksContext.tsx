import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';

import {usePersistedState} from '../hooks/usePersistedState';
import {APP_TODAY_KEY} from './dates';
import {storageClaves} from './storage';
import type {TodayTask, UpcomingWork} from './today';
import {
  WORK_TAREAS,
  type WorkPriority,
  type WorkTask,
} from './work';

export {APP_TODAY_KEY};
export type NewTaskDraft = {
  title: string;
  workTipo: string;
  field: string;
  date: string;
  startTiempo: string;
  worker: string;
  priority: string;
  materials: string;
  equipment: string;
};

export type CompleteWorkDraft = {
  duration: string;
  materialsKg: string;
  fuelL: string;
  cost: string;
  notes: string;
};

type TasksContextValue = {
  tasks: WorkTask[];
  isMuestra: boolean;
  addTarea: (draft: NewTaskDraft) => WorkTask;
  getTarea: (id: string) => WorkTask | undefined;
  removeTarea: (id: string) => void;
  setTaskEstado: (id: string, status: WorkTask['status']) => void;
  completeTarea: (id: string, draft: CompleteWorkDraft) => void;
  todayTareas: TodayTask[];
  upcomingTrabajo: UpcomingWork[];
  todayProgreso: {
    done: number;
    total: number;
    planned: string;
    overdue: number;
  };
};

const TasksContext = createContext<TasksContextValue | null>(null);

const MONTHS: Record<string, string> = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12',
};

const MONTH_SHORT = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC',
];

function parseDateEtiqueta(label: string): {date: string; dateClave: string} {
  const match = label.trim().match(/^([A-Za-z]+)\s+(\d{1,2})(?:,\s*(\d{4}))?/);
  if (!match) {
    return {date: label.trim(), dateClave: APP_TODAY_KEY};
  }
  const monthNombre = match[1].slice(0, 3);
  const day = String(Number(match[2])).padStart(2, '0');
  const year = match[3] ?? String(new Date().getFullYear());
  const month = MONTHS[monthNombre] ?? '07';
  return {
    date: `${monthNombre} ${Number(match[2])}`,
    dateClave: `${year}-${month}-${day}`,
  };
}

function toPrioridad(value: string): WorkPriority {
  return value.trim().toLowerCase() === 'high' ? 'High' : 'Normal';
}

function toTodayTarea(task: WorkTask): TodayTask {
  const status: TodayTask['status'] =
    task.status === 'done'
      ? 'completed'
      : task.status === 'in_progress'
        ? 'in_progress'
        : 'planned';

  return {
    id: task.id,
    title: task.title,
    status,
    location: task.field,
    time: task.time,
    assignee: task.worker,
    equipment: task.equipment,
    priority: task.priority,
  };
}

function parseDurationHoras(label: string): number {
  const hours = label.match(/(\d+(?:\.\d+)?)\s*h/i);
  const mins = label.match(/(\d+)\s*m/i);
  return (hours ? Number(hours[1]) : 0) + (mins ? Number(mins[1]) / 60 : 0);
}

function formatDuracion(totalHoras: number): string {
  if (totalHoras <= 0) {
    return '0h';
  }
  const h = Math.floor(totalHoras);
  const m = Math.round((totalHoras - h) * 60);
  if (h === 0) {
    return `${m}m`;
  }
  if (m === 0) {
    return `${h}h`;
  }
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

function toProximo(task: WorkTask): UpcomingWork {
  const [, month = '07', day = '01'] = task.dateClave.split('-');
  const monthIndice = Number(month) - 1;
  return {
    id: task.id,
    day: String(Number(day)),
    month: MONTH_SHORT[monthIndice] ?? 'JUL',
    title: task.title,
    subtitle: `${task.field}${task.workTipo ? ` · ${task.workTipo}` : ''}`,
  };
}

function buildTarea(draft: NewTaskDraft): WorkTask {
  const {date, dateClave} = parseDateEtiqueta(draft.date);
  return {
    id: `task-${Date.now()}`,
    title: draft.title.trim(),
    workTipo: draft.workTipo.trim() || 'General',
    field: draft.field.trim() || 'Field',
    date,
    dateClave,
    time: draft.startTiempo.trim() || '08:00 AM',
    worker: draft.worker.trim() || 'Unassigned',
    duration: '2h',
    priority: toPrioridad(draft.priority),
    status: 'planned',
    equipment: draft.equipment.trim() || undefined,
    materials: draft.materials.trim() || undefined,
  };
}

export function TasksProvider({children}: {children: React.ReactNode}) {
  const [userTareas, setUserTareas] = usePersistedState<WorkTask[] | null>(
    storageClaves.tasks,
    null,
  );

  const isMuestra = userTareas === null;
  const tasks = userTareas ?? WORK_TAREAS;

  const addTarea = useCallback(
    (draft: NewTaskDraft) => {
      const task = buildTarea(draft);
      setUserTareas(prev => (prev ? [task, ...prev] : [task]));
      return task;
    },
    [setUserTareas],
  );

  const getTarea = useCallback(
    (id: string) => tasks.find(task => task.id === id),
    [tasks],
  );

  const removeTarea = useCallback(
    (id: string) => {
      setUserTareas(prev => {
        const base = prev ?? WORK_TAREAS;
        return base.filter(task => task.id !== id);
      });
    },
    [setUserTareas],
  );

  const setTaskEstado = useCallback(
    (id: string, status: WorkTask['status']) => {
      setUserTareas(prev => {
        const base = prev ?? WORK_TAREAS;
        return base.map(task => (task.id === id ? {...task, status} : task));
      });
    },
    [setUserTareas],
  );

  const completeTarea = useCallback(
    (id: string, draft: CompleteWorkDraft) => {
      setUserTareas(prev => {
        const base = prev ?? WORK_TAREAS;
        return base.map(task => {
          if (task.id !== id) {
            return task;
          }
          const costValor = draft.cost.trim();
          return {
            ...task,
            status: 'done' as const,
            duration: draft.duration.trim() || task.duration,
            cost: costValor ? `$${costValor}` : task.cost,
            notes: draft.notes.trim() || task.notes,
            materials: draft.materialsKg.trim()
              ? `${task.materials?.split(' · ')[0] ?? 'Materials'} · ${draft.materialsKg.trim()} kg`
              : task.materials,
          };
        });
      });
    },
    [setUserTareas],
  );

  const todayTareas = useMemo(
    () =>
      tasks
        .filter(
          task =>
            task.dateClave === APP_TODAY_KEY && task.status !== 'done',
        )
        .map(toTodayTarea),
    [tasks],
  );

  const upcomingTrabajo = useMemo(
    () =>
      tasks
        .filter(
          task =>
            task.dateClave > APP_TODAY_KEY && task.status !== 'done',
        )
        .sort((a, b) => a.dateClave.localeCompare(b.dateClave))
        .map(toProximo),
    [tasks],
  );

  const todayProgreso = useMemo(() => {
    const todays = tasks.filter(task => task.dateClave === APP_TODAY_KEY);
    const done = todays.filter(task => task.status === 'done').length;
    const overdue = todays.filter(task => task.status === 'overdue').length;
    const plannedHoras = todays
      .filter(task => task.status !== 'done')
      .reduce((sum, task) => sum + parseDurationHoras(task.duration), 0);

    if (isMuestra) {
      return {
        done: 3,
        total: 6,
        planned: '5h 20m',
        overdue: 1,
      };
    }

    return {
      done,
      total: todays.length,
      planned: formatDuracion(plannedHoras),
      overdue,
    };
  }, [isMuestra, tasks]);

  const value = useMemo(
    () => ({
      tasks,
      isMuestra,
      addTarea,
      getTarea,
      removeTarea,
      setTaskEstado,
      completeTarea,
      todayTareas,
      upcomingTrabajo,
      todayProgreso,
    }),
    [
      tasks,
      isMuestra,
      addTarea,
      getTarea,
      removeTarea,
      setTaskEstado,
      completeTarea,
      todayTareas,
      upcomingTrabajo,
      todayProgreso,
    ],
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export function useTareas() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTareas must be used within TasksProvider');
  }
  return context;
}
