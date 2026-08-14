import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {useCampos} from '../../data/FieldsContext';
import {EditFieldScreen} from '../../screens/EditFieldScreen';
import {FieldDetailScreen} from '../../screens/FieldDetailScreen';
import {FieldsScreen} from '../../screens/FieldsScreen';
import type {FieldsStackParamList} from '../types';

const Stack = createNativeStackNavigator<FieldsStackParamList>();

const screenOptions = {
  headerShown: false,
  animation: 'slide_from_right' as const,
  contentStyle: {backgroundColor: '#1a1140'},
};

function FieldsHomeScreen({
  navigation,
}: NativeStackScreenProps<FieldsStackParamList, 'FieldsHome'>) {
  return (
    <FieldsScreen
      onOpenCampo={fieldId => navigation.navigate('FieldDetail', {fieldId})}
      onAddCampo={() => navigation.navigate('NewField')}
    />
  );
}

function FieldDetailRoute({
  navigation,
  route,
}: NativeStackScreenProps<FieldsStackParamList, 'FieldDetail'>) {
  const {fieldId} = route.params;
  return (
    <FieldDetailScreen
      fieldId={fieldId}
      onBack={() => navigation.goBack()}
      onEdit={() => navigation.navigate('EditField', {fieldId})}
    />
  );
}

function NewFieldRoute({
  navigation,
}: NativeStackScreenProps<FieldsStackParamList, 'NewField'>) {
  const {addCampo} = useCampos();
  return (
    <EditFieldScreen
      mode="new"
      onCancel={() => navigation.goBack()}
      onGuardar={draft => {
        addCampo(draft);
        navigation.goBack();
      }}
    />
  );
}

function EditFieldRoute({
  navigation,
  route,
}: NativeStackScreenProps<FieldsStackParamList, 'EditField'>) {
  const {updateCampo} = useCampos();
  const {fieldId} = route.params;
  return (
    <EditFieldScreen
      mode="edit"
      fieldId={fieldId}
      onCancel={() => navigation.goBack()}
      onGuardar={draft => {
        updateCampo(fieldId, draft);
        navigation.goBack();
      }}
    />
  );
}

export function FieldsStackNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="FieldsHome" component={FieldsHomeScreen} />
      <Stack.Screen name="FieldDetail" component={FieldDetailRoute} />
      <Stack.Screen name="NewField" component={NewFieldRoute} />
      <Stack.Screen name="EditField" component={EditFieldRoute} />
    </Stack.Navigator>
  );
}
