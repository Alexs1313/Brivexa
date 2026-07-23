import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '../buttons/PrimaryButton';
import { colors, fonts, radius } from '../../constants/theme';
import { appBackground } from '../../data/assets';

import type { CalculatorId, ResultRow } from '../../data/calculators';
import type { FarmField } from '../../data/fields';

import { useFields } from '../../data/FieldsContext';
import { useSavedCalculations } from '../../data/SavedCalculationsContext';
import { useAdaptive } from '../../hooks/useAdaptive';

export function CalculatorShell({
  title,
  children,
  onBack,
}: {
  title: string;
  children: React.ReactNode;
  onBack: () => void;
}) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptive();

  return (
    <ImageBackground
      source={appBackground}
      style={styles.CalculatorPartsFacetChassis}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.CalculatorPartsScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalScale(6),
            paddingBottom: insets.bottom + adaptive.verticalScale(28),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.CalculatorPartsHeaderRowLintel}>
          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={styles.CalculatorPartsNavSide}
          >
            <Text style={styles.CalculatorPartsNavLinkFiligree}>
              ‹ Calculators
            </Text>
          </Pressable>
          <Text style={styles.CalculatorPartsTitleFiligree}>{title}</Text>
          <View style={styles.CalculatorPartsNavSide} />
        </View>
        <View style={{ paddingHorizontal: adaptive.horizontalPadding }}>
          {children}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

export function UnitField({
  label,
  value,
  onChangeText,
  unit,
  flex,
  placeholder = '0',
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  unit: string;
  flex?: boolean;
  placeholder?: string;
}) {
  return (
    <View
      style={[
        styles.CalculatorPartsFieldGroup,
        flex && styles.CalculatorPartsFieldFlex,
      ]}
    >
      <Text style={styles.CalculatorPartsFieldLabelFiligree}>{label}</Text>
      <View style={styles.CalculatorPartsFieldInputChassis}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType="decimal-pad"
          placeholder={placeholder}
          placeholderTextColor={colors.tabInactive}
          style={styles.CalculatorPartsFieldInput}
        />
        <Text style={styles.CalculatorPartsUnit}>{unit}</Text>
      </View>
    </View>
  );
}

export function SelectField({
  label,
  value,
  onPress,
}: {
  label: string;
  value: string;
  onPress?: () => void;
}) {
  return (
    <View style={styles.CalculatorPartsFieldGroup}>
      <Text style={styles.CalculatorPartsFieldLabelFiligree}>{label}</Text>
      <Pressable
        onPress={onPress}
        style={styles.CalculatorPartsFieldInputChassis}
      >
        <Text style={styles.CalculatorPartsSelectValue}>{value}</Text>
        <Text style={styles.CalculatorPartsChevron}>⌄</Text>
      </Pressable>
    </View>
  );
}

export function FieldDropdown({
  label = 'Field',
  selectedId,
  onSelect,
  fields: fieldsProp,
}: {
  label?: string;
  selectedId: string;
  onSelect: (field: FarmField) => void;
  fields?: FarmField[];
}) {
  const { fields: contextFields } = useFields();
  const fields = fieldsProp ?? contextFields;
  const [open, setOpen] = useState(false);
  const selected = fields.find(field => field.id === selectedId);
  const hasSelection = Boolean(selected);

  return (
    <View style={styles.CalculatorPartsFieldGroup}>
      <Text style={styles.CalculatorPartsFieldLabelFiligree}>{label}</Text>
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.CalculatorPartsFieldInputChassis,
          open && styles.CalculatorPartsInputChassisOpen,
        ]}
      >
        <Text
          style={[
            styles.CalculatorPartsSelectValue,
            !hasSelection && styles.CalculatorPartsSelectPlaceholder,
          ]}
        >
          {selected?.name ?? 'Select field'}
        </Text>
        <Text
          style={[
            styles.CalculatorPartsChevron,
            open && styles.CalculatorPartsChevronOpen,
          ]}
        >
          ⌄
        </Text>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={styles.CalculatorPartsDropdownBackdrop}
          onPress={() => setOpen(false)}
        >
          <Pressable
            style={styles.CalculatorPartsDropdownSheet}
            onPress={e => e.stopPropagation()}
          >
            <Text style={styles.CalculatorPartsDropdownTitle}>
              Select Field
            </Text>
            {fields.map((field, index) => {
              const active = field.id === selectedId;
              return (
                <Pressable
                  key={field.id}
                  onPress={() => {
                    onSelect(field);
                    setOpen(false);
                  }}
                  style={[
                    styles.CalculatorPartsDropdownOption,
                    index < fields.length - 1 &&
                      styles.CalculatorPartsDropdownOptionBorder,
                    active && styles.CalculatorPartsDropdownOptionActive,
                  ]}
                >
                  <View style={styles.CalculatorPartsDropdownOptionCopy}>
                    <Text
                      style={[
                        styles.CalculatorPartsDropdownOptionTitle,
                        active &&
                          styles.CalculatorPartsDropdownOptionTitleActive,
                      ]}
                    >
                      {field.name}
                    </Text>
                    <Text style={styles.CalculatorPartsDropdownOptionMeta}>
                      {field.areaLabel} · {field.crop}
                    </Text>
                  </View>
                  {active ? (
                    <Text style={styles.CalculatorPartsDropdownCheck}>✓</Text>
                  ) : null}
                </Pressable>
              );
            })}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

export function CalcActions({
  onReset,
  onCalculate,
}: {
  onReset: () => void;
  onCalculate: () => void;
}) {
  return (
    <View style={styles.CalculatorPartsActionRow}>
      <Pressable onPress={onReset} style={styles.CalculatorPartsResetBtn}>
        <Text style={styles.CalculatorPartsResetLabel}>Reset</Text>
      </Pressable>
      <View style={styles.CalculatorPartsCalcBtnWrap}>
        <PrimaryButton label="Calculate" onPress={onCalculate} fullWidth />
      </View>
    </View>
  );
}

export function ResultCard({
  title,
  rows,
}: {
  title: string;
  rows: ResultRow[];
}) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <View style={styles.CalculatorPartsResultCard}>
      <View style={styles.CalculatorPartsResultHeader}>
        <Text style={styles.CalculatorPartsResultTitle}>{title}</Text>
      </View>
      {rows.map((row, index) => (
        <View
          key={row.label}
          style={[
            styles.CalculatorPartsResultRow,
            index < rows.length - 1 && styles.CalculatorPartsResultRowBorder,
          ]}
        >
          <Text style={styles.CalculatorPartsResultLabel}>{row.label}</Text>
          <Text
            style={[
              styles.CalculatorPartsResultValue,
              row.tone === 'gold' && { color: colors.gold },
              row.tone === 'success' && { color: colors.success },
            ]}
          >
            {row.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

export function SaveShareRow({
  calculatorId,
  title,
  rows,
}: {
  calculatorId: CalculatorId;
  title: string;
  rows: ResultRow[];
}) {
  const { saveCalculation } = useSavedCalculations();
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timer = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(timer);
  }, [toast]);

  const message = [
    title,
    '',
    ...rows.map(row => `${row.label}: ${row.value}`),
  ].join('\n');

  const onSave = () => {
    saveCalculation({ calculatorId, title, rows });
    setToast('Result saved');
  };

  const onShare = async () => {
    try {
      await Share.share({
        title,
        message,
      });
    } catch {
      setToast('Unable to share');
    }
  };

  return (
    <View>
      <View style={styles.CalculatorPartsSaveShareRow}>
        <Pressable
          onPress={onSave}
          style={({ pressed }) => [
            styles.CalculatorPartsSecondaryBtn,
            pressed && styles.CalculatorPartsSecondaryBtnPressed,
          ]}
        >
          <Text style={styles.CalculatorPartsSecondaryLabel}>💾 Save</Text>
        </Pressable>
        <Pressable
          onPress={onShare}
          style={({ pressed }) => [
            styles.CalculatorPartsSecondaryBtn,
            pressed && styles.CalculatorPartsSecondaryBtnPressed,
          ]}
        >
          <Text style={styles.CalculatorPartsSecondaryLabel}>↗ Share</Text>
        </Pressable>
      </View>
      {toast ? (
        <View style={styles.CalculatorPartsToastChassis}>
          <Text style={styles.CalculatorPartsToastFiligree}>{toast}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  CalculatorPartsFacetChassis: {
    backgroundColor: colors.background,
    flex: 1,
  },
  CalculatorPartsScrollContent: {
    flexGrow: 1,
  },

  CalculatorPartsHeaderRowLintel: {
    alignItems: 'center',
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },

  CalculatorPartsNavSide: {
    minWidth: 110,
  },
  CalculatorPartsNavLinkFiligree: {
    color: colors.gold,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },
  CalculatorPartsTitleFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },
  CalculatorPartsFieldGroup: {
    marginBottom: 14,
  },
  CalculatorPartsFieldFlex: {
    flex: 1,
  },

  CalculatorPartsFieldLabelFiligree: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginBottom: 8,
  },

  CalculatorPartsFieldInputChassis: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.emptyBorder,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 14,
  },
  CalculatorPartsFieldInput: {
    color: colors.cream,
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    padding: 0,
  },

  CalculatorPartsUnit: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    marginLeft: 8,
  },

  CalculatorPartsSelectValue: {
    color: colors.cream,
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },

  CalculatorPartsSelectPlaceholder: {
    color: colors.tabInactive,
  },
  CalculatorPartsChevron: {
    color: colors.tabInactive,
    fontSize: 15,
  },

  CalculatorPartsChevronOpen: {
    color: colors.gold,
    transform: [{ rotate: '180deg' }],
  },
  CalculatorPartsInputChassisOpen: {
    borderColor: colors.goldBorder,
  },
  CalculatorPartsDropdownBackdrop: {
    backgroundColor: 'rgba(8, 4, 24, 0.72)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  CalculatorPartsDropdownSheet: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
    paddingBottom: 6,
    paddingTop: 14,
  },

  CalculatorPartsDropdownTitle: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansBold,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    paddingHorizontal: 16,
    textTransform: 'uppercase',
  },
  CalculatorPartsDropdownOption: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  CalculatorPartsDropdownOptionBorder: {
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
  },
  CalculatorPartsDropdownOptionActive: {
    backgroundColor: colors.goldSoft,
  },

  CalculatorPartsDropdownOptionCopy: {
    flex: 1,
    marginRight: 12,
  },

  CalculatorPartsDropdownOptionTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
  CalculatorPartsDropdownOptionTitleActive: {
    color: colors.gold,
  },
  CalculatorPartsDropdownOptionMeta: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    marginTop: 3,
  },

  CalculatorPartsDropdownCheck: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },
  CalculatorPartsActionRow: {
    flexDirection: 'row',
    gap: 11,
    marginBottom: 14,
    marginTop: 2,
  },

  CalculatorPartsResetBtn: {
    alignItems: 'center',
    backgroundColor: colors.backButton,
    borderColor: colors.backButtonBorder,
    borderRadius: 14,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    width: 90,
  },
  CalculatorPartsResetLabel: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
  CalculatorPartsCalcBtnWrap: {
    flex: 1,
  },

  CalculatorPartsResultCard: {
    backgroundColor: colors.card,
    borderColor: colors.emptyBorder,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },

  CalculatorPartsResultHeader: {
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  CalculatorPartsResultTitle: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
  },
  CalculatorPartsResultRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 38,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  CalculatorPartsResultRowBorder: {
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
  },
  CalculatorPartsResultLabel: {
    color: colors.bodyMuted,
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginRight: 12,
  },
  CalculatorPartsResultValue: {
    color: colors.cream,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    textAlign: 'right',
  },
  CalculatorPartsSaveShareRow: {
    flexDirection: 'row',
    gap: 10,
  },

  CalculatorPartsSecondaryBtn: {
    alignItems: 'center',
    backgroundColor: colors.backButton,
    borderColor: colors.goldBorder,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },

  CalculatorPartsSecondaryBtnPressed: {
    opacity: 0.85,
  },
  CalculatorPartsSecondaryLabel: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },

  CalculatorPartsToastChassis: {
    alignSelf: 'center',
    backgroundColor: colors.toastBg,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  CalculatorPartsToastFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },
});
