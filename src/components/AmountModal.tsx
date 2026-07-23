import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { PrimaryButton } from './buttons/PrimaryButton';
import { colors, fonts, radius } from '../constants/theme';

type AmountModalProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  unitLabel?: string;
  placeholder?: string;
  confirmLabel: string;
  onCancel: () => void;
  onConfirm: (amount: number) => void;
};

export function AmountModal({
  visible,
  title,
  subtitle,
  unitLabel,
  placeholder = 'e.g. 10',
  confirmLabel,
  onCancel,
  onConfirm,
}: AmountModalProps) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (visible) {
      setValue('');
    }
  }, [visible]);

  const amount = useMemo(() => {
    const n = Number(value.replace(',', '.').trim());
    return Number.isFinite(n) ? n : 0;
  }, [value]);

  const canConfirm = amount > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.AmountModalBackdropVeil} onPress={onCancel}>
        <Pressable
          style={styles.AmountModalSheetChassis}
          onPress={e => e.stopPropagation()}
        >
          <Text style={styles.AmountModalTitleFiligree}>{title}</Text>
          {subtitle ? (
            <Text style={styles.AmountModalSubtitleFiligree}>{subtitle}</Text>
          ) : null}

          <View style={styles.AmountModalFieldInputChassis}>
            <TextInput
              value={value}
              onChangeText={setValue}
              keyboardType="decimal-pad"
              placeholder={placeholder}
              placeholderTextColor={colors.tabInactive}
              style={styles.AmountModalFieldInput}
              autoFocus
            />
            {unitLabel ? (
              <Text style={styles.AmountModalUnit}>{unitLabel}</Text>
            ) : null}
          </View>

          <PrimaryButton
            label={confirmLabel}
            onPress={() => {
              if (!canConfirm) {
                return;
              }
              onConfirm(amount);
            }}
            fullWidth
            style={[
              styles.AmountModalConfirmPortico,
              !canConfirm && styles.AmountModalPorticoDisabled,
            ]}
          />
          <Pressable onPress={onCancel} style={styles.AmountModalCancelPortico}>
            <Text style={styles.AmountModalCancelFiligree}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  AmountModalBackdropVeil: {
    alignItems: 'center',
    backgroundColor: 'rgba(8, 5, 24, 0.72)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  AmountModalSheetChassis: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 18,
    width: '100%',
  },
  AmountModalTitleFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 17,
    fontWeight: '700',
  },
  AmountModalSubtitleFiligree: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginTop: 6,
  },
  AmountModalFieldInputChassis: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    marginTop: 16,
    paddingHorizontal: 14,
  },
  AmountModalFieldInput: {
    color: colors.cream,
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 16,
    padding: 0,
  },
  AmountModalUnit: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    marginLeft: 8,
  },
  AmountModalConfirmPortico: {
    marginTop: 14,
  },

  AmountModalPorticoDisabled: {
    opacity: 0.45,
  },

  AmountModalCancelPortico: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginTop: 4,
  },

  AmountModalCancelFiligree: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
});
