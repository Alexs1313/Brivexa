import React from 'react';
import {CommonActions} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {TodayScreen} from '../../screens/TodayScreen';
import {WeatherDetailsScreen} from '../../screens/WeatherDetailsScreen';
import type {TodayStackParamList} from '../types';

const Stack = createNativeStackNavigator<TodayStackParamList>();

const screenOptions = {
  headerShown: false,
  animation: 'slide_from_right' as const,
  contentStyle: {backgroundColor: '#1a1140'},
};

function TodayHomeScreen({
  navigation,
}: NativeStackScreenProps<TodayStackParamList, 'TodayHome'>) {
  const goTab = (tab: string, screen?: string) => {
    navigation.dispatch(
      CommonActions.navigate(tab, screen ? {screen} : undefined),
    );
  };

  return (
    <TodayScreen
      onOpenWeather={() => navigation.navigate('WeatherDetails')}
      onAddTask={() => goTab('WorkTab', 'NewTask')}
      onAddField={() => goTab('FieldsTab', 'NewField')}
      onAddExpense={() => goTab('FarmTab', 'AddIncome')}
      onStartWork={() => goTab('WorkTab')}
    />
  );
}

function WeatherDetailsRoute({
  navigation,
}: NativeStackScreenProps<TodayStackParamList, 'WeatherDetails'>) {
  return <WeatherDetailsScreen onBack={() => navigation.goBack()} />;
}

export function TodayStackNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="TodayHome" component={TodayHomeScreen} />
      <Stack.Screen name="WeatherDetails" component={WeatherDetailsRoute} />
    </Stack.Navigator>
  );
}
