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
import { appFondo } from '../data/assets';

import { MAINTENANCE_TYPES } from '../data/farm';
import type { MaintenanceDraft } from '../data/FarmContext';
import { useAdaptativo } from '../hooks/useAdaptativo';

import { FormField } from './NewItemScreen';

type AddMaintenanceScreenProps = {
  onCancel: () => void;
  onGuardar: (draft: MaintenanceDraft) => void;
};

export function AddMaintenanceScreen({
  onCancel,
  onGuardar,
}: AddMaintenanceScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptativo();
  const [type, setTipo] = useState('');
  const [date, setDate] = useState('');
  const [hours, setHoras] = useState('');
  const [cost, setCosto] = useState('');
  const [provider, setProveedor] = useState('');
  const [nextHoras, setNextHoras] = useState('');

  return (
    <ImageBackground
      source={appFondo}
      style={styles.AddMaintenanceScreenRaizCasco}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.AddMaintenanceScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalEscala(6),
            paddingBottom: insets.bottom + adaptive.verticalEscala(28),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.AddMaintenanceScreenHeaderRowDintel}>
          <Pressable
            onPress={onCancel}
            hitSlop={12}
            style={styles.AddMaintenanceScreenNavSide}
          >
            <Text style={styles.AddMaintenanceScreenNavLinkFiligrana}>
              ‹ Cancel
            </Text>
          </Pressable>
          <Text style={styles.AddMaintenanceScreenTitleFiligrana}>
            Add Maintenance
          </Text>
          <View style={styles.AddMaintenanceScreenNavSide} />
        </View>

        <View style={{ paddingHorizontal: adaptive.horizontalRelleno }}>
          <DropdownField
            label="Maintenance Type"
            required
            value={type}
            onChange={setTipo}
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
            onChangeText={setHoras}
            placeholder="e.g. 1842"
            keyboardType="decimal-pad"
          />
          <FormField
            label="Cost ($)"
            value={cost}
            onChangeText={setCosto}
            placeholder="e.g. 480"
            keyboardType="decimal-pad"
          />
          <FormField
            label="Service Provider"
            value={provider}
            onChangeText={setProveedor}
            placeholder="e.g. FarmTech Service"
          />
          <FormField
            label="Next Service Hours"
            value={nextHoras}
            onChangeText={setNextHoras}
            placeholder="e.g. 2092"
            keyboardType="decimal-pad"
          />

          <View style={styles.AddMaintenanceScreenInfoBannerCasco}>
            <Text style={styles.AddMaintenanceScreenInfoBannerFiligrana}>
              On save: ${cost || '0'} added to finance · maintenance history
              updated · next-service status reset.
            </Text>
          </View>

          <PrimaryButton
            label="Save Maintenance"
            onPress={() =>
              onGuardar({
                type,
                date,
                hours,
                cost,
                provider,
                nextHoras,
              })
            }
            fullWidth
            style={styles.AddMaintenanceScreenSavePlinto}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  AddMaintenanceScreenRaizCasco: {
    backgroundColor: colors.background,
    flex: 1,
  },
  AddMaintenanceScreenScrollContent: {
    flexGrow: 1,
  },

  AddMaintenanceScreenHeaderRowDintel: {
    alignItems: 'center',
    borderBottomColor: colors.borderSuave,
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

  AddMaintenanceScreenNavLinkFiligrana: {
    color: colors.gold,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },

  AddMaintenanceScreenTitleFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },
  AddMaintenanceScreenInfoBannerCasco: {
    backgroundColor: colors.infoBanda,
    borderColor: colors.infoBannerBorde,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: 16,
    marginTop: 4,
    padding: 15,
  },

  AddMaintenanceScreenInfoBannerFiligrana: {
    color: colors.infoBannerText,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    lineHeight: 18,
  },

  AddMaintenanceScreenSavePlinto: {
    marginTop: 4,
  },
});
