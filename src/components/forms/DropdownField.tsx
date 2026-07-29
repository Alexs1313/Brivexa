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
  const [open, setOpen] = useState(false);
  const hasValue = value.trim().length > 0;
  const menuOptions =
    hasValue && !options.some(option => option === value)
      ? [value, ...options]
      : [...options];

  return (
    <View style={styles.DropdownFieldFieldGroup}>
      <Text style={styles.DropdownFieldFieldLabelFiligree}>
        {label}
        {required ? (
          <Text style={styles.DropdownFieldRequiredSigil}> *</Text>
        ) : null}
      </Text>
      <View
        style={[
          styles.DropdownFieldFieldInputChassis,
          open && styles.DropdownFieldInputChassisOpen,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor={colors.tabInactive}
          style={styles.DropdownFieldSelectInput}
        />
        <Pressable
          onPress={() => setOpen(true)}
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
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={styles.DropdownFieldBackdropVeil}
          onPress={() => setOpen(false)}
        >
          <Pressable
            style={styles.DropdownFieldSheetChassis}
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
              {menuOptions.map((option, index) => {
                const active = option === value;
                return (
                  <Pressable
                    key={option}
                    onPress={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    style={[
                      styles.DropdownFieldOption,
                      index < menuOptions.length - 1 &&
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
  DropdownFieldFieldLabelFiligree: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginBottom: 8,
  },
  DropdownFieldRequiredSigil: {
    color: colors.danger,
  },
  DropdownFieldFieldInputChassis: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.emptyBorder,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    paddingLeft: 14,
    paddingRight: 4,
  },
  DropdownFieldInputChassisOpen: {
    borderColor: colors.goldBorder,
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
    color: colors.tabInactive,
    fontSize: 15,
  },
  DropdownFieldChevronOpen: {
    color: colors.gold,
    transform: [{ rotate: '180deg' }],
  },
  DropdownFieldBackdropVeil: {
    backgroundColor: 'rgba(8, 4, 24, 0.72)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  DropdownFieldSheetChassis: {
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
    color: colors.bodyMuted,
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
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
  },
  DropdownFieldOptionActive: {
    backgroundColor: colors.goldSoft,
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
