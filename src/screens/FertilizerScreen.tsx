import React, { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  CalcActions,
  CalculatorShell,
  FieldDropdown,
  ResultCard,
  SaveShareRow,
  UnitField,
} from '../components/calculators/CalculatorParts';

import {
  calcFertilizer,
  parseNumber,
  type ResultRow,
} from '../data/calculators';

import type { FarmField } from '../data/fields';
import { useFields } from '../data/FieldsContext';

type FertilizerScreenProps = {
  onBack: () => void;
};

export function FertilizerScreen({ onBack }: FertilizerScreenProps) {
  const { getField } = useFields();
  const [fieldId, setFieldId] = useState('');
  const [rate, setRate] = useState('');
  const [bagWeight, setBagWeight] = useState('');
  const [price, setPrice] = useState('');
  const [reserve, setReserve] = useState('');
  const [rows, setRows] = useState<ResultRow[]>([]);

  const field = getField(fieldId);
  const resultTitle = useMemo(
    () => `Fertilizer · ${field?.name ?? 'Field'}`,
    [field?.name],
  );

  const onSelectField = (next: FarmField) => {
    setFieldId(next.id);
  };

  const reset = () => {
    setFieldId('');
    setRate('');
    setBagWeight('');
    setPrice('');
    setReserve('');
    setRows([]);
  };

  const calculate = () => {
    setRows(
      calcFertilizer({
        areaHa: field?.areaHa ?? 0,
        rateKgHa: parseNumber(rate),
        bagKg: parseNumber(bagWeight),
        pricePerBag: parseNumber(price),
        reservePct: parseNumber(reserve),
      }),
    );
  };

  return (
    <CalculatorShell title="Fertilizer" onBack={onBack}>
      <FieldDropdown selectedId={fieldId} onSelect={onSelectField} />
      <View style={styles.FertilizerScreenGrid}>
        <UnitField
          label="Application Rate"
          value={rate}
          onChangeText={setRate}
          unit="kg/ha"
          placeholder="e.g. 180"
          flex
        />
        <UnitField
          label="Bag Weight"
          value={bagWeight}
          onChangeText={setBagWeight}
          unit="kg"
          placeholder="e.g. 50"
          flex
        />
      </View>
      <View style={styles.FertilizerScreenGrid}>
        <UnitField
          label="Price per Bag"
          value={price}
          onChangeText={setPrice}
          unit="$"
          placeholder="e.g. 32"
          flex
        />
        <UnitField
          label="Reserve"
          value={reserve}
          onChangeText={setReserve}
          unit="%"
          placeholder="e.g. 3"
          flex
        />
      </View>
      <CalcActions onReset={reset} onCalculate={calculate} />
      <ResultCard title={resultTitle} rows={rows} />
      {rows.length > 0 ? (
        <SaveShareRow
          calculatorId="fertilizer"
          title={resultTitle}
          rows={rows}
        />
      ) : null}
    </CalculatorShell>
  );
}

const styles = StyleSheet.create({
  FertilizerScreenGrid: {
    flexDirection: 'row',
    gap: 10,
  },
});
