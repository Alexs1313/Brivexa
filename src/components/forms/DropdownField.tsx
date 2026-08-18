import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { colors, fonts, radius } from '../../constants/theme';

type DropdownFieldProps = {
  label: string;
  required?: boolean;
  value: string;
  placeholder: string;
  options: readonly string[];
  onChange: (value: string) => void;
  title?: string;
};

export function DropdownField({
  label,
  required,
  value,
  placeholder,
  options,
  onChange,
  title,
}: DropdownFieldProps) {
  const [open, setAbierto] = useState(false);
  const hasValor = value.trim().length > 0;
  const menuOpciones =
    hasValor && !options.some(option => option === value)
      ? [value, ...options]
      : [...options];

  return (
    <View style={styles.DropdownFieldFieldGroup}>
      <Text style={styles.DropdownFieldFieldLabelFiligrana}>
        {label}
        {required ? (
          <Text style={styles.DropdownFieldRequiredEmblema}> *</Text>
        ) : null}
      </Text>
      <View
        style={[
          styles.DropdownFieldFieldInputCasco,
          open && styles.DropdownFieldInputCascoOpen,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.tabInactivo}
          style={styles.DropdownFieldSelectInput}
        />
        <Pressable
          onPress={() => setAbierto(true)}
          hitSlop={8}
          style={styles.DropdownFieldChevronHit}
          accessibilityRole="button"
          accessibilityLabel={`Open ${label} options`}
        >
          <Text
            style={[
              styles.DropdownFieldChevron,
              open && styles.DropdownFieldChevronOpen,
            ]}
          >
            ⌄
          </Text>
        </Pressable>
      </View>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setAbierto(false)}
      >
        <Pressable
          style={styles.DropdownFieldBackdropVelo}
          onPress={() => setAbierto(false)}
        >
          <Pressable
            style={styles.DropdownFieldSheetCasco}
            onPress={e => e.stopPropagation()}
          >
            <Text style={styles.DropdownFieldSheetTitle}>
              {title ?? `Select ${label}`}
            </Text>
            <ScrollView
              style={styles.DropdownFieldOptionsScroll}
              bounces={false}
              showsVerticalScrollIndicator={false}
            >
              {menuOpciones.map((option, index) => {
                const active = option === value;
                return (
                  <Pressable
                    key={option}
                    onPress={() => {
                      onChange(option);
                      setAbierto(false);
                    }}
                    style={[
                      styles.DropdownFieldOption,
                      index < menuOpciones.length - 1 &&
                        styles.DropdownFieldOptionBorder,
                      active && styles.DropdownFieldOptionActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.DropdownFieldOptionTitle,
                        active && styles.DropdownFieldOptionTitleActive,
                      ]}
                    >
                      {option}
                    </Text>
                    {active ? (
                      <Text style={styles.DropdownFieldCheck}>✓</Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  DropdownFieldFieldGroup: {
    marginBottom: 14,
  },
  DropdownFieldFieldLabelFiligrana: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginBottom: 8,
  },


  DropdownFieldRequiredEmblema: {
    color: colors.danger,
  },



  DropdownFieldFieldInputCasco: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.emptyBorde,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    paddingLeft: 14,
    paddingRight: 4,
  },



  DropdownFieldInputCascoOpen: {
    borderColor: colors.goldBorde,
  },

  DropdownFieldSelectInput: {
    color: colors.cream,
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    paddingVertical: 0,
  },

  DropdownFieldChevronHit: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },


  DropdownFieldChevron: {
    color: colors.tabInactivo,
    fontSize: 15,
  },



  DropdownFieldChevronOpen: {
    color: colors.gold,
    transform: [{ rotate: '180deg' }],
  },

  DropdownFieldBackdropVelo: {
    backgroundColor: 'rgba(8, 4, 24, 0.72)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  DropdownFieldSheetCasco: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    maxHeight: '70%',
    overflow: 'hidden',
    paddingBottom: 6,
    paddingTop: 14,
  },


  DropdownFieldSheetTitle: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansBold,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
    paddingHorizontal: 16,
    textTransform: 'uppercase',
  },
  DropdownFieldOptionsScroll: {
    flexGrow: 0,
  },
  DropdownFieldOption: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  DropdownFieldOptionBorder: {
    borderBottomColor: colors.borderSuave,
    borderBottomWidth: 1,
  },
  DropdownFieldOptionActive: {
    backgroundColor: colors.goldSuave,
  },



  DropdownFieldOptionTitle: {
    color: colors.cream,
    flex: 1,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
    marginRight: 12,
  },
  DropdownFieldOptionTitleActive: {
    color: colors.gold,
  },

  DropdownFieldCheck: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },
});
