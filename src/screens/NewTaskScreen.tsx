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

import { appBackground } from '../data/assets';
import { useFarm } from '../data/FarmContext';
import { useFields } from '../data/FieldsContext';
import {
  PRIORITY_OPTIONS,
  START_TIME_OPTIONS,
  WORKER_OPTIONS,
  WORK_TYPE_OPTIONS,
} from '../data/formOptions';
import type { NewTaskDraft } from '../data/TasksContext';
import { useAdaptive } from '../hooks/useAdaptive';

type NewTaskScreenProps = {
  onCancel: () => void;
  onSave: (draft: NewTaskDraft) => void;
};

export function NewTaskScreen({ onCancel, onSave }: NewTaskScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptive();
  const { fields } = useFields();
  const { equipment } = useFarm();

  const fieldOptions = useMemo(() => fields.map(f => f.name), [fields]);
  const equipmentOptions = useMemo(
    () => equipment.map(item => item.name),
    [equipment],
  );

  const [title, setTitle] = useState('');
  const [workType, setWorkType] = useState('');
  const [field, setField] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [worker, setWorker] = useState('');
  const [priority, setPriority] = useState('');
  const [materials, setMaterials] = useState('');
  const [equipmentName, setEquipmentName] = useState('');

  const canSave = useMemo(
    () =>
      title.trim().length > 0 &&
      workType.trim().length > 0 &&
      field.trim().length > 0 &&
      date.trim().length > 0,
    [date, field, title, workType],
  );

  return (
    <ImageBackground
      source={appBackground}
      style={styles.NewTaskScreenFacetChassis}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.NewTaskScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalScale(6),
            paddingBottom: insets.bottom + adaptive.verticalScale(28),
            paddingHorizontal: adaptive.horizontalPadding,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.NewTaskScreenHeaderRowLintel}>
          <Pressable
            onPress={onCancel}
            hitSlop={12}
            style={styles.NewTaskScreenNavSide}
          >
            <Text style={styles.NewTaskScreenNavLinkFiligree}>‹ Cancel</Text>
          </Pressable>
          <Text style={styles.NewTaskScreenTitleFiligree}>New Task</Text>
          <View style={styles.NewTaskScreenNavSide} />
        </View>

        <FormField
          label="Task Title"
          required
          value={title}
          onChangeText={setTitle}
          placeholder="e.g. Plant Corn"
        />
        <DropdownField
          label="Work Type"
          required
          value={workType}
          onChange={setWorkType}
          placeholder="e.g. Planting"
          options={WORK_TYPE_OPTIONS}
        />
        <DropdownField
          label="Field"
          required
          value={field}
          onChange={setField}
          placeholder="e.g. North Field"
          options={
            fieldOptions.length > 0
              ? fieldOptions
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
          value={startTime}
          onChange={setStartTime}
          placeholder="e.g. 07:30 AM"
          options={START_TIME_OPTIONS}
        />
        <DropdownField
          label="Assigned Worker"
          value={worker}
          onChange={setWorker}
          placeholder="e.g. Daniel Reed"
          options={WORKER_OPTIONS}
        />
        <DropdownField
          label="Priority"
          value={priority}
          onChange={setPriority}
          placeholder="e.g. Normal"
          options={PRIORITY_OPTIONS}
        />
        <FormField
          label="Required Materials"
          value={materials}
          onChangeText={setMaterials}
          placeholder="e.g. Glyphosate 360 · 30 L"
        />
        <DropdownField
          label="Equipment"
          value={equipmentName}
          onChange={setEquipmentName}
          placeholder="e.g. Amazone UX 4200"
          options={
            equipmentOptions.length > 0
              ? equipmentOptions
              : ['Tractor T-150', 'Amazone UX 4200']
          }
        />

        <PrimaryButton
          label="Save Task"
          onPress={() => {
            if (!canSave) {
              return;
            }
            onSave({
              title,
              workType,
              field,
              date,
              startTime,
              worker,
              priority,
              materials,
              equipment: equipmentName,
            });
          }}
          fullWidth
          style={[
            styles.NewTaskScreenSavePortico,
            !canSave && styles.NewTaskScreenSavePorticoDisabled,
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
      <Text style={styles.NewTaskScreenFieldLabelFiligree}>
        {label}
        {required ? (
          <Text style={styles.NewTaskScreenRequiredSigil}> *</Text>
        ) : null}
      </Text>
      <View style={styles.NewTaskScreenFieldInputChassis}>
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
  NewTaskScreenFacetChassis: { backgroundColor: colors.background, flex: 1 },
  NewTaskScreenScrollContent: { flexGrow: 1 },

  NewTaskScreenHeaderRowLintel: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },
  NewTaskScreenNavSide: { minWidth: 80 },
  NewTaskScreenNavLinkFiligree: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },

  NewTaskScreenTitleFiligree: {
    color: colors.cream,
    flex: 1,
    fontFamily: fonts.sansBold,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },

  NewTaskScreenFieldBlock: { marginBottom: 14 },

  NewTaskScreenFieldLabelFiligree: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginBottom: 8,
  },
  NewTaskScreenRequiredSigil: { color: colors.danger },

  NewTaskScreenFieldInputChassis: {
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
  NewTaskScreenSavePortico: { marginTop: 8 },
  NewTaskScreenSavePorticoDisabled: { opacity: 0.45 },
});
