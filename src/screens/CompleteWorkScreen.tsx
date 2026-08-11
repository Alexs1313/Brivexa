import React, { useState } from 'react';
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

import { colors, fonts, layout, radius } from '../constants/theme';
import { appBackground } from '../data/assets';

import { useTasks } from '../data/TasksContext';

import { useAdaptive } from '../hooks/useAdaptive';

type CompleteWorkScreenProps = {
  taskId: string;
  onCancel: () => void;
  onSave: (draft: {
    duration: string;
    materialsKg: string;
    fuelL: string;
    cost: string;
    notes: string;
  }) => void;
};

export function CompleteWorkScreen({
  taskId,
  onCancel,
  onSave,
}: CompleteWorkScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptive();
  const { getTask } = useTasks();
  const task = getTask(taskId);

  const [duration, setDuration] = useState('3h 05m');
  const [materialsKg, setMaterialsKg] = useState('546');
  const [fuelL, setFuelL] = useState('42');
  const [cost, setCost] = useState('320');
  const [notes, setNotes] = useState('');

  const title = task?.title ?? 'Task';
  const materialName = task?.materials?.split(' · ')[0] ?? 'materials';

  return (
    <ImageBackground
      source={appBackground}
      style={styles.CompleteWorkScreenRootHull}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.CompleteWorkScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalScale(6),
            paddingBottom: insets.bottom + adaptive.verticalScale(28),
            paddingHorizontal: adaptive.horizontalPadding,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.CompleteWorkScreenHeaderRowCapstone}>
          <Pressable
            onPress={onCancel}
            hitSlop={12}
            style={styles.CompleteWorkScreenNavSide}
          >
            <Text style={styles.CompleteWorkScreenNavLinkFlourish}>
              ‹ Cancel
            </Text>
          </Pressable>
          <Text style={styles.CompleteWorkScreenTitleFlourish}>
            Complete Work
          </Text>
          <View style={styles.CompleteWorkScreenNavSide} />
        </View>

        <Text style={styles.CompleteWorkScreenIntroFlourish}>
          Record the actuals for{' '}
          <Text style={styles.CompleteWorkScreenIntroBoldFlourish}>
            {title}
          </Text>{' '}
          and update farm records.
        </Text>

        <FormField
          label="Actual Duration"
          value={duration}
          onChangeText={setDuration}
        />
        <FormField
          label="Actual Materials Used (kg)"
          value={materialsKg}
          onChangeText={setMaterialsKg}
          keyboardType="decimal-pad"
        />
        <FormField
          label="Actual Fuel Used (L)"
          value={fuelL}
          onChangeText={setFuelL}
          keyboardType="decimal-pad"
        />
        <FormField
          label="Actual Cost ($)"
          value={cost}
          onChangeText={setCost}
          keyboardType="decimal-pad"
        />
        <FormField
          label="Work Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Optional notes"
          multiline
        />

        <View style={styles.CompleteWorkScreenImpactCard}>
          <Text style={styles.CompleteWorkScreenImpactText}>
            On completion: {materialsKg} kg {materialName} deducted from
            inventory · ${cost} added to finance · equipment hours updated.
          </Text>
        </View>

        <Pressable
          onPress={() =>
            onSave({
              duration,
              materialsKg,
              fuelL,
              cost,
              notes,
            })
          }
          style={({ pressed }) => [
            styles.CompleteWorkScreenSavePlinth,
            pressed && styles.CompleteWorkScreenPressedDim,
          ]}
        >
          <Text style={styles.CompleteWorkScreenSaveBtnLabel}>
            Complete & Save Records
          </Text>
        </Pressable>
      </ScrollView>
    </ImageBackground>
  );
}

function FormField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'decimal-pad';
  multiline?: boolean;
}) {
  return (
    <View style={styles.CompleteWorkScreenFieldBlock}>
      <Text style={styles.CompleteWorkScreenFieldLabelFlourish}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.label}
        keyboardType={keyboardType}
        multiline={multiline}
        style={[
          styles.CompleteWorkScreenFieldInput,
          multiline && styles.CompleteWorkScreenFieldInputMultiline,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  CompleteWorkScreenRootHull: {
    backgroundColor: colors.background,
    flex: 1,
  },
  CompleteWorkScreenScrollContent: { flexGrow: 1 },
  CompleteWorkScreenHeaderRowCapstone: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },

  CompleteWorkScreenNavSide: { minWidth: 80 },
  CompleteWorkScreenNavLinkFlourish: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },

  CompleteWorkScreenTitleFlourish: {
    color: colors.cream,
    flex: 1,
    fontFamily: fonts.sansBold,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },

  CompleteWorkScreenIntroFlourish: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },
  CompleteWorkScreenIntroBoldFlourish: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontWeight: '700',
  },
  CompleteWorkScreenFieldBlock: { marginBottom: 14 },
  CompleteWorkScreenFieldLabelFlourish: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginBottom: 8,
  },

  CompleteWorkScreenFieldInput: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    color: colors.cream,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    height: 48,
    paddingHorizontal: 14,
  },

  CompleteWorkScreenFieldInputMultiline: {
    height: 88,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  CompleteWorkScreenImpactCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: 20,
    marginTop: 4,
    padding: 14,
  },
  CompleteWorkScreenImpactText: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    lineHeight: 18,
  },

  CompleteWorkScreenSavePlinth: {
    alignItems: 'center',
    backgroundColor: colors.successButton,
    borderRadius: radius.button,
    height: layout.buttonHeightDefault,
    justifyContent: 'center',
  },

  CompleteWorkScreenSaveBtnLabel: {
    color: colors.successButtonText,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
  CompleteWorkScreenPressedDim: { opacity: 0.85 },
});
