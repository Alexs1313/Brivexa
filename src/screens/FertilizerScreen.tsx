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
  calcAbono,
  parseNumber,
  type ResultRow,
} from '../data/calculators';

import type { FarmField } from '../data/fields';
import { useCampos } from '../data/FieldsContext';

type FertilizerScreenProps = {
  onBack: () => void;
};

export function FertilizerScreen({ onBack }: FertilizerScreenProps) {
  const { getCampo } = useCampos();
  const [fieldId, setFieldId] = useState('');
  const [rate, setTasa] = useState('');
  const [bagPeso, setBagPeso] = useState('');
  const [price, setPrecio] = useState('');
  const [reserve, setReserve] = useState('');
  const [rows, setFilas] = useState<ResultRow[]>([]);

  const field = getCampo(fieldId);
  const resultTitulo = useMemo(
    () => `Fertilizer · ${field?.name ?? 'Field'}`,
    [field?.name],
  );

  const onSelectCampo = (next: FarmField) => {
    setFieldId(next.id);
  };

  const reset = () => {
    setFieldId('');
    setTasa('');
    setBagPeso('');
    setPrecio('');
    setReserve('');
    setFilas([]);
  };

  const calculate = () => {
    setFilas(
      calcAbono({
        areaHa: field?.areaHa ?? 0,
        rateKgHa: parseNumber(rate),
        bagKg: parseNumber(bagPeso),
        pricePerBag: parseNumber(price),
        reservePct: parseNumber(reserve),
      }),
    );
  };

  return (
    <CalculatorShell title="Fertilizer" onBack={onBack}>
      <FieldDropdown selectedId={fieldId} onSelect={onSelectCampo} />
      <View style={styles.FertilizerScreenGrid}>
        <UnitField
          label="Application Rate"
          value={rate}
          onChangeText={setTasa}
          unit="kg/ha"
          placeholder="e.g. 180"
          flex
        />
        <UnitField
          label="Bag Weight"
          value={bagPeso}
          onChangeText={setBagPeso}
          unit="kg"
          placeholder="e.g. 50"
          flex
        />
      </View>
      <View style={styles.FertilizerScreenGrid}>
        <UnitField
          label="Price per Bag"
          value={price}
          onChangeText={setPrecio}
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
      <ResultCard title={resultTitulo} rows={rows} />
      {rows.length > 0 ? (
        <SaveShareRow
          calculatorId="fertilizer"
          title={resultTitulo}
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
