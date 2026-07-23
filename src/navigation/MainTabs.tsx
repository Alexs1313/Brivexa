import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {TabBar} from '../components/nav/TabBar';
import {CalcStackNavigator} from './stacks/CalcStack';
import {FarmStackNavigator} from './stacks/FarmStack';
import {FieldsStackNavigator} from './stacks/FieldsStack';
import {TodayStackNavigator} from './stacks/TodayStack';
import {WorkStackNavigator} from './stacks/WorkStack';
import type {GuestTab, MainTabParamList} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({state, navigation}) => (
        <TabBar
          activeTab={state.routes[state.index]?.name as GuestTab}
          onSelect={tab => {
            navigation.navigate(tab);
          }}
        />
      )}>
      <Tab.Screen name="TodayTab" component={TodayStackNavigator} />
      <Tab.Screen name="FieldsTab" component={FieldsStackNavigator} />
      <Tab.Screen name="WorkTab" component={WorkStackNavigator} />
      <Tab.Screen name="CalcTab" component={CalcStackNavigator} />
      <Tab.Screen name="FarmTab" component={FarmStackNavigator} />
    </Tab.Navigator>
  );
}
