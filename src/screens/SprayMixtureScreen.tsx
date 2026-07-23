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
  calcSprayMixture,
  parseNumber,
  type ResultRow,
} from '../data/calculators';

import type { FarmField } from '../data/fields';
import { useFields } from '../data/FieldsContext';

type SprayMixtureScreenProps = {
  onBack: () => void;
};

export function SprayMixtureScreen({ onBack }: SprayMixtureScreenProps) {
  const { getField } = useFields();
  const [fieldId, setFieldId] = useState('');
  const [waterRate, setWaterRate] = useState('');
  const [productRate, setProductRate] = useState('');
  const [tankCapacity, setTankCapacity] = useState('');
  const [packageVol, setPackageVol] = useState('');
  const [rows, setRows] = useState<ResultRow[]>([]);

  const field = getField(fieldId);
  const resultTitle = useMemo(
    () => `Spray Mixture · ${field?.name ?? 'Field'}`,
    [field?.name],
  );

  const onSelectField = (next: FarmField) => {
    setFieldId(next.id);
  };

  const reset = () => {
    setFieldId('');
    setWaterRate('');
    setProductRate('');
    setTankCapacity('');
    setPackageVol('');
    setRows([]);
  };

  const calculate = () => {
    setRows(
      calcSprayMixture({
        areaHa: field?.areaHa ?? 0,
        waterRateLHa: parseNumber(waterRate),
        productRateLHa: parseNumber(productRate),
        tankL: parseNumber(tankCapacity),
        packageL: parseNumber(packageVol),
      }),
    );
  };

  return (
    <CalculatorShell title="Spray Mixture" onBack={onBack}>
      <FieldDropdown selectedId={fieldId} onSelect={onSelectField} />
      <View style={styles.SprayMixtureScreenGrid}>
        <UnitField
          label="Water Rate"
          value={waterRate}
          onChangeText={setWaterRate}
          unit="L/ha"
          placeholder="e.g. 200"
          flex
        />
        <UnitField
          label="Product Rate"
          value={productRate}
          onChangeText={setProductRate}
          unit="L/ha"
          placeholder="e.g. 0.8"
          flex
        />
      </View>
      <View style={styles.SprayMixtureScreenGrid}>
        <UnitField
          label="Tank Capacity"
          value={tankCapacity}
          onChangeText={setTankCapacity}
          unit="L"
          placeholder="e.g. 1200"
          flex
        />
        <UnitField
          label="Package Vol."
          value={packageVol}
          onChangeText={setPackageVol}
          unit="L"
          placeholder="e.g. 5"
          flex
        />
      </View>
      <CalcActions onReset={reset} onCalculate={calculate} />
      <ResultCard title={resultTitle} rows={rows} />
      {rows.length > 0 ? (
        <SaveShareRow calculatorId="spray" title={resultTitle} rows={rows} />
      ) : null}
    </CalculatorShell>
  );
}

const styles = StyleSheet.create({
  SprayMixtureScreenGrid: {
    flexDirection: 'row',
    gap: 10,
  },
});
