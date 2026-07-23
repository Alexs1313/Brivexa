import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useFarm} from '../../data/FarmContext';
import {useTasks} from '../../data/TasksContext';
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

function parseDurationHours(label: string): number {
  const hours = label.match(/(\d+(?:\.\d+)?)\s*h/i);
  const mins = label.match(/(\d+)\s*m/i);
  return (hours ? Number(hours[1]) : 0) + (mins ? Number(mins[1]) / 60 : 0);
}

function WorkHomeScreen({
  navigation,
}: NativeStackScreenProps<WorkStackParamList, 'WorkHome'>) {
  return (
    <WorkScreen
      onOpenTask={taskId => navigation.navigate('TaskDetail', {taskId})}
      onAddTask={() => navigation.navigate('NewTask')}
    />
  );
}

function TaskDetailRoute({
  navigation,
  route,
}: NativeStackScreenProps<WorkStackParamList, 'TaskDetail'>) {
  const {removeTask} = useTasks();
  const {taskId} = route.params;
  return (
    <TaskDetailScreen
      taskId={taskId}
      onBack={() => navigation.goBack()}
      onStartWork={() => navigation.navigate('ActiveWork', {taskId})}
      onEdit={() => navigation.navigate('NewTask')}
      onDelete={() => {
        removeTask(taskId);
        navigation.goBack();
      }}
    />
  );
}

function ActiveWorkRoute({
  navigation,
  route,
}: NativeStackScreenProps<WorkStackParamList, 'ActiveWork'>) {
  const {setTaskStatus} = useTasks();
  const {taskId} = route.params;

  useEffect(() => {
    setTaskStatus(taskId, 'in_progress');
  }, [setTaskStatus, taskId]);

  return (
    <ActiveWorkScreen
      taskId={taskId}
      onBack={() => navigation.navigate('TaskDetail', {taskId})}
      onComplete={() => navigation.navigate('CompleteWork', {taskId})}
    />
  );
}

function CompleteWorkRoute({
  navigation,
  route,
}: NativeStackScreenProps<WorkStackParamList, 'CompleteWork'>) {
  const {taskId} = route.params;
  const {completeTask, getTask} = useTasks();
  const {
    addExpense,
    useStock,
    addOpHours,
    findInventoryByName,
    findEquipmentByName,
  } = useFarm();

  return (
    <CompleteWorkScreen
      taskId={taskId}
      onCancel={() => navigation.navigate('ActiveWork', {taskId})}
      onSave={draft => {
        const task = getTask(taskId);
        completeTask(taskId, draft);

        const cost = Number.parseFloat(draft.cost.replace(',', '.')) || 0;
        if (cost > 0) {
          addExpense({
            title: task?.title ?? 'Work cost',
            amount: String(cost),
            subtitle: [task?.field, 'Work'].filter(Boolean).join(' · '),
            icon: '🚜',
          });
        }

        const materialsKg =
          Number.parseFloat(draft.materialsKg.replace(',', '.')) || 0;
        const materialName = task?.materials?.split(' · ')[0];
        if (materialsKg > 0 && materialName) {
          const item = findInventoryByName(materialName);
          if (item) {
            useStock(item.id, materialsKg);
          }
        }

        const hours = parseDurationHours(draft.duration);
        if (hours > 0 && task?.equipment) {
          const machine = findEquipmentByName(task.equipment);
          if (machine) {
            addOpHours(machine.id, hours);
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
  const {addTask} = useTasks();
  return (
    <NewTaskScreen
      onCancel={() => navigation.goBack()}
      onSave={draft => {
        addTask(draft);
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
      onBackToWork={() => navigation.popToTop()}
      onViewSummary={() => navigation.navigate('TaskDetail', {taskId})}
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
