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

import { calcSeedRate, parseNumber, type ResultRow } from '../data/calculators';
import type { FarmField } from '../data/fields';

import { useFields } from '../data/FieldsContext';

type SeedRateScreenProps = {
  onBack: () => void;
};

export function SeedRateScreen({ onBack }: SeedRateScreenProps) {
  const { getField } = useFields();
  const [fieldId, setFieldId] = useState('');
  const [area, setArea] = useState('');
  const [seedRate, setSeedRate] = useState('');
  const [packageWeight, setPackageWeight] = useState('');
  const [reserve, setReserve] = useState('');
  const [rows, setRows] = useState<ResultRow[]>([]);

  const field = getField(fieldId);
  const resultTitle = useMemo(
    () => `Seed Rate · ${field?.name ?? 'Field'}`,
    [field?.name],
  );

  const onSelectField = (next: FarmField) => {
    setFieldId(next.id);
    setArea(String(next.areaHa));
  };

  const reset = () => {
    setFieldId('');
    setArea('');
    setSeedRate('');
    setPackageWeight('');
    setReserve('');
    setRows([]);
  };

  const calculate = () => {
    setRows(
      calcSeedRate({
        areaHa: parseNumber(area),
        seedRateKgHa: parseNumber(seedRate),
        packageKg: parseNumber(packageWeight),
        reservePct: parseNumber(reserve),
      }),
    );
  };

  return (
    <CalculatorShell title="Seed Rate" onBack={onBack}>
      <FieldDropdown selectedId={fieldId} onSelect={onSelectField} />
      <View style={styles.SeedRateScreenGrid}>
        <UnitField
          label="Field Area"
          value={area}
          onChangeText={setArea}
          unit="ha"
          placeholder="e.g. 24.8"
          flex
        />
        <UnitField
          label="Seed Rate"
          value={seedRate}
          onChangeText={setSeedRate}
          unit="kg/ha"
          placeholder="e.g. 22"
          flex
        />
      </View>
      <View style={styles.SeedRateScreenGrid}>
        <UnitField
          label="Package Weight"
          value={packageWeight}
          onChangeText={setPackageWeight}
          unit="kg"
          placeholder="e.g. 25"
          flex
        />
        <UnitField
          label="Reserve"
          value={reserve}
          onChangeText={setReserve}
          unit="%"
          placeholder="e.g. 5"
          flex
        />
      </View>
      <CalcActions onReset={reset} onCalculate={calculate} />
      <ResultCard title={resultTitle} rows={rows} />
      {rows.length > 0 ? (
        <SaveShareRow calculatorId="seed" title={resultTitle} rows={rows} />
      ) : null}
    </CalculatorShell>
  );
}

const styles = StyleSheet.create({
  SeedRateScreenGrid: {
    flexDirection: 'row',
    gap: 10,
  },
});
