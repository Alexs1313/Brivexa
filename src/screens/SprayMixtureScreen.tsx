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
  calcSprayMezcla,
  parseNumber,
  type ResultRow,
} from '../data/calculators';

import type { FarmField } from '../data/fields';
import { useCampos } from '../data/FieldsContext';

type SprayMixtureScreenProps = {
  onBack: () => void;
};

export function SprayMixtureScreen({ onBack }: SprayMixtureScreenProps) {
  const { getCampo } = useCampos();
  const [fieldId, setFieldId] = useState('');
  const [waterTasa, setWaterTasa] = useState('');
  const [productTasa, setProductTasa] = useState('');
  const [tankCapacidad, setTankCapacidad] = useState('');
  const [packageVol, setPackageVol] = useState('');
  const [rows, setFilas] = useState<ResultRow[]>([]);

  const field = getCampo(fieldId);
  const resultTitulo = useMemo(
    () => `Spray Mixture · ${field?.name ?? 'Field'}`,
    [field?.name],
  );

  const onSelectCampo = (next: FarmField) => {
    setFieldId(next.id);
  };

  const reset = () => {
    setFieldId('');
    setWaterTasa('');
    setProductTasa('');
    setTankCapacidad('');
    setPackageVol('');
    setFilas([]);
  };

  const calculate = () => {
    setFilas(
      calcSprayMezcla({
        areaHa: field?.areaHa ?? 0,
        waterRateLHa: parseNumber(waterTasa),
        productRateLHa: parseNumber(productTasa),
        tankL: parseNumber(tankCapacidad),
        packageL: parseNumber(packageVol),
      }),
    );
  };

  return (
    <CalculatorShell title="Spray Mixture" onBack={onBack}>
      <FieldDropdown selectedId={fieldId} onSelect={onSelectCampo} />
      <View style={styles.SprayMixtureScreenGrid}>
        <UnitField
          label="Water Rate"
          value={waterTasa}
          onChangeText={setWaterTasa}
          unit="L/ha"
          placeholder="e.g. 200"
          flex
        />
        <UnitField
          label="Product Rate"
          value={productTasa}
          onChangeText={setProductTasa}
          unit="L/ha"
          placeholder="e.g. 0.8"
          flex
        />
      </View>
      <View style={styles.SprayMixtureScreenGrid}>
        <UnitField
          label="Tank Capacity"
          value={tankCapacidad}
          onChangeText={setTankCapacidad}
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
      <ResultCard title={resultTitulo} rows={rows} />
      {rows.length > 0 ? (
        <SaveShareRow calculatorId="spray" title={resultTitulo} rows={rows} />
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
