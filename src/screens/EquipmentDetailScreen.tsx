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

import { AmountModal } from '../components/AmountModal';
import { ProgressBar } from '../components/ProgressBar';
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { colors, fonts } from '../constants/theme';

import { appFondo } from '../data/assets';

import { useGranja } from '../data/FarmContext';
import { useAdaptativo } from '../hooks/useAdaptativo';

type EquipmentDetailScreenProps = {
  equipmentId: string;
  onBack: () => void;
  onEdit: () => void;
  onAddMantenimiento: () => void;
  onDelete: () => void;
};

export function EquipmentDetailScreen({
  equipmentId,
  onBack,
  onEdit,
  onAddMantenimiento,
  onDelete,
}: EquipmentDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptativo();
  const { getEquipo, addOpHoras, removeEquipo, cycleEquipmentEstado } =
    useGranja();
  const item = getEquipo(equipmentId);
  const [hoursAbierto, setHoursAbierto] = useState(false);
  const [toast, setAviso] = useState<string | null>(null);

  if (!item) {
    return (
      <View style={styles.EquipmentDetailScreenMissingRecinto}>
        <Text style={styles.EquipmentDetailScreenMissingLamina}>
          Equipment not found
        </Text>
        <Pressable onPress={onBack}>
          <Text style={styles.EquipmentDetailScreenNavLinkLamina}>
            ‹ Farm
          </Text>
        </Pressable>
      </View>
    );
  }

  const nextServiceEtiqueta =
    item.hoursToServicio != null ? `in ${item.hoursToServicio} hrs` : '—';
  const serviceProgressEtiqueta =
    item.hoursToServicio != null
      ? `${item.hoursToServicio} hrs to service`
      : 'On schedule';

  const rows: {
    label: string;
    value: string;
    tone?: 'success' | 'danger' | 'money';
  }[] = [
    { label: 'Status', value: item.status, tone: 'success' },
    { label: 'Operating Hours', value: item.hoursEtiqueta },
    { label: 'Service Interval', value: `${item.serviceIntervalHrs} hrs` },
    {
      label: 'Next Service',
      value: nextServiceEtiqueta,
      tone:
        item.hoursToServicio != null && item.hoursToServicio <= 10
          ? 'danger'
          : undefined,
    },
    { label: 'Fuel Type', value: item.fuelTipo },
    { label: 'Total Maint. Cost', value: item.maintCostEtiqueta, tone: 'money' },
  ];

  return (
    <ImageBackground
      source={appFondo}
      style={styles.EquipmentDetailScreenNucleoAndamio}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.EquipmentDetailScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalEscala(6),
            paddingBottom: insets.bottom + adaptive.verticalEscala(28),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.EquipmentDetailScreenHeaderRowFriso}>
          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={styles.EquipmentDetailScreenNavSide}
          >
            <Text style={styles.EquipmentDetailScreenNavLinkLamina}>
              ‹ Farm
            </Text>
          </Pressable>
          <Text style={styles.EquipmentDetailScreenTitleLamina}>
            Equipment
          </Text>
          <Pressable
            onPress={onEdit}
            hitSlop={12}
            style={styles.EquipmentDetailScreenNavSideRight}
          >
            <Text style={styles.EquipmentDetailScreenNavLinkBoldLamina}>
              Edit
            </Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: adaptive.horizontalRelleno }}>
          <View style={styles.EquipmentDetailScreenIdentityRow}>
            <View style={styles.EquipmentDetailScreenIconBox}>
              <Text style={styles.EquipmentDetailScreenIconSello}>
                {item.icon}
              </Text>
            </View>
            <View>
              <Text style={styles.EquipmentDetailScreenName}>{item.name}</Text>
              <Text style={styles.EquipmentDetailScreenMeta}>
                {item.type} · {item.modelAnio}
              </Text>
            </View>
          </View>

          <View style={styles.EquipmentDetailScreenKvList}>
            {rows.map((row, index) => (
              <View
                key={row.label}
                style={[
                  styles.EquipmentDetailScreenKvRow,
                  index < rows.length - 1 &&
                    styles.EquipmentDetailScreenKvBorder,
                ]}
              >
                <Text style={styles.EquipmentDetailScreenKvLabel}>
                  {row.label}
                </Text>
                <Text
                  style={[
                    styles.EquipmentDetailScreenKvValue,
                    row.tone === 'success' && { color: colors.success },
                    row.tone === 'danger' && { color: colors.danger },
                    row.tone === 'money' && { color: colors.expenseDinero },
                  ]}
                >
                  {row.value}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.EquipmentDetailScreenProgressCard}>
            <View style={styles.EquipmentDetailScreenProgressHeader}>
              <Text style={styles.EquipmentDetailScreenProgressLabel}>
                Service Progress
              </Text>
              <Text style={styles.EquipmentDetailScreenProgressWarn}>
                {serviceProgressEtiqueta}
              </Text>
            </View>
            <ProgressBar
              progress={item.serviceProgreso}
              height={8}
              color={colors.gold}
            />
          </View>

          <View style={styles.EquipmentDetailScreenActionRow}>
            <View style={styles.EquipmentDetailScreenHalfBtn}>
              <PrimaryButton
                label="+ Maintenance"
                onPress={onAddMantenimiento}
                fullWidth
              />
            </View>
            <Pressable
              onPress={() => setHoursAbierto(true)}
              style={({ pressed }) => [
                styles.EquipmentDetailScreenSecondaryHalf,
                pressed && styles.EquipmentDetailScreenPressedOpaco,
              ]}
            >
              <Text style={styles.EquipmentDetailScreenSecondaryHalfLabel}>
                + Op. Hours
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => {
              const next = cycleEquipmentEstado(equipmentId);
              setAviso(`Status → ${next}`);
              setTimeout(() => setAviso(null), 2000);
            }}
            style={({ pressed }) => [
              styles.EquipmentDetailScreenChangeStatusBtn,
              pressed && styles.EquipmentDetailScreenPressedOpaco,
            ]}
          >
            <Text style={styles.EquipmentDetailScreenChangeStatusLabel}>
              Change Status
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              removeEquipo(equipmentId);
              onDelete();
            }}
            style={styles.EquipmentDetailScreenDeleteBtn}
          >
            <Text style={styles.EquipmentDetailScreenDeleteLabel}>
              Delete Equipment
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {toast ? (
        <View
          style={[
            styles.EquipmentDetailScreenToastAndamio,
            { bottom: insets.bottom + adaptive.verticalEscala(24) },
          ]}
        >
          <Text style={styles.EquipmentDetailScreenToastLamina}>{toast}</Text>
        </View>
      ) : null}

      <AmountModal
        visible={hoursAbierto}
        title="Add Operating Hours"
        subtitle={item.name}
        unitEtiqueta="hrs"
        placeholder="e.g. 5"
        confirmEtiqueta="Add Hours"
        onCancel={() => setHoursAbierto(false)}
        onConfirmar={hours => {
          addOpHoras(equipmentId, hours);
          setHoursAbierto(false);
          setAviso(`Added ${hours} hrs`);
          setTimeout(() => setAviso(null), 2000);
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  EquipmentDetailScreenNucleoAndamio: {
    backgroundColor: colors.background,
    flex: 1,
  },

  EquipmentDetailScreenMissingRecinto: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },

  EquipmentDetailScreenMissingLamina: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 18,
    marginBottom: 12,
  },

  EquipmentDetailScreenScrollContent: {
    flexGrow: 1,
  },

  EquipmentDetailScreenHeaderRowFriso: {
    alignItems: 'center',
    borderBottomColor: colors.borderSuave,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },

  EquipmentDetailScreenNavSide: {
    minWidth: 72,
  },

  EquipmentDetailScreenNavSideRight: {
    alignItems: 'flex-end',
    minWidth: 72,
  },

  EquipmentDetailScreenNavLinkLamina: {
    color: colors.gold,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },

  EquipmentDetailScreenNavLinkBoldLamina: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
  },

  EquipmentDetailScreenTitleLamina: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },

  EquipmentDetailScreenIdentityRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },

  EquipmentDetailScreenIconBox: {
    alignItems: 'center',
    backgroundColor: colors.backBoton,
    borderRadius: 16,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },

  EquipmentDetailScreenIconSello: {
    fontSize: 28,
  },

  EquipmentDetailScreenName: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
  },

  EquipmentDetailScreenMeta: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginTop: 4,
  },

  EquipmentDetailScreenKvList: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },

  EquipmentDetailScreenKvRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 38,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  EquipmentDetailScreenKvBorder: {
    borderBottomColor: colors.borderSuave,
    borderBottomWidth: 1,
  },

  EquipmentDetailScreenKvLabel: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
  },

  EquipmentDetailScreenKvValue: {
    color: colors.cream,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
  },

  EquipmentDetailScreenProgressCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
    padding: 15,
  },

  EquipmentDetailScreenProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  EquipmentDetailScreenProgressLabel: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },

  EquipmentDetailScreenProgressWarn: {
    color: colors.danger,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },

  EquipmentDetailScreenActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },

  EquipmentDetailScreenHalfBtn: {
    flex: 1,
  },

  EquipmentDetailScreenSecondaryHalf: {
    alignItems: 'center',
    backgroundColor: colors.backBoton,
    borderColor: colors.backButtonBorde,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    height: 48,
    justifyContent: 'center',
  },

  EquipmentDetailScreenSecondaryHalfLabel: {
    color: colors.backButtonText,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
  },

  EquipmentDetailScreenPressedOpaco: {
    opacity: 0.88,
  },

  EquipmentDetailScreenChangeStatusBtn: {
    alignItems: 'center',
    backgroundColor: colors.backBoton,
    borderColor: colors.backButtonBorde,
    borderRadius: 14,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    marginBottom: 12,
  },

  EquipmentDetailScreenChangeStatusLabel: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },

  EquipmentDetailScreenDeleteBtn: {
    alignItems: 'center',
    backgroundColor: colors.dangerSoftStrong,
    borderColor: colors.dangerBorde,
    borderRadius: 14,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
  },

  EquipmentDetailScreenDeleteLabel: {
    color: colors.danger,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },

  EquipmentDetailScreenToastAndamio: {
    alignSelf: 'center',
    backgroundColor: colors.toastBg,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: 'absolute',
  },

  EquipmentDetailScreenToastLamina: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },
});
