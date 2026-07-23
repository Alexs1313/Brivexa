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
import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { colors, fonts } from '../constants/theme';

import { appBackground } from '../data/assets';

import { useFarm } from '../data/FarmContext';
import { useAdaptive } from '../hooks/useAdaptive';

type EquipmentDetailScreenProps = {
  equipmentId: string;
  onBack: () => void;
  onEdit: () => void;
  onAddMaintenance: () => void;
  onDelete: () => void;
};

export function EquipmentDetailScreen({
  equipmentId,
  onBack,
  onEdit,
  onAddMaintenance,
  onDelete,
}: EquipmentDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptive();
  const { getEquipment, addOpHours, removeEquipment, cycleEquipmentStatus } =
    useFarm();
  const item = getEquipment(equipmentId);
  const [hoursOpen, setHoursOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  if (!item) {
    return (
      <View style={styles.EquipmentDetailScreenMissingEnclave}>
        <Text style={styles.EquipmentDetailScreenMissingFiligree}>
          Equipment not found
        </Text>
        <Pressable onPress={onBack}>
          <Text style={styles.EquipmentDetailScreenNavLinkFiligree}>
            ‹ Farm
          </Text>
        </Pressable>
      </View>
    );
  }

  const nextServiceLabel =
    item.hoursToService != null ? `in ${item.hoursToService} hrs` : '—';
  const serviceProgressLabel =
    item.hoursToService != null
      ? `${item.hoursToService} hrs to service`
      : 'On schedule';

  const rows: {
    label: string;
    value: string;
    tone?: 'success' | 'danger' | 'money';
  }[] = [
    { label: 'Status', value: item.status, tone: 'success' },
    { label: 'Operating Hours', value: item.hoursLabel },
    { label: 'Service Interval', value: `${item.serviceIntervalHrs} hrs` },
    {
      label: 'Next Service',
      value: nextServiceLabel,
      tone:
        item.hoursToService != null && item.hoursToService <= 10
          ? 'danger'
          : undefined,
    },
    { label: 'Fuel Type', value: item.fuelType },
    { label: 'Total Maint. Cost', value: item.maintCostLabel, tone: 'money' },
  ];

  return (
    <ImageBackground
      source={appBackground}
      style={styles.EquipmentDetailScreenFacetChassis}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.EquipmentDetailScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalScale(6),
            paddingBottom: insets.bottom + adaptive.verticalScale(28),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.EquipmentDetailScreenHeaderRowLintel}>
          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={styles.EquipmentDetailScreenNavSide}
          >
            <Text style={styles.EquipmentDetailScreenNavLinkFiligree}>
              ‹ Farm
            </Text>
          </Pressable>
          <Text style={styles.EquipmentDetailScreenTitleFiligree}>
            Equipment
          </Text>
          <Pressable
            onPress={onEdit}
            hitSlop={12}
            style={styles.EquipmentDetailScreenNavSideRight}
          >
            <Text style={styles.EquipmentDetailScreenNavLinkBoldFiligree}>
              Edit
            </Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: adaptive.horizontalPadding }}>
          <View style={styles.EquipmentDetailScreenIdentityRow}>
            <View style={styles.EquipmentDetailScreenIconBox}>
              <Text style={styles.EquipmentDetailScreenIconGlyph}>
                {item.icon}
              </Text>
            </View>
            <View>
              <Text style={styles.EquipmentDetailScreenName}>{item.name}</Text>
              <Text style={styles.EquipmentDetailScreenMeta}>
                {item.type} · {item.modelYear}
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
                    row.tone === 'money' && { color: colors.expenseMoney },
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
                {serviceProgressLabel}
              </Text>
            </View>
            <View style={styles.EquipmentDetailScreenProgressTrack}>
              <View
                style={[
                  styles.EquipmentDetailScreenProgressFill,
                  { width: `${item.serviceProgress * 100}%` },
                ]}
              />
            </View>
          </View>

          <View style={styles.EquipmentDetailScreenActionRow}>
            <View style={styles.EquipmentDetailScreenHalfBtn}>
              <PrimaryButton
                label="+ Maintenance"
                onPress={onAddMaintenance}
                fullWidth
              />
            </View>
            <Pressable
              onPress={() => setHoursOpen(true)}
              style={({ pressed }) => [
                styles.EquipmentDetailScreenSecondaryHalf,
                pressed && styles.EquipmentDetailScreenPressedDim,
              ]}
            >
              <Text style={styles.EquipmentDetailScreenSecondaryHalfLabel}>
                + Op. Hours
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => {
              const next = cycleEquipmentStatus(equipmentId);
              setToast(`Status → ${next}`);
              setTimeout(() => setToast(null), 2000);
            }}
            style={({ pressed }) => [
              styles.EquipmentDetailScreenChangeStatusBtn,
              pressed && styles.EquipmentDetailScreenPressedDim,
            ]}
          >
            <Text style={styles.EquipmentDetailScreenChangeStatusLabel}>
              Change Status
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              removeEquipment(equipmentId);
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
            styles.EquipmentDetailScreenToastChassis,
            { bottom: insets.bottom + adaptive.verticalScale(24) },
          ]}
        >
          <Text style={styles.EquipmentDetailScreenToastFiligree}>{toast}</Text>
        </View>
      ) : null}

      <AmountModal
        visible={hoursOpen}
        title="Add Operating Hours"
        subtitle={item.name}
        unitLabel="hrs"
        placeholder="e.g. 5"
        confirmLabel="Add Hours"
        onCancel={() => setHoursOpen(false)}
        onConfirm={hours => {
          addOpHours(equipmentId, hours);
          setHoursOpen(false);
          setToast(`Added ${hours} hrs`);
          setTimeout(() => setToast(null), 2000);
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  EquipmentDetailScreenFacetChassis: {
    backgroundColor: colors.background,
    flex: 1,
  },
  EquipmentDetailScreenMissingEnclave: {
    alignItems: 'center',
    backgroundColor: colors.background,
    flex: 1,
    justifyContent: 'center',
  },

  EquipmentDetailScreenMissingFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 18,
    marginBottom: 12,
  },
  EquipmentDetailScreenScrollContent: {
    flexGrow: 1,
  },
  EquipmentDetailScreenHeaderRowLintel: {
    alignItems: 'center',
    borderBottomColor: colors.borderSoft,
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

  EquipmentDetailScreenNavLinkFiligree: {
    color: colors.gold,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },

  EquipmentDetailScreenNavLinkBoldFiligree: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
  },
  EquipmentDetailScreenTitleFiligree: {
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
    backgroundColor: colors.backButton,
    borderRadius: 16,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },

  EquipmentDetailScreenIconGlyph: {
    fontSize: 28,
  },

  EquipmentDetailScreenName: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
  },
  EquipmentDetailScreenMeta: {
    color: colors.bodyMuted,
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
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
  },

  EquipmentDetailScreenKvLabel: {
    color: colors.bodyMuted,
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
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },

  EquipmentDetailScreenProgressWarn: {
    color: colors.danger,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },
  EquipmentDetailScreenProgressTrack: {
    backgroundColor: colors.progressTrackDeep,
    borderRadius: 4,
    height: 8,
    overflow: 'hidden',
  },
  EquipmentDetailScreenProgressFill: {
    backgroundColor: colors.danger,
    borderRadius: 4,
    height: '100%',
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
    backgroundColor: colors.backButton,
    borderColor: colors.backButtonBorder,
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

  EquipmentDetailScreenPressedDim: {
    opacity: 0.88,
  },
  EquipmentDetailScreenChangeStatusBtn: {
    alignItems: 'center',
    backgroundColor: colors.backButton,
    borderColor: colors.backButtonBorder,
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
    borderColor: colors.dangerBorder,
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
  EquipmentDetailScreenToastChassis: {
    alignSelf: 'center',
    backgroundColor: colors.toastBg,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: 'absolute',
  },

  EquipmentDetailScreenToastFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },
});
