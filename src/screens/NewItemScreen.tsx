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
import { appFondo } from '../data/assets';

import { INVENTORY_CATEGORIAS, INVENTORY_UNITS } from '../data/farm';
import type { InventoryItemDraft } from '../data/FarmContext';
import { useAdaptativo } from '../hooks/useAdaptativo';

type NewItemScreenProps = {
  onCancel: () => void;
  onGuardar: (draft: InventoryItemDraft) => void;
};

export function NewItemScreen({ onCancel, onGuardar }: NewItemScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptativo();
  const [name, setNombre] = useState('');
  const [category, setCategoria] = useState('');
  const [quantity, setCantidad] = useState('');
  const [unit, setUnidad] = useState('');
  const [minQty, setMinQty] = useState('');
  const [unitCosto, setUnitCosto] = useState('');
  const [supplier, setProveedor] = useState('');

  const canGuardar = useMemo(
    () => name.trim().length > 0 && quantity.trim().length > 0,
    [name, quantity],
  );

  return (
    <ImageBackground
      source={appFondo}
      style={styles.NewItemScreenRaizCasco}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.NewItemScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalEscala(6),
            paddingBottom: insets.bottom + adaptive.verticalEscala(28),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.NewItemScreenHeaderRowDintel}>
          <Pressable
            onPress={onCancel}
            hitSlop={12}
            style={styles.NewItemScreenNavSide}
          >
            <Text style={styles.NewItemScreenNavLinkFiligrana}>‹ Cancel</Text>
          </Pressable>
          <Text style={styles.NewItemScreenTitleFiligrana}>New Item</Text>
          <View style={styles.NewItemScreenNavSide} />
        </View>

        <View style={{ paddingHorizontal: adaptive.horizontalRelleno }}>
          <FormField
            label="Item Name"
            required
            value={name}
            onChangeText={setNombre}
            placeholder="e.g. Urea 46%"
          />
          <DropdownField
            label="Category"
            required
            value={category}
            onChange={setCategoria}
            placeholder={`e.g. ${INVENTORY_CATEGORIAS[0]}`}
            options={INVENTORY_CATEGORIAS}
          />
          <FormField
            label="Current Quantity"
            required
            value={quantity}
            onChangeText={setCantidad}
            placeholder="e.g. 20"
            keyboardType="decimal-pad"
          />
          <DropdownField
            label="Unit"
            required
            value={unit}
            onChange={setUnidad}
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
            value={unitCosto}
            onChangeText={setUnitCosto}
            placeholder="e.g. 32"
            keyboardType="decimal-pad"
          />
          <FormField
            label="Supplier"
            value={supplier}
            onChangeText={setProveedor}
            placeholder="e.g. AgriSupply Co."
          />

          <PrimaryButton
            label="Save Item"
            onPress={() => {
              if (!canGuardar) {
                return;
              }
              onGuardar({
                name,
                category: category || INVENTORY_CATEGORIAS[0],
                quantity,
                unit: unit || INVENTORY_UNITS[0],
                minQty,
                unitCosto,
                supplier,
              });
            }}
            fullWidth
            style={[
              styles.NewItemScreenSavePlinto,
              !canGuardar && styles.NewItemScreenSavePlintoDisabled,
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
      <Text style={styles.NewItemScreenFieldLabelFiligrana}>
        {label}
        {required ? (
          <Text style={styles.NewItemScreenRequiredEmblema}> *</Text>
        ) : null}
      </Text>
      <View style={styles.NewItemScreenFieldInputCasco}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.tabInactivo}
          keyboardType={keyboardType}
          style={styles.NewItemScreenFieldInput}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  NewItemScreenRaizCasco: {
    backgroundColor: colors.background,
    flex: 1,
  },
  NewItemScreenScrollContent: {
    flexGrow: 1,
  },
  NewItemScreenHeaderRowDintel: {
    alignItems: 'center',
    borderBottomColor: colors.borderSuave,
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

  NewItemScreenNavLinkFiligrana: {
    color: colors.gold,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },
  NewItemScreenTitleFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },

  NewItemScreenFieldGroup: {
    marginBottom: 14,
  },

  NewItemScreenFieldLabelFiligrana: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginBottom: 8,
  },
  NewItemScreenRequiredEmblema: {
    color: colors.danger,
  },

  NewItemScreenFieldInputCasco: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.emptyBorde,
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

  NewItemScreenSavePlinto: {
    marginTop: 10,
  },

  NewItemScreenSavePlintoDisabled: {
    opacity: 0.55,
  },
});
