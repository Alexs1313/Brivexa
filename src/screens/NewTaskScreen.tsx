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
import { useGranja } from '../data/FarmContext';

import { useCampos } from '../data/FieldsContext';
import {
  PRIORITY_OPCIONES,
  START_TIME_OPCIONES,
  WORKER_OPCIONES,
  WORK_TYPE_OPCIONES,
} from '../data/formOpciones';

import type { NewTaskDraft } from '../data/TasksContext';
import { useAdaptativo } from '../hooks/useAdaptativo';

type NewTaskScreenProps = {
  onCancel: () => void;
  onGuardar: (draft: NewTaskDraft) => void;
};

export function NewTaskScreen({ onCancel, onGuardar }: NewTaskScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptativo();
  const { fields } = useCampos();
  const { equipment } = useGranja();

  const fieldOpciones = useMemo(() => fields.map(f => f.name), [fields]);
  const equipmentOpciones = useMemo(
    () => equipment.map(item => item.name),
    [equipment],
  );

  const [title, setTitulo] = useState('');

  const [workTipo, setWorkTipo] = useState('');
  const [field, setCampo] = useState('');

  const [date, setDate] = useState('');
  const [startTiempo, setStartTiempo] = useState('');

  const [worker, setTrabajador] = useState('');
  const [priority, setPrioridad] = useState('');

  const [materials, setMateriales] = useState('');
  const [equipmentNombre, setEquipmentNombre] = useState('');

  const canGuardar = useMemo(
    () =>
      title.trim().length > 0 &&
      workTipo.trim().length > 0 &&
      field.trim().length > 0 &&
      date.trim().length > 0,
    [date, field, title, workTipo],
  );

  return (
    <ImageBackground
      source={appFondo}
      style={styles.NewTaskScreenRaizCasco}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.NewTaskScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalEscala(6),
            paddingBottom: insets.bottom + adaptive.verticalEscala(28),
            paddingHorizontal: adaptive.horizontalRelleno,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.NewTaskScreenHeaderRowDintel}>
          <Pressable
            onPress={onCancel}
            hitSlop={12}
            style={styles.NewTaskScreenNavSide}
          >
            <Text style={styles.NewTaskScreenNavLinkFiligrana}>‹ Cancel</Text>
          </Pressable>
          <Text style={styles.NewTaskScreenTitleFiligrana}>New Task</Text>
          <View style={styles.NewTaskScreenNavSide} />
        </View>

        <FormField
          label="Task Title"
          required
          value={title}
          onChangeText={setTitulo}
          placeholder="e.g. Plant Corn"
        />
        <DropdownField
          label="Work Type"
          required
          value={workTipo}
          onChange={setWorkTipo}
          placeholder="e.g. Planting"
          options={WORK_TYPE_OPCIONES}
        />
        <DropdownField
          label="Field"
          required
          value={field}
          onChange={setCampo}
          placeholder="e.g. North Field"
          options={
            fieldOpciones.length > 0
              ? fieldOpciones
              : ['North Field', 'River Plot']
          }
        />
        <FormField
          label="Date"
          required
          value={date}
          onChangeText={setDate}
          placeholder="e.g. Jul 22, 2026"
        />
        <DropdownField
          label="Start Time"
          value={startTiempo}
          onChange={setStartTiempo}
          placeholder="e.g. 07:30 AM"
          options={START_TIME_OPCIONES}
        />
        <DropdownField
          label="Assigned Worker"
          value={worker}
          onChange={setTrabajador}
          placeholder="e.g. Daniel Reed"
          options={WORKER_OPCIONES}
        />
        <DropdownField
          label="Priority"
          value={priority}
          onChange={setPrioridad}
          placeholder="e.g. Normal"
          options={PRIORITY_OPCIONES}
        />
        <FormField
          label="Required Materials"
          value={materials}
          onChangeText={setMateriales}
          placeholder="e.g. Glyphosate 360 · 30 L"
        />
        <DropdownField
          label="Equipment"
          value={equipmentNombre}
          onChange={setEquipmentNombre}
          placeholder="e.g. Amazone UX 4200"
          options={
            equipmentOpciones.length > 0
              ? equipmentOpciones
              : ['Tractor T-150', 'Amazone UX 4200']
          }
        />

        <PrimaryButton
          label="Save Task"
          onPress={() => {
            if (!canGuardar) {
              return;
            }
            onGuardar({
              title,
              workTipo,
              field,
              date,
              startTiempo,
              worker,
              priority,
              materials,
              equipment: equipmentNombre,
            });
          }}
          fullWidth
          style={[
            styles.NewTaskScreenSavePlinto,
            !canGuardar && styles.NewTaskScreenSavePlintoDisabled,
          ]}
        />
      </ScrollView>
    </ImageBackground>
  );
}

function FormField({
  label,
  required,
  value,
  onChangeText,
  placeholder,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}) {
  return (
    <View style={styles.NewTaskScreenFieldBlock}>
      <Text style={styles.NewTaskScreenFieldLabelFiligrana}>
        {label}
        {required ? (
          <Text style={styles.NewTaskScreenRequiredEmblema}> *</Text>
        ) : null}
      </Text>
      <View style={styles.NewTaskScreenFieldInputCasco}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.label}
          style={styles.NewTaskScreenFieldInput}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  NewTaskScreenRaizCasco: { backgroundColor: colors.background, flex: 1 },

  NewTaskScreenScrollContent: { flexGrow: 1 },
  NewTaskScreenHeaderRowDintel: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  NewTaskScreenNavSide: { minWidth: 80 },



  NewTaskScreenNavLinkFiligrana: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },



  NewTaskScreenTitleFiligrana: {
    color: colors.cream,
    flex: 1,
    fontFamily: fonts.sansBold,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },


  NewTaskScreenFieldBlock: { marginBottom: 14 },


  NewTaskScreenFieldLabelFiligrana: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginBottom: 8,
  },

  NewTaskScreenRequiredEmblema: { color: colors.danger },


  NewTaskScreenFieldInputCasco: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 14,
  },


  NewTaskScreenFieldInput: {
    color: colors.cream,
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    padding: 0,
  },

  NewTaskScreenSavePlinto: { marginTop: 8 },
  NewTaskScreenSavePlintoDisabled: { opacity: 0.45 },
});
