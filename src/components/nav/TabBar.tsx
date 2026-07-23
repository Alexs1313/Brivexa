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

import { todayAssets } from '../../data/assets';
import type { GuestTab } from '../../navigation/types';
import { colors, fonts } from '../../constants/theme';

type TabItem = {
  key: GuestTab;
  label: string;
  icon: number;
  iconActive?: number;
  center?: boolean;
};

const TABS: TabItem[] = [
  {
    key: 'TodayTab',
    label: 'Today',
    icon: todayAssets.tabTodayMuted,
    iconActive: todayAssets.tabToday,
  },
  {
    key: 'FieldsTab',
    label: 'Fields',
    icon: todayAssets.tabFields,
    iconActive: todayAssets.tabFieldsActive,
  },
  { key: 'WorkTab', label: 'Work', icon: todayAssets.tabWork, center: true },
  { key: 'CalcTab', label: 'Calc', icon: todayAssets.tabCalc },
  { key: 'FarmTab', label: 'Farm', icon: todayAssets.tabFarm },
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
        styles.TabBarFacetChassis,
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
              style={styles.TabBarCenterEnclave}
              hitSlop={8}
            >
              <ImageBackground
                source={todayAssets.tabWorkBg}
                style={styles.TabBarWorkOrb}
                imageStyle={styles.TabBarWorkOrbImage}
                resizeMode="cover"
              >
                <Image
                  source={todayAssets.tabWork}
                  style={styles.TabBarWorkGlyphSigil}
                  resizeMode="contain"
                />
              </ImageBackground>
              <Text
                style={[
                  styles.TabBarLabelFiligree,
                  active && styles.TabBarLabelActiveFiligree,
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
            style={styles.TabBarEnclave}
            hitSlop={8}
          >
            <Image
              source={active && tab.iconActive ? tab.iconActive : tab.icon}
              style={[
                styles.TabBarGlyphSigil,
                !tab.iconActive && {
                  tintColor: active ? colors.gold : colors.tabInactive,
                },
              ]}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.TabBarLabelFiligree,
                active && styles.TabBarLabelActiveFiligree,
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
  TabBarFacetChassis: {
    backgroundColor: colors.tabBar,
    borderTopColor: colors.borderSoft,
    borderTopWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 4,
    paddingTop: 10,
  },

  TabBarEnclave: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
    paddingBottom: 2,
  },
  TabBarCenterEnclave: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
    marginTop: -20,
  },

  TabBarGlyphSigil: {
    height: 24,
    width: 24,
  },
  TabBarWorkOrb: {
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
  TabBarWorkOrbImage: {
    borderRadius: 17,
  },
  TabBarWorkGlyphSigil: {
    height: 26,
    width: 26,
  },

  TabBarLabelFiligree: {
    color: colors.tabInactive,
    fontFamily: fonts.sansRegular,
    fontSize: 10,
  },

  TabBarLabelActiveFiligree: {
    color: colors.gold,
  },
});
