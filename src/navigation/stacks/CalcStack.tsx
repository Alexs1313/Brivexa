import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { CalculatorsScreen } from '../../screens/CalculatorsScreen';
import { FertilizerScreen } from '../../screens/FertilizerScreen';

import { SeedRateScreen } from '../../screens/SeedRateScreen';

import { SprayMixtureScreen } from '../../screens/SprayMixtureScreen';
import { CALCULATOR_ROUTES, type CalcStackParamList } from '../types';

const Stack = createNativeStackNavigator<CalcStackParamList>();

const screenOptions = {
  headerShown: false,
  animation: 'slide_from_right' as const,
  contentStyle: { backgroundColor: '#1a1140' },
};

function CalcHomeScreen({
  navigation,
}: NativeStackScreenProps<CalcStackParamList, 'CalcHome'>) {
  return (
    <CalculatorsScreen
      onOpenCalculadora={id => navigation.navigate(CALCULATOR_ROUTES[id])}
    />
  );
}

function SeedRateRoute({
  navigation,
}: NativeStackScreenProps<CalcStackParamList, 'SeedRate'>) {
  return <SeedRateScreen onBack={() => navigation.goBack()} />;
}

function FertilizerRoute({
  navigation,
}: NativeStackScreenProps<CalcStackParamList, 'Fertilizer'>) {
  return <FertilizerScreen onBack={() => navigation.goBack()} />;
}

function SprayMixtureRoute({
  navigation,
}: NativeStackScreenProps<CalcStackParamList, 'SprayMixture'>) {
  return <SprayMixtureScreen onBack={() => navigation.goBack()} />;
}

export function CalcStackNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="CalcHome" component={CalcHomeScreen} />
      <Stack.Screen name="SeedRate" component={SeedRateRoute} />

      <Stack.Screen name="Fertilizer" component={FertilizerRoute} />
      <Stack.Screen name="SprayMixture" component={SprayMixtureRoute} />
    </Stack.Navigator>
  );
}
