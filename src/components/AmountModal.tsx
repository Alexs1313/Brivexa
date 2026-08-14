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
  unitEtiqueta?: string;
  placeholder?: string;
  confirmEtiqueta: string;
  onCancel: () => void;
  onConfirmar: (amount: number) => void;
};

export function AmountModal({
  visible,
  title,
  subtitle,
  unitEtiqueta,
  placeholder = 'e.g. 10',
  confirmEtiqueta,
  onCancel,
  onConfirmar,
}: AmountModalProps) {
  const [value, setValor] = useState('');

  useEffect(() => {
    if (visible) {
      setValor('');
    }
  }, [visible]);

  const amount = useMemo(() => {
    const n = Number(value.replace(',', '.').trim());
    return Number.isFinite(n) ? n : 0;
  }, [value]);

  const canConfirmar = amount > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <Pressable style={styles.AmountModalBackdropVelo} onPress={onCancel}>
        <Pressable
          style={styles.AmountModalSheetCasco}
          onPress={e => e.stopPropagation()}
        >
          <Text style={styles.AmountModalTitleFiligrana}>{title}</Text>
          {subtitle ? (
            <Text style={styles.AmountModalSubtitleFiligrana}>{subtitle}</Text>
          ) : null}

          <View style={styles.AmountModalFieldInputCasco}>
            <TextInput
              value={value}
              onChangeText={setValor}
              keyboardType="decimal-pad"
              placeholder={placeholder}
              placeholderTextColor={colors.tabInactivo}
              style={styles.AmountModalFieldInput}
              autoFocus
            />
            {unitEtiqueta ? (
              <Text style={styles.AmountModalUnit}>{unitEtiqueta}</Text>
            ) : null}
          </View>

          <PrimaryButton
            label={confirmEtiqueta}
            onPress={() => {
              if (!canConfirmar) {
                return;
              }
              onConfirmar(amount);
            }}
            fullWidth
            style={[
              styles.AmountModalConfirmPlinto,
              !canConfirmar && styles.AmountModalPlintoDisabled,
            ]}
          />
          <Pressable onPress={onCancel} style={styles.AmountModalCancelPlinto}>
            <Text style={styles.AmountModalCancelFiligrana}>Cancel</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  AmountModalBackdropVelo: {
    alignItems: 'center',
    backgroundColor: 'rgba(8, 5, 24, 0.72)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  AmountModalSheetCasco: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 18,
    width: '100%',
  },
  AmountModalTitleFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 17,
    fontWeight: '700',
  },
  AmountModalSubtitleFiligrana: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginTop: 6,
  },
  AmountModalFieldInputCasco: {
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
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    marginLeft: 8,
  },
  AmountModalConfirmPlinto: {
    marginTop: 14,
  },

  AmountModalPlintoDisabled: {
    opacity: 0.45,
  },

  AmountModalCancelPlinto: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    marginTop: 4,
  },

  AmountModalCancelFiligrana: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
});
