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

import { colors, fonts, radius } from '../constants/theme';

import { appBackground } from '../data/assets';
import type { FieldDraft } from '../data/FieldsContext';

import { useFields } from '../data/FieldsContext';
import { FIELD_STATUS_OPTIONS } from '../data/formOptions';
import { useAdaptive } from '../hooks/useAdaptive';

import type { FieldStatus } from '../data/fields';

type EditFieldScreenProps = {
  mode: 'new' | 'edit';
  fieldId?: string | null;
  onCancel: () => void;
  onSave: (draft: FieldDraft) => void;
};

export function EditFieldScreen({
  mode,
  fieldId,
  onCancel,
  onSave,
}: EditFieldScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptive();
  const { getField } = useFields();
  const existing = fieldId ? getField(fieldId) : undefined;

  const [name, setName] = useState(existing?.name ?? '');
  const [area, setArea] = useState(existing ? String(existing.areaHa) : '');
  const [crop, setCrop] = useState(existing?.crop ?? '');
  const [variety, setVariety] = useState(existing?.variety ?? '');
  const [status, setStatus] = useState<FieldStatus>(
    existing?.status ?? 'Planned',
  );
  const [plantingDate, setPlantingDate] = useState(
    existing?.plantingDate ?? '',
  );

  const title = mode === 'new' ? 'New Field' : 'Edit Field';
  const saveLabel = mode === 'new' ? 'Save Field' : 'Save Changes';

  const canSave = useMemo(
    () =>
      name.trim().length > 0 &&
      area.trim().length > 0 &&
      crop.trim().length > 0,
    [area, crop, name],
  );

  return (
    <ImageBackground
      source={appBackground}
      style={styles.EditFieldScreenRootHull}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.EditFieldScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalScale(6),
            paddingBottom: insets.bottom + adaptive.verticalScale(28),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.EditFieldScreenHeaderRowCapstone}>
          <Pressable
            onPress={onCancel}
            hitSlop={12}
            style={styles.EditFieldScreenNavSide}
          >
            <Text style={styles.EditFieldScreenNavLinkFlourish}>‹ Cancel</Text>
          </Pressable>
          <Text style={styles.EditFieldScreenNavTitleFlourish}>{title}</Text>
          <View style={styles.EditFieldScreenNavSide} />
        </View>

        <View style={{ paddingHorizontal: adaptive.horizontalPadding }}>
          <FieldInput
            label="Field Name"
            required
            value={name}
            onChangeText={setName}
            placeholder="e.g. West Field"
          />
          <FieldInput
            label="Area (ha)"
            required
            value={area}
            onChangeText={setArea}
            placeholder="0.0"
            keyboardType="decimal-pad"
          />
          <FieldInput
            label="Crop"
            required
            value={crop}
            onChangeText={setCrop}
            placeholder="e.g. Corn"
          />
          <FieldInput
            label="Variety"
            value={variety}
            onChangeText={setVariety}
            placeholder="e.g. Pioneer P9241"
          />
          <DropdownField
            label="Status"
            value={status}
            onChange={value => setStatus(value as FieldStatus)}
            placeholder="e.g. Planned"
            options={FIELD_STATUS_OPTIONS}
          />
          <FieldInput
            label="Planting Date"
            value={plantingDate}
            onChangeText={setPlantingDate}
            placeholder="e.g. Apr 18, 2026"
          />

          <PrimaryButton
            label={saveLabel}
            onPress={() => {
              if (!canSave) {
                return;
              }
              onSave({
                name,
                area,
                crop,
                variety,
                status,
                plantingDate,
              });
            }}
            fullWidth
            style={[
              styles.EditFieldScreenSavePlinth,
              !canSave && styles.EditFieldScreenSavePlinthDisabled,
            ]}
          />
          <Pressable
            onPress={onCancel}
            style={styles.EditFieldScreenCancelPlinth}
          >
            <Text style={styles.EditFieldScreenCancelFlourish}>Cancel</Text>
          </Pressable>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

function FieldInput({
  label,
  required,
  value,
  onChangeText,
  placeholder,
  keyboardType,
}: {
  label: string;
  required?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: 'default' | 'decimal-pad';
}) {
  return (
    <View style={styles.EditFieldScreenFieldGroup}>
      <Text style={styles.EditFieldScreenFieldLabelFlourish}>
        {label}
        {required ? (
          <Text style={styles.EditFieldScreenRequiredEmblem}> *</Text>
        ) : null}
      </Text>
      <View style={styles.EditFieldScreenFieldInputHull}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.tabInactive}
          keyboardType={keyboardType}
          style={styles.EditFieldScreenFieldInput}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  EditFieldScreenRootHull: {
    backgroundColor: colors.background,
    flex: 1,
  },
  EditFieldScreenHeaderRowCapstone: {
    alignItems: 'center',
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },

  EditFieldScreenNavSide: {
    minWidth: 72,
  },

  EditFieldScreenNavLinkFlourish: {
    color: colors.gold,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },
  EditFieldScreenNavTitleFlourish: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },
  EditFieldScreenScrollContent: {
    flexGrow: 1,
  },
  EditFieldScreenFieldGroup: {
    marginBottom: 14,
  },

  EditFieldScreenFieldLabelFlourish: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginBottom: 8,
  },

  EditFieldScreenRequiredEmblem: {
    color: colors.danger,
  },
  EditFieldScreenFieldInputHull: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    height: 48,
    paddingHorizontal: 14,
  },

  EditFieldScreenFieldInput: {
    color: colors.cream,
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    padding: 0,
  },
  EditFieldScreenSavePlinth: {
    marginTop: 10,
  },

  EditFieldScreenSavePlinthDisabled: {
    opacity: 0.55,
  },

  EditFieldScreenCancelPlinth: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    marginTop: 12,
  },

  EditFieldScreenCancelFlourish: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
});
