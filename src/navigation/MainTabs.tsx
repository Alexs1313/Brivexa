import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {TabBar} from '../components/nav/TabBar';
import {CalcTabHost} from './stacks/CalcStack';
import {FarmStackNavigator} from './stacks/FarmStack';
import {FieldsStackNavigator} from './stacks/FieldsStack';
import {TodayStackNavigator} from './stacks/TodayStack';
import {WorkStackNavigator} from './stacks/WorkStack';
import type {GuestTab, MainTabParamList} from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ROOTS: Partial<Record<GuestTab, string>> = {
  TodayTab: 'TodayHome',
  FieldsTab: 'FieldsHome',
  WorkTab: 'WorkHome',
  FarmTab: 'FarmHome',
};

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
            const root = TAB_ROOTS[tab];
            if (root) {
              navigation.navigate(tab, {screen: root});
              return;
            }
            navigation.navigate(tab);
          }}
        />
      )}>
      <Tab.Screen name="TodayTab" component={TodayStackNavigator} />
      <Tab.Screen name="FieldsTab" component={FieldsStackNavigator} />
      <Tab.Screen name="WorkTab" component={WorkStackNavigator} />
      <Tab.Screen name="CalcTab" component={CalcTabHost} />
      <Tab.Screen name="FarmTab" component={FarmStackNavigator} />
    </Tab.Navigator>
  );
}
