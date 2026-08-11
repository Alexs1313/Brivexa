import React, { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { DropdownField } from '../components/forms/DropdownField';

import { colors, fonts, radius } from '../constants/theme';
import { appBackground } from '../data/assets';

import { MAINTENANCE_TYPES } from '../data/farm';
import type { MaintenanceDraft } from '../data/FarmContext';
import { useAdaptive } from '../hooks/useAdaptive';

import { FormField } from './NewItemScreen';

type AddMaintenanceScreenProps = {
  onCancel: () => void;
  onSave: (draft: MaintenanceDraft) => void;
};

export function AddMaintenanceScreen({
  onCancel,
  onSave,
}: AddMaintenanceScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptive();
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [hours, setHours] = useState('');
  const [cost, setCost] = useState('');
  const [provider, setProvider] = useState('');
  const [nextHours, setNextHours] = useState('');

  return (
    <ImageBackground
      source={appBackground}
      style={styles.AddMaintenanceScreenRootHull}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.AddMaintenanceScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalScale(6),
            paddingBottom: insets.bottom + adaptive.verticalScale(28),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.AddMaintenanceScreenHeaderRowCapstone}>
          <Pressable
            onPress={onCancel}
            hitSlop={12}
            style={styles.AddMaintenanceScreenNavSide}
          >
            <Text style={styles.AddMaintenanceScreenNavLinkFlourish}>
              ‹ Cancel
            </Text>
          </Pressable>
          <Text style={styles.AddMaintenanceScreenTitleFlourish}>
            Add Maintenance
          </Text>
          <View style={styles.AddMaintenanceScreenNavSide} />
        </View>

        <View style={{ paddingHorizontal: adaptive.horizontalPadding }}>
          <DropdownField
            label="Maintenance Type"
            required
            value={type}
            onChange={setType}
            placeholder={`e.g. ${MAINTENANCE_TYPES[0]}`}
            options={MAINTENANCE_TYPES}
          />
          <FormField
            label="Date"
            value={date}
            onChangeText={setDate}
            placeholder="e.g. Jul 22, 2026"
          />
          <FormField
            label="Operating Hours"
            value={hours}
            onChangeText={setHours}
            placeholder="e.g. 1842"
            keyboardType="decimal-pad"
          />
          <FormField
            label="Cost ($)"
            value={cost}
            onChangeText={setCost}
            placeholder="e.g. 480"
            keyboardType="decimal-pad"
          />
          <FormField
            label="Service Provider"
            value={provider}
            onChangeText={setProvider}
            placeholder="e.g. FarmTech Service"
          />
          <FormField
            label="Next Service Hours"
            value={nextHours}
            onChangeText={setNextHours}
            placeholder="e.g. 2092"
            keyboardType="decimal-pad"
          />

          <View style={styles.AddMaintenanceScreenInfoBannerHull}>
            <Text style={styles.AddMaintenanceScreenInfoBannerFlourish}>
              On save: ${cost || '0'} added to finance · maintenance history
              updated · next-service status reset.
            </Text>
          </View>

          <PrimaryButton
            label="Save Maintenance"
            onPress={() =>
              onSave({
                type,
                date,
                hours,
                cost,
                provider,
                nextHours,
              })
            }
            fullWidth
            style={styles.AddMaintenanceScreenSavePlinth}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  AddMaintenanceScreenRootHull: {
    backgroundColor: colors.background,
    flex: 1,
  },
  AddMaintenanceScreenScrollContent: {
    flexGrow: 1,
  },

  AddMaintenanceScreenHeaderRowCapstone: {
    alignItems: 'center',
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  AddMaintenanceScreenNavSide: {
    minWidth: 72,
  },

  AddMaintenanceScreenNavLinkFlourish: {
    color: colors.gold,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },

  AddMaintenanceScreenTitleFlourish: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },
  AddMaintenanceScreenInfoBannerHull: {
    backgroundColor: colors.infoBanner,
    borderColor: colors.infoBannerBorder,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: 16,
    marginTop: 4,
    padding: 15,
  },

  AddMaintenanceScreenInfoBannerFlourish: {
    color: colors.infoBannerText,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    lineHeight: 18,
  },

  AddMaintenanceScreenSavePlinth: {
    marginTop: 4,
  },
});
