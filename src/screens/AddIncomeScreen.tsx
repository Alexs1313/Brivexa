import React, { useMemo, useState } from 'react';
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
import { colors, fonts } from '../constants/theme';

import { appFondo } from '../data/assets';
import { INCOME_CATEGORIAS } from '../data/farm';
import type { IncomeDraft } from '../data/FarmContext';
import { useCampos } from '../data/FieldsContext';

import { useAdaptativo } from '../hooks/useAdaptativo';
import { FormField } from './NewItemScreen';

type AddIncomeScreenProps = {
  onCancel: () => void;
  onGuardar: (draft: IncomeDraft) => void;
};

export function AddIncomeScreen({ onCancel, onGuardar }: AddIncomeScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptativo();
  const { fields } = useCampos();
  const fieldOpciones = useMemo(() => fields.map(f => f.name), [fields]);
  const [title, setTitulo] = useState('');
  const [amount, setMonto] = useState('');
  const [category, setCategoria] = useState('');
  const [date, setDate] = useState('');
  const [field, setCampo] = useState('');
  const [buyer, setBuyer] = useState('');

  const canGuardar = useMemo(
    () => title.trim().length > 0 && amount.trim().length > 0,
    [amount, title],
  );

  return (
    <ImageBackground
      source={appFondo}
      style={styles.AddIncomeScreenRaizCasco}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.AddIncomeScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalEscala(6),
            paddingBottom: insets.bottom + adaptive.verticalEscala(28),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.AddIncomeScreenHeaderRowDintel}>
          <Pressable
            onPress={onCancel}
            hitSlop={12}
            style={styles.AddIncomeScreenNavSide}
          >
            <Text style={styles.AddIncomeScreenNavLinkFiligrana}>‹ Cancel</Text>
          </Pressable>
          <Text style={styles.AddIncomeScreenTitleFiligrana}>Add Income</Text>
          <View style={styles.AddIncomeScreenNavSide} />
        </View>

        <View style={{ paddingHorizontal: adaptive.horizontalRelleno }}>
          <FormField
            label="Income Title"
            required
            value={title}
            onChangeText={setTitulo}
            placeholder="e.g. Winter Wheat Sale"
          />
          <FormField
            label="Amount ($)"
            required
            value={amount}
            onChangeText={setMonto}
            placeholder="e.g. 41200"
            keyboardType="decimal-pad"
          />
          <DropdownField
            label="Category"
            required
            value={category}
            onChange={setCategoria}
            placeholder={`e.g. ${INCOME_CATEGORIAS[0]}`}
            options={INCOME_CATEGORIAS}
          />
          <FormField
            label="Date"
            value={date}
            onChangeText={setDate}
            placeholder="e.g. Jul 22, 2026"
          />
          <DropdownField
            label="Field"
            value={field}
            onChange={setCampo}
            placeholder="e.g. River Plot"
            options={
              fieldOpciones.length > 0
                ? fieldOpciones
                : ['River Plot', 'North Field']
            }
          />
          <FormField
            label="Buyer"
            value={buyer}
            onChangeText={setBuyer}
            placeholder="e.g. GrainCo"
          />

          <PrimaryButton
            label="Save Income"
            onPress={() => {
              if (!canGuardar) {
                return;
              }
              onGuardar({
                title,
                amount,
                category: category || INCOME_CATEGORIAS[0],
                date,
                field,
                buyer,
              });
            }}
            fullWidth
            style={[
              styles.AddIncomeScreenSavePlinto,
              !canGuardar && styles.AddIncomeScreenSavePlintoDisabled,
            ]}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  AddIncomeScreenRaizCasco: {
    backgroundColor: colors.background,
    flex: 1,
  },

  AddIncomeScreenScrollContent: {
    flexGrow: 1,
  },

  AddIncomeScreenHeaderRowDintel: {
    alignItems: 'center',
    borderBottomColor: colors.borderSuave,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },


  AddIncomeScreenNavSide: {
    minWidth: 72,
  },


  AddIncomeScreenNavLinkFiligrana: {
    color: colors.gold,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },
  AddIncomeScreenTitleFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },


  AddIncomeScreenSavePlinto: {
    marginTop: 10,
  },
  AddIncomeScreenSavePlintoDisabled: {
    opacity: 0.55,
  },
});
