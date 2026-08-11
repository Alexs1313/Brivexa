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

import { appBackground } from '../data/assets';
import { INCOME_CATEGORIES } from '../data/farm';
import type { IncomeDraft } from '../data/FarmContext';
import { useFields } from '../data/FieldsContext';

import { useAdaptive } from '../hooks/useAdaptive';
import { FormField } from './NewItemScreen';

type AddIncomeScreenProps = {
  onCancel: () => void;
  onSave: (draft: IncomeDraft) => void;
};

export function AddIncomeScreen({ onCancel, onSave }: AddIncomeScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptive();
  const { fields } = useFields();
  const fieldOptions = useMemo(() => fields.map(f => f.name), [fields]);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [field, setField] = useState('');
  const [buyer, setBuyer] = useState('');

  const canSave = useMemo(
    () => title.trim().length > 0 && amount.trim().length > 0,
    [amount, title],
  );

  return (
    <ImageBackground
      source={appBackground}
      style={styles.AddIncomeScreenRootHull}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.AddIncomeScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalScale(6),
            paddingBottom: insets.bottom + adaptive.verticalScale(28),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.AddIncomeScreenHeaderRowCapstone}>
          <Pressable
            onPress={onCancel}
            hitSlop={12}
            style={styles.AddIncomeScreenNavSide}
          >
            <Text style={styles.AddIncomeScreenNavLinkFlourish}>‹ Cancel</Text>
          </Pressable>
          <Text style={styles.AddIncomeScreenTitleFlourish}>Add Income</Text>
          <View style={styles.AddIncomeScreenNavSide} />
        </View>

        <View style={{ paddingHorizontal: adaptive.horizontalPadding }}>
          <FormField
            label="Income Title"
            required
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Winter Wheat Sale"
          />
          <FormField
            label="Amount ($)"
            required
            value={amount}
            onChangeText={setAmount}
            placeholder="e.g. 41200"
            keyboardType="decimal-pad"
          />
          <DropdownField
            label="Category"
            required
            value={category}
            onChange={setCategory}
            placeholder={`e.g. ${INCOME_CATEGORIES[0]}`}
            options={INCOME_CATEGORIES}
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
            onChange={setField}
            placeholder="e.g. River Plot"
            options={
              fieldOptions.length > 0
                ? fieldOptions
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
              if (!canSave) {
                return;
              }
              onSave({
                title,
                amount,
                category: category || INCOME_CATEGORIES[0],
                date,
                field,
                buyer,
              });
            }}
            fullWidth
            style={[
              styles.AddIncomeScreenSavePlinth,
              !canSave && styles.AddIncomeScreenSavePlinthDisabled,
            ]}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  AddIncomeScreenRootHull: {
    backgroundColor: colors.background,
    flex: 1,
  },
  AddIncomeScreenScrollContent: {
    flexGrow: 1,
  },

  AddIncomeScreenHeaderRowCapstone: {
    alignItems: 'center',
    borderBottomColor: colors.borderSoft,
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
  AddIncomeScreenNavLinkFlourish: {
    color: colors.gold,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },

  AddIncomeScreenTitleFlourish: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },

  AddIncomeScreenSavePlinth: {
    marginTop: 10,
  },
  AddIncomeScreenSavePlinthDisabled: {
    opacity: 0.55,
  },
});
