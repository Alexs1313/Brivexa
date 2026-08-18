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
import { appFondo } from '../data/assets';

import { useTareas } from '../data/TasksContext';

import { useAdaptativo } from '../hooks/useAdaptativo';

type CompleteWorkScreenProps = {
  taskId: string;
  onCancel: () => void;
  onGuardar: (draft: {
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
  onGuardar,
}: CompleteWorkScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptativo();
  const { getTarea } = useTareas();
  const task = getTarea(taskId);

  const [duration, setDuracion] = useState('3h 05m');
  const [materialsKg, setMaterialsKg] = useState('546');
  const [fuelL, setFuelL] = useState('42');
  const [cost, setCosto] = useState('320');
  const [notes, setNotas] = useState('');

  const title = task?.title ?? 'Task';
  const materialNombre = task?.materials?.split(' · ')[0] ?? 'materials';

  return (
    <ImageBackground
      source={appFondo}
      style={styles.CompleteWorkScreenRaizCasco}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.CompleteWorkScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalEscala(6),
            paddingBottom: insets.bottom + adaptive.verticalEscala(28),
            paddingHorizontal: adaptive.horizontalRelleno,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.CompleteWorkScreenHeaderRowDintel}>
          <Pressable
            onPress={onCancel}
            hitSlop={12}
            style={styles.CompleteWorkScreenNavSide}
          >
            <Text style={styles.CompleteWorkScreenNavLinkFiligrana}>
              ‹ Cancel
            </Text>
          </Pressable>
          <Text style={styles.CompleteWorkScreenTitleFiligrana}>
            Complete Work
          </Text>
          <View style={styles.CompleteWorkScreenNavSide} />
        </View>

        <Text style={styles.CompleteWorkScreenIntroFiligrana}>
          Record the actuals for{' '}
          <Text style={styles.CompleteWorkScreenIntroBoldFiligrana}>
            {title}
          </Text>{' '}
          and update farm records.
        </Text>

        <FormField
          label="Actual Duration"
          value={duration}
          onChangeText={setDuracion}
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
          onChangeText={setCosto}
          keyboardType="decimal-pad"
        />
        <FormField
          label="Work Notes"
          value={notes}
          onChangeText={setNotas}
          placeholder="Optional notes"
          multiline
        />

        <View style={styles.CompleteWorkScreenImpactCard}>
          <Text style={styles.CompleteWorkScreenImpactText}>
            On completion: {materialsKg} kg {materialNombre} deducted from
            inventory · ${cost} added to finance · equipment hours updated.
          </Text>
        </View>

        <Pressable
          onPress={() =>
            onGuardar({
              duration,
              materialsKg,
              fuelL,
              cost,
              notes,
            })
          }
          style={({ pressed }) => [
            styles.CompleteWorkScreenSavePlinto,
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
      <Text style={styles.CompleteWorkScreenFieldLabelFiligrana}>{label}</Text>
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
  CompleteWorkScreenRaizCasco: {
    backgroundColor: colors.background,
    flex: 1,
  },
  CompleteWorkScreenScrollContent: { flexGrow: 1 },



  CompleteWorkScreenHeaderRowDintel: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 16,
  },



  CompleteWorkScreenNavSide: { minWidth: 80 },
  CompleteWorkScreenNavLinkFiligrana: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },

  CompleteWorkScreenTitleFiligrana: {
    color: colors.cream,
    flex: 1,
    fontFamily: fonts.sansBold,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },



  CompleteWorkScreenIntroFiligrana: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 18,
  },



  CompleteWorkScreenIntroBoldFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontWeight: '700',
  },


  CompleteWorkScreenFieldBlock: { marginBottom: 14 },


  CompleteWorkScreenFieldLabelFiligrana: {
    color: colors.bodyApagado,
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
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    lineHeight: 18,
  },
  CompleteWorkScreenSavePlinto: {
    alignItems: 'center',
    backgroundColor: colors.successBoton,
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
