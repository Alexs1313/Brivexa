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

import { calcSeedTasa, parseNumber, type ResultRow } from '../data/calculators';
import type { FarmField } from '../data/fields';

import { useCampos } from '../data/FieldsContext';

type SeedRateScreenProps = {
  onBack: () => void;
};

export function SeedRateScreen({ onBack }: SeedRateScreenProps) {
  const { getCampo } = useCampos();
  const [fieldId, setFieldId] = useState('');
  const [area, setSuperficie] = useState('');
  const [seedTasa, setSeedTasa] = useState('');
  const [packagePeso, setPackagePeso] = useState('');
  const [reserve, setReserve] = useState('');
  const [rows, setFilas] = useState<ResultRow[]>([]);

  const field = getCampo(fieldId);
  const resultTitulo = useMemo(
    () => `Sowing Rate · ${field?.name ?? 'Field'}`,
    [field?.name],
  );

  const onSelectCampo = (next: FarmField) => {
    setFieldId(next.id);
    setSuperficie(String(next.areaHa));
  };

  const reset = () => {
    setFieldId('');
    setSuperficie('');
    setSeedTasa('');
    setPackagePeso('');
    setReserve('');
    setFilas([]);
  };

  const calculate = () => {
    setFilas(
      calcSeedTasa({
        areaHa: parseNumber(area),
        seedRateKgHa: parseNumber(seedTasa),
        packageKg: parseNumber(packagePeso),
        reservePct: parseNumber(reserve),
      }),
    );
  };

  return (
    <CalculatorShell title="Sowing Rate" onBack={onBack}>
      <FieldDropdown selectedId={fieldId} onSelect={onSelectCampo} />
      <View style={styles.SeedRateScreenGrid}>
        <UnitField
          label="Field Area"
          value={area}
          onChangeText={setSuperficie}
          unit="ha"
          placeholder="e.g. 24.8"
          flex
        />
        <UnitField
          label="Sowing Rate"
          value={seedTasa}
          onChangeText={setSeedTasa}
          unit="kg/ha"
          placeholder="e.g. 22"
          flex
        />
      </View>
      <View style={styles.SeedRateScreenGrid}>
        <UnitField
          label="Package Weight"
          value={packagePeso}
          onChangeText={setPackagePeso}
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
      <ResultCard title={resultTitulo} rows={rows} />
      {rows.length > 0 ? (
        <SaveShareRow calculatorId="seed" title={resultTitulo} rows={rows} />
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
