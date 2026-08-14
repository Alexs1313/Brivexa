import React, {useCallback} from 'react';
import {NavigationContainer, DarkTheme} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import {colors} from '../constants/theme';
import {LoaderScreen} from '../screens/LoaderScreen';
import {OnboardingScreen} from '../screens/OnboardingScreen';
import {MainTabs} from './MainTabs';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTema = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.background,
    card: colors.background,
    primary: colors.gold,
    text: colors.cream,
    border: colors.border,
    notification: colors.gold,
  },
};

function LoaderRoute({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Loader'>) {
  const onCompletar = useCallback(() => {
    navigation.replace('Onboarding');
  }, [navigation]);

  return <LoaderScreen onCompletar={onCompletar} />;
}

function OnboardingRoute({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Onboarding'>) {
  return (
    <OnboardingScreen
      onCompletar={() => {
        navigation.replace('Main');
      }}
    />
  );
}

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTema}>
      <Stack.Navigator
        initialRouteName="Loader"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: {backgroundColor: colors.background},
        }}>
        <Stack.Screen name="Loader" component={LoaderRoute} />
        <Stack.Screen name="Onboarding" component={OnboardingRoute} />
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
