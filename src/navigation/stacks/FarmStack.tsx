import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useGranja } from '../../data/FarmContext';

import { AddIncomeScreen } from '../../screens/AddIncomeScreen';
import { AddMaintenanceScreen } from '../../screens/AddMaintenanceScreen';
import { EquipmentDetailScreen } from '../../screens/EquipmentDetailScreen';
import { FarmScreen } from '../../screens/FarmScreen';

import { InventoryItemDetailScreen } from '../../screens/InventoryItemDetailScreen';
import { NewItemScreen } from '../../screens/NewItemScreen';
import { ReportDetailScreen } from '../../screens/ReportDetailScreen';
import { useFarmAviso } from '../FarmToastContext';
//
import type { FarmStackParamList } from '../types';

const Stack = createNativeStackNavigator<FarmStackParamList>();

const screenOptions = {
  headerShown: false,
  animation: 'slide_from_right' as const,
  contentStyle: { backgroundColor: '#1a1140' },
};

function FarmHomeScreen({
  navigation,
}: NativeStackScreenProps<FarmStackParamList, 'FarmHome'>) {
  const { farmAviso, clearFarmAviso } = useFarmAviso();

  useEffect(() => {
    if (!farmAviso) {
      return;
    }
    const timer = setTimeout(() => clearFarmAviso(), 2200);
    return () => clearTimeout(timer);
  }, [clearFarmAviso, farmAviso]);

  return (
    <FarmScreen
      onOpenArticulo={itemId =>
        navigation.navigate('InventoryItemDetail', { itemId })
      }
      onAddArticulo={() => navigation.navigate('NewInventoryItem')}
      onOpenEquipo={equipmentId =>
        navigation.navigate('EquipmentDetail', { equipmentId })
      }
      onAddIngreso={() => navigation.navigate('AddIncome')}
      onOpenInforme={() => navigation.navigate('ReportDetail')}
      toastMensaje={farmAviso}
    />
  );
}

function InventoryItemDetailRoute({
  navigation,
  route,
}: NativeStackScreenProps<FarmStackParamList, 'InventoryItemDetail'>) {
  const { itemId } = route.params;
  return (
    <InventoryItemDetailScreen
      itemId={itemId}
      onBack={() => navigation.goBack()}
      onEdit={() => navigation.navigate('NewInventoryItem')}
      onDelete={() => navigation.goBack()}
    />
  );
}

function NewInventoryItemRoute({
  navigation,
}: NativeStackScreenProps<FarmStackParamList, 'NewInventoryItem'>) {
  const { addInventoryArticulo } = useGranja();
  const { showFarmAviso } = useFarmAviso();
  return (
    <NewItemScreen
      onCancel={() => navigation.goBack()}
      onGuardar={draft => {
        addInventoryArticulo(draft);
        showFarmAviso('Item saved');
        navigation.goBack();
      }}
    />
  );
}

function EquipmentDetailRoute({
  navigation,
  route,
}: NativeStackScreenProps<FarmStackParamList, 'EquipmentDetail'>) {
  const { equipmentId } = route.params;
  return (
    <EquipmentDetailScreen
      equipmentId={equipmentId}
      onBack={() => navigation.goBack()}
      onEdit={() => navigation.goBack()}
      onAddMantenimiento={() =>
        navigation.navigate('AddMaintenance', { equipmentId })
      }
      onDelete={() => navigation.goBack()}
    />
  );
}

function AddMaintenanceRoute({
  navigation,
  route,
}: NativeStackScreenProps<FarmStackParamList, 'AddMaintenance'>) {
  const { addMantenimiento } = useGranja();
  const equipmentId = route.params.equipmentId;
  return (
    <AddMaintenanceScreen
      onCancel={() => navigation.goBack()}
      onGuardar={draft => {
        if (equipmentId) {
          addMantenimiento(equipmentId, draft);
        }
        navigation.goBack();
      }}
    />
  );
}

function AddIncomeRoute({
  navigation,
}: NativeStackScreenProps<FarmStackParamList, 'AddIncome'>) {
  const { addIngreso } = useGranja();
  return (
    <AddIncomeScreen
      onCancel={() => navigation.goBack()}
      onGuardar={draft => {
        addIngreso(draft);
        navigation.goBack();
      }}
    />
  );
}

function ReportDetailRoute({
  navigation,
}: NativeStackScreenProps<FarmStackParamList, 'ReportDetail'>) {
  return <ReportDetailScreen onBack={() => navigation.goBack()} />;
}

export function FarmStackNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="FarmHome" component={FarmHomeScreen} />
      <Stack.Screen
        name="InventoryItemDetail"
        component={InventoryItemDetailRoute}
      />
      <Stack.Screen name="NewInventoryItem" component={NewInventoryItemRoute} />
      <Stack.Screen name="EquipmentDetail" component={EquipmentDetailRoute} />
      <Stack.Screen name="AddMaintenance" component={AddMaintenanceRoute} />
      <Stack.Screen name="AddIncome" component={AddIncomeRoute} />
      <Stack.Screen name="ReportDetail" component={ReportDetailRoute} />
    </Stack.Navigator>
  );
}
