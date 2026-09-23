import React from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { todayRecursos } from '../../data/assets';
import type { GuestTab } from '../../navigation/types';
import { colors, fonts } from '../../constants/theme';

type TabItem = {
  key: GuestTab;
  label: string;
  icon: number;
  iconActivo?: number;
  center?: boolean;
};

const TABS: TabItem[] = [
  {
    key: 'TodayTab',
    label: 'Today',
    icon: todayRecursos.tabTodayApagado,
    iconActivo: todayRecursos.tabHoy,
  },
  {
    key: 'FieldsTab',
    label: 'Fields',
    icon: todayRecursos.tabCampos,
    iconActivo: todayRecursos.tabFieldsActivo,
  },
  { key: 'WorkTab', label: 'Work', icon: todayRecursos.tabTrabajo, center: true },
  { key: 'CalcTab', label: 'Calc', icon: todayRecursos.tabCalc },
  { key: 'FarmTab', label: 'Farm', icon: todayRecursos.tabGranja },
];

type TabBarProps = {
  activeTab: GuestTab;
  onSelect: (tab: GuestTab) => void;
};

export function TabBar({ activeTab, onSelect }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.TabBarNucleoAndamio,
        { paddingBottom: Math.max(insets.bottom, 8) },
      ]}
    >
      {TABS.map(tab => {
        const active = activeTab === tab.key;
        if (tab.center) {
          return (
            <Pressable
              key={tab.key}
              onPress={() => onSelect(tab.key)}
              style={styles.TabBarCenterRecinto}
              hitSlop={8}
            >
              <ImageBackground
                source={todayRecursos.tabWorkBg}
                style={styles.TabBarWorkDisco}
                imageStyle={styles.TabBarWorkDiscoImage}
                resizeMode="cover"
              >
                <Image
                  source={todayRecursos.tabTrabajo}
                  style={styles.TabBarWorkSelloEscudo}
                  resizeMode="contain"
                />
              </ImageBackground>
              <Text
                style={[
                  styles.TabBarLabelLamina,
                  active && styles.TabBarLabelActiveLamina,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={tab.key}
            onPress={() => onSelect(tab.key)}
            style={styles.TabBarRecinto}
            hitSlop={8}
          >
            <Image
              source={active && tab.iconActivo ? tab.iconActivo : tab.icon}
              style={[
                styles.TabBarSelloEscudo,
                !tab.iconActivo && {
                  tintColor: active ? colors.gold : colors.tabInactivo,
                },
              ]}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.TabBarLabelLamina,
                active && styles.TabBarLabelActiveLamina,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  TabBarNucleoAndamio: {
    backgroundColor: colors.tabBar,
    borderTopColor: colors.borderSuave,
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingTop: 10,
  },

  TabBarRecinto: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
    paddingBottom: 2,
  },

  TabBarCenterRecinto: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
    marginTop: -20,
  },

  TabBarSelloEscudo: {
    height: 24,
    width: 24,
  },

  TabBarWorkDisco: {
    alignItems: 'center',
    borderRadius: 17,
    elevation: 8,
    height: 50,
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#f0a92e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    width: 50,
  },

  TabBarWorkDiscoImage: {
    borderRadius: 17,
  },

  TabBarWorkSelloEscudo: {
    height: 26,
    width: 26,
  },

  TabBarLabelLamina: {
    color: colors.tabInactivo,
    fontFamily: fonts.sansRegular,
    fontSize: 10,
  },

  TabBarLabelActiveLamina: {
    color: colors.gold,
  },
});
