import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useGranja} from '../../data/FarmContext';
import {useTareas} from '../../data/TasksContext';
import {ActiveWorkScreen} from '../../screens/ActiveWorkScreen';
import {CompleteWorkScreen} from '../../screens/CompleteWorkScreen';
import {NewTaskScreen} from '../../screens/NewTaskScreen';
import {TaskDetailScreen} from '../../screens/TaskDetailScreen';
import {WorkCompletedScreen} from '../../screens/WorkCompletedScreen';
import {WorkScreen} from '../../screens/WorkScreen';
import type {WorkStackParamList} from '../types';

const Stack = createNativeStackNavigator<WorkStackParamList>();

const screenOptions = {
  headerShown: false,
  animation: 'slide_from_right' as const,
  contentStyle: {backgroundColor: '#1a1140'},
};

function parseDurationHoras(label: string): number {
  const hours = label.match(/(\d+(?:\.\d+)?)\s*h/i);
  const mins = label.match(/(\d+)\s*m/i);
  return (hours ? Number(hours[1]) : 0) + (mins ? Number(mins[1]) / 60 : 0);
}

function WorkHomeScreen({
  navigation,
}: NativeStackScreenProps<WorkStackParamList, 'WorkHome'>) {
  return (
    <WorkScreen
      onOpenTarea={taskId => navigation.navigate('TaskDetail', {taskId})}
      onAddTarea={() => navigation.navigate('NewTask')}
    />
  );
}

function TaskDetailRoute({
  navigation,
  route,
}: NativeStackScreenProps<WorkStackParamList, 'TaskDetail'>) {
  const {removeTarea} = useTareas();
  const {taskId} = route.params;
  return (
    <TaskDetailScreen
      taskId={taskId}
      onBack={() => navigation.goBack()}
      onStartTrabajo={() => navigation.navigate('ActiveWork', {taskId})}
      onEdit={() => navigation.navigate('NewTask')}
      onDelete={() => {
        removeTarea(taskId);
        navigation.goBack();
      }}
    />
  );
}

function ActiveWorkRoute({
  navigation,
  route,
}: NativeStackScreenProps<WorkStackParamList, 'ActiveWork'>) {
  const {setTaskEstado} = useTareas();
  const {taskId} = route.params;

  useEffect(() => {
    setTaskEstado(taskId, 'in_progress');
  }, [setTaskEstado, taskId]);

  return (
    <ActiveWorkScreen
      taskId={taskId}
      onBack={() => navigation.navigate('TaskDetail', {taskId})}
      onCompletar={() => navigation.navigate('CompleteWork', {taskId})}
    />
  );
}

function CompleteWorkRoute({
  navigation,
  route,
}: NativeStackScreenProps<WorkStackParamList, 'CompleteWork'>) {
  const {taskId} = route.params;
  const {completeTarea, getTarea} = useTareas();
  const {
    addGasto,
    useExistencias,
    addOpHoras,
    findInventoryByNombre,
    findEquipmentByNombre,
  } = useGranja();

  return (
    <CompleteWorkScreen
      taskId={taskId}
      onCancel={() => navigation.navigate('ActiveWork', {taskId})}
      onGuardar={draft => {
        const task = getTarea(taskId);
        completeTarea(taskId, draft);

        const cost = Number.parseFloat(draft.cost.replace(',', '.')) || 0;
        if (cost > 0) {
          addGasto({
            title: task?.title ?? 'Work cost',
            amount: String(cost),
            subtitle: [task?.field, 'Work'].filter(Boolean).join(' · '),
            icon: '🚜',
          });
        }

        const materialsKg =
          Number.parseFloat(draft.materialsKg.replace(',', '.')) || 0;
        const materialNombre = task?.materials?.split(' · ')[0];
        if (materialsKg > 0 && materialNombre) {
          const item = findInventoryByNombre(materialNombre);
          if (item) {
            useExistencias(item.id, materialsKg);
          }
        }

        const hours = parseDurationHoras(draft.duration);
        if (hours > 0 && task?.equipment) {
          const machine = findEquipmentByNombre(task.equipment);
          if (machine) {
            addOpHoras(machine.id, hours);
          }
        }

        navigation.navigate('WorkCompleted', {taskId});
      }}
    />
  );
}

function NewTaskRoute({
  navigation,
}: NativeStackScreenProps<WorkStackParamList, 'NewTask'>) {
  const {addTarea} = useTareas();
  return (
    <NewTaskScreen
      onCancel={() => navigation.goBack()}
      onGuardar={draft => {
        addTarea(draft);
        navigation.goBack();
      }}
    />
  );
}

function WorkCompletedRoute({
  navigation,
  route,
}: NativeStackScreenProps<WorkStackParamList, 'WorkCompleted'>) {
  const {taskId} = route.params;
  return (
    <WorkCompletedScreen
      taskId={taskId}
      onBackToTrabajo={() => navigation.popToTop()}
      onViewResumen={() => navigation.navigate('TaskDetail', {taskId})}
    />
  );
}

export function WorkStackNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="WorkHome" component={WorkHomeScreen} />
      <Stack.Screen name="TaskDetail" component={TaskDetailRoute} />
      <Stack.Screen name="ActiveWork" component={ActiveWorkRoute} />
      <Stack.Screen name="CompleteWork" component={CompleteWorkRoute} />
      <Stack.Screen name="NewTask" component={NewTaskRoute} />
      <Stack.Screen name="WorkCompleted" component={WorkCompletedRoute} />
    </Stack.Navigator>
  );
}
