import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useFarm} from '../../data/FarmContext';
import {AddIncomeScreen} from '../../screens/AddIncomeScreen';
import {AddMaintenanceScreen} from '../../screens/AddMaintenanceScreen';
import {EquipmentDetailScreen} from '../../screens/EquipmentDetailScreen';
import {FarmScreen} from '../../screens/FarmScreen';
import {InventoryItemDetailScreen} from '../../screens/InventoryItemDetailScreen';
import {NewItemScreen} from '../../screens/NewItemScreen';
import {ReportDetailScreen} from '../../screens/ReportDetailScreen';
import {useFarmToast} from '../FarmToastContext';
import type {FarmStackParamList} from '../types';

const Stack = createNativeStackNavigator<FarmStackParamList>();

const screenOptions = {
  headerShown: false,
  animation: 'slide_from_right' as const,
  contentStyle: {backgroundColor: '#1a1140'},
};

function FarmHomeScreen({
  navigation,
}: NativeStackScreenProps<FarmStackParamList, 'FarmHome'>) {
  const {farmToast, clearFarmToast} = useFarmToast();

  useEffect(() => {
    if (!farmToast) {
      return;
    }
    const timer = setTimeout(() => clearFarmToast(), 2200);
    return () => clearTimeout(timer);
  }, [clearFarmToast, farmToast]);

  return (
    <FarmScreen
      onOpenItem={itemId =>
        navigation.navigate('InventoryItemDetail', {itemId})
      }
      onAddItem={() => navigation.navigate('NewInventoryItem')}
      onOpenEquipment={equipmentId =>
        navigation.navigate('EquipmentDetail', {equipmentId})
      }
      onAddIncome={() => navigation.navigate('AddIncome')}
      onOpenReport={() => navigation.navigate('ReportDetail')}
      toastMessage={farmToast}
    />
  );
}

function InventoryItemDetailRoute({
  navigation,
  route,
}: NativeStackScreenProps<FarmStackParamList, 'InventoryItemDetail'>) {
  const {itemId} = route.params;
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
  const {addInventoryItem} = useFarm();
  const {showFarmToast} = useFarmToast();
  return (
    <NewItemScreen
      onCancel={() => navigation.goBack()}
      onSave={draft => {
        addInventoryItem(draft);
        showFarmToast('Item saved');
        navigation.goBack();
      }}
    />
  );
}

function EquipmentDetailRoute({
  navigation,
  route,
}: NativeStackScreenProps<FarmStackParamList, 'EquipmentDetail'>) {
  const {equipmentId} = route.params;
  return (
    <EquipmentDetailScreen
      equipmentId={equipmentId}
      onBack={() => navigation.goBack()}
      onEdit={() => navigation.goBack()}
      onAddMaintenance={() =>
        navigation.navigate('AddMaintenance', {equipmentId})
      }
      onDelete={() => navigation.goBack()}
    />
  );
}

function AddMaintenanceRoute({
  navigation,
  route,
}: NativeStackScreenProps<FarmStackParamList, 'AddMaintenance'>) {
  const {addMaintenance} = useFarm();
  const equipmentId = route.params.equipmentId;
  return (
    <AddMaintenanceScreen
      onCancel={() => navigation.goBack()}
      onSave={draft => {
        if (equipmentId) {
          addMaintenance(equipmentId, draft);
        }
        navigation.goBack();
      }}
    />
  );
}

function AddIncomeRoute({
  navigation,
}: NativeStackScreenProps<FarmStackParamList, 'AddIncome'>) {
  const {addIncome} = useFarm();
  return (
    <AddIncomeScreen
      onCancel={() => navigation.goBack()}
      onSave={draft => {
        addIncome(draft);
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
