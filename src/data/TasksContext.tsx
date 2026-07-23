import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
} from 'react';

import {usePersistedState} from '../hooks/usePersistedState';
import {storageKeys} from './storage';
import type {TodayTask, UpcomingWork} from './today';
import {
  WORK_TASKS,
  type WorkPriority,
  type WorkTask,
} from './work';

/** Demo “today” used across the app */
export const APP_TODAY_KEY = '2026-07-22';

export type NewTaskDraft = {
  title: string;
  workType: string;
  field: string;
  date: string;
  startTime: string;
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
  isDemo: boolean;
  addTask: (draft: NewTaskDraft) => WorkTask;
  getTask: (id: string) => WorkTask | undefined;
  removeTask: (id: string) => void;
  setTaskStatus: (id: string, status: WorkTask['status']) => void;
  completeTask: (id: string, draft: CompleteWorkDraft) => void;
  todayTasks: TodayTask[];
  upcomingWork: UpcomingWork[];
  todayProgress: {
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

function parseDateLabel(label: string): {date: string; dateKey: string} {
  const match = label.trim().match(/^([A-Za-z]+)\s+(\d{1,2})(?:,\s*(\d{4}))?/);
  if (!match) {
    return {date: label.trim(), dateKey: APP_TODAY_KEY};
  }
  const monthName = match[1].slice(0, 3);
  const day = String(Number(match[2])).padStart(2, '0');
  const year = match[3] ?? '2026';
  const month = MONTHS[monthName] ?? '07';
  return {
    date: `${monthName} ${Number(match[2])}`,
    dateKey: `${year}-${month}-${day}`,
  };
}

function toPriority(value: string): WorkPriority {
  return value.trim().toLowerCase() === 'high' ? 'High' : 'Normal';
}

function toTodayTask(task: WorkTask): TodayTask {
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

function parseDurationHours(label: string): number {
  const hours = label.match(/(\d+(?:\.\d+)?)\s*h/i);
  const mins = label.match(/(\d+)\s*m/i);
  return (hours ? Number(hours[1]) : 0) + (mins ? Number(mins[1]) / 60 : 0);
}

function formatDuration(totalHours: number): string {
  if (totalHours <= 0) {
    return '0h';
  }
  const h = Math.floor(totalHours);
  const m = Math.round((totalHours - h) * 60);
  if (h === 0) {
    return `${m}m`;
  }
  if (m === 0) {
    return `${h}h`;
  }
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

function toUpcoming(task: WorkTask): UpcomingWork {
  const [, month = '07', day = '01'] = task.dateKey.split('-');
  const monthIndex = Number(month) - 1;
  return {
    id: task.id,
    day: String(Number(day)),
    month: MONTH_SHORT[monthIndex] ?? 'JUL',
    title: task.title,
    subtitle: `${task.field}${task.workType ? ` · ${task.workType}` : ''}`,
  };
}

function buildTask(draft: NewTaskDraft): WorkTask {
  const {date, dateKey} = parseDateLabel(draft.date);
  return {
    id: `task-${Date.now()}`,
    title: draft.title.trim(),
    workType: draft.workType.trim() || 'General',
    field: draft.field.trim() || 'Field',
    date,
    dateKey,
    time: draft.startTime.trim() || '08:00 AM',
    worker: draft.worker.trim() || 'Unassigned',
    duration: '2h',
    priority: toPriority(draft.priority),
    status: 'planned',
    equipment: draft.equipment.trim() || undefined,
    materials: draft.materials.trim() || undefined,
  };
}

export function TasksProvider({children}: {children: React.ReactNode}) {
  const [userTasks, setUserTasks] = usePersistedState<WorkTask[] | null>(
    storageKeys.tasks,
    null,
  );

  const isDemo = userTasks === null;
  const tasks = userTasks ?? WORK_TASKS;

  const addTask = useCallback(
    (draft: NewTaskDraft) => {
      const task = buildTask(draft);
      setUserTasks(prev => (prev ? [task, ...prev] : [task]));
      return task;
    },
    [setUserTasks],
  );

  const getTask = useCallback(
    (id: string) => tasks.find(task => task.id === id),
    [tasks],
  );

  const removeTask = useCallback(
    (id: string) => {
      setUserTasks(prev => {
        const base = prev ?? WORK_TASKS;
        return base.filter(task => task.id !== id);
      });
    },
    [setUserTasks],
  );

  const setTaskStatus = useCallback(
    (id: string, status: WorkTask['status']) => {
      setUserTasks(prev => {
        const base = prev ?? WORK_TASKS;
        return base.map(task => (task.id === id ? {...task, status} : task));
      });
    },
    [setUserTasks],
  );

  const completeTask = useCallback(
    (id: string, draft: CompleteWorkDraft) => {
      setUserTasks(prev => {
        const base = prev ?? WORK_TASKS;
        return base.map(task => {
          if (task.id !== id) {
            return task;
          }
          const costValue = draft.cost.trim();
          return {
            ...task,
            status: 'done' as const,
            duration: draft.duration.trim() || task.duration,
            cost: costValue ? `$${costValue}` : task.cost,
            notes: draft.notes.trim() || task.notes,
            materials: draft.materialsKg.trim()
              ? `${task.materials?.split(' · ')[0] ?? 'Materials'} · ${draft.materialsKg.trim()} kg`
              : task.materials,
          };
        });
      });
    },
    [setUserTasks],
  );

  const todayTasks = useMemo(
    () =>
      tasks
        .filter(
          task =>
            task.dateKey === APP_TODAY_KEY && task.status !== 'done',
        )
        .map(toTodayTask),
    [tasks],
  );

  const upcomingWork = useMemo(
    () =>
      tasks
        .filter(
          task =>
            task.dateKey > APP_TODAY_KEY && task.status !== 'done',
        )
        .sort((a, b) => a.dateKey.localeCompare(b.dateKey))
        .map(toUpcoming),
    [tasks],
  );

  const todayProgress = useMemo(() => {
    const todays = tasks.filter(task => task.dateKey === APP_TODAY_KEY);
    const done = todays.filter(task => task.status === 'done').length;
    const overdue = todays.filter(task => task.status === 'overdue').length;
    const plannedHours = todays
      .filter(task => task.status !== 'done')
      .reduce((sum, task) => sum + parseDurationHours(task.duration), 0);

    if (isDemo) {
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
      planned: formatDuration(plannedHours),
      overdue,
    };
  }, [isDemo, tasks]);

  const value = useMemo(
    () => ({
      tasks,
      isDemo,
      addTask,
      getTask,
      removeTask,
      setTaskStatus,
      completeTask,
      todayTasks,
      upcomingWork,
      todayProgress,
    }),
    [
      tasks,
      isDemo,
      addTask,
      getTask,
      removeTask,
      setTaskStatus,
      completeTask,
      todayTasks,
      upcomingWork,
      todayProgress,
    ],
  );

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within TasksProvider');
  }
  return context;
}
