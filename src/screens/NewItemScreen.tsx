import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { DropdownField } from '../components/forms/DropdownField';

import { colors, fonts } from '../constants/theme';
import { appBackground } from '../data/assets';

import { INVENTORY_CATEGORIES, INVENTORY_UNITS } from '../data/farm';
import type { InventoryItemDraft } from '../data/FarmContext';
import { useAdaptive } from '../hooks/useAdaptive';

type NewItemScreenProps = {
  onCancel: () => void;
  onSave: (draft: InventoryItemDraft) => void;
};

export function NewItemScreen({ onCancel, onSave }: NewItemScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptive();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [minQty, setMinQty] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [supplier, setSupplier] = useState('');

  const canSave = useMemo(
    () => name.trim().length > 0 && quantity.trim().length > 0,
    [name, quantity],
  );

  return (
    <ImageBackground
      source={appBackground}
      style={styles.NewItemScreenRootHull}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.NewItemScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalScale(6),
            paddingBottom: insets.bottom + adaptive.verticalScale(28),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.NewItemScreenHeaderRowCapstone}>
          <Pressable
            onPress={onCancel}
            hitSlop={12}
            style={styles.NewItemScreenNavSide}
          >
            <Text style={styles.NewItemScreenNavLinkFlourish}>‹ Cancel</Text>
          </Pressable>
          <Text style={styles.NewItemScreenTitleFlourish}>New Item</Text>
          <View style={styles.NewItemScreenNavSide} />
        </View>

        <View style={{ paddingHorizontal: adaptive.horizontalPadding }}>
          <FormField
            label="Item Name"
            required
            value={name}
            onChangeText={setName}
            placeholder="e.g. Urea 46%"
          />
          <DropdownField
            label="Category"
            required
            value={category}
            onChange={setCategory}
            placeholder={`e.g. ${INVENTORY_CATEGORIES[0]}`}
            options={INVENTORY_CATEGORIES}
          />
          <FormField
            label="Current Quantity"
            required
            value={quantity}
            onChangeText={setQuantity}
            placeholder="e.g. 20"
            keyboardType="decimal-pad"
          />
          <DropdownField
            label="Unit"
            required
            value={unit}
            onChange={setUnit}
            placeholder={`e.g. ${INVENTORY_UNITS[0]}`}
            options={INVENTORY_UNITS}
          />
          <FormField
            label="Minimum Quantity"
            value={minQty}
            onChangeText={setMinQty}
            placeholder="e.g. 5"
            keyboardType="decimal-pad"
          />
          <FormField
            label="Unit Cost ($)"
            value={unitCost}
            onChangeText={setUnitCost}
            placeholder="e.g. 32"
            keyboardType="decimal-pad"
          />
          <FormField
            label="Supplier"
            value={supplier}
            onChangeText={setSupplier}
            placeholder="e.g. AgriSupply Co."
          />

          <PrimaryButton
            label="Save Item"
            onPress={() => {
              if (!canSave) {
                return;
              }
              onSave({
                name,
                category: category || INVENTORY_CATEGORIES[0],
                quantity,
                unit: unit || INVENTORY_UNITS[0],
                minQty,
                unitCost,
                supplier,
              });
            }}
            fullWidth
            style={[
              styles.NewItemScreenSavePlinth,
              !canSave && styles.NewItemScreenSavePlinthDisabled,
            ]}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

export function FormField({
  label,
  required,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'decimal-pad';
}) {
  return (
    <View style={styles.NewItemScreenFieldGroup}>
      <Text style={styles.NewItemScreenFieldLabelFlourish}>
        {label}
        {required ? (
          <Text style={styles.NewItemScreenRequiredEmblem}> *</Text>
        ) : null}
      </Text>
      <View style={styles.NewItemScreenFieldInputHull}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.tabInactive}
          keyboardType={keyboardType}
          style={styles.NewItemScreenFieldInput}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  NewItemScreenRootHull: {
    backgroundColor: colors.background,
    flex: 1,
  },
  NewItemScreenScrollContent: {
    flexGrow: 1,
  },
  NewItemScreenHeaderRowCapstone: {
    alignItems: 'center',
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },

  NewItemScreenNavSide: {
    minWidth: 72,
  },

  NewItemScreenNavLinkFlourish: {
    color: colors.gold,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },
  NewItemScreenTitleFlourish: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },

  NewItemScreenFieldGroup: {
    marginBottom: 14,
  },

  NewItemScreenFieldLabelFlourish: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginBottom: 8,
  },
  NewItemScreenRequiredEmblem: {
    color: colors.danger,
  },

  NewItemScreenFieldInputHull: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.emptyBorder,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 14,
  },
  NewItemScreenFieldInput: {
    color: colors.cream,
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    padding: 0,
  },

  NewItemScreenSavePlinth: {
    marginTop: 10,
  },

  NewItemScreenSavePlinthDisabled: {
    opacity: 0.55,
  },
});
