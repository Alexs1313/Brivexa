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

import { appFondo } from '../data/assets';
import type { FieldDraft } from '../data/FieldsContext';

import { useCampos } from '../data/FieldsContext';
import { FIELD_STATUS_OPCIONES } from '../data/formOpciones';
import { useAdaptativo } from '../hooks/useAdaptativo';

import type { FieldStatus } from '../data/fields';

type EditFieldScreenProps = {
  mode: 'new' | 'edit';
  fieldId?: string | null;
  onCancel: () => void;
  onGuardar: (draft: FieldDraft) => void;
};

export function EditFieldScreen({
  mode,
  fieldId,
  onCancel,
  onGuardar,
}: EditFieldScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptativo();
  const { getCampo } = useCampos();
  const existing = fieldId ? getCampo(fieldId) : undefined;

  const [name, setNombre] = useState(existing?.name ?? '');
  const [area, setSuperficie] = useState(existing ? String(existing.areaHa) : '');
  const [crop, setCrop] = useState(existing?.crop ?? '');
  const [variety, setVariedad] = useState(existing?.variety ?? '');
  const [status, setEstado] = useState<FieldStatus>(
    existing?.status ?? 'Planned',
  );
  const [plantingFecha, setPlantingFecha] = useState(
    existing?.plantingFecha ?? '',
  );

  const title = mode === 'new' ? 'New Field' : 'Edit Field';
  const saveEtiqueta = mode === 'new' ? 'Save Field' : 'Save Changes';

  const canGuardar = useMemo(
    () =>
      name.trim().length > 0 &&
      area.trim().length > 0 &&
      crop.trim().length > 0,
    [area, crop, name],
  );

  return (
    <ImageBackground
      source={appFondo}
      style={styles.EditFieldScreenRaizCasco}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.EditFieldScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalEscala(6),
            paddingBottom: insets.bottom + adaptive.verticalEscala(28),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.EditFieldScreenHeaderRowDintel}>
          <Pressable
            onPress={onCancel}
            hitSlop={12}
            style={styles.EditFieldScreenNavSide}
          >
            <Text style={styles.EditFieldScreenNavLinkFiligrana}>‹ Cancel</Text>
          </Pressable>
          <Text style={styles.EditFieldScreenNavTitleFiligrana}>{title}</Text>
          <View style={styles.EditFieldScreenNavSide} />
        </View>

        <View style={{ paddingHorizontal: adaptive.horizontalRelleno }}>
          <FieldInput
            label="Field Name"
            required
            value={name}
            onChangeText={setNombre}
            placeholder="e.g. West Field"
          />
          <FieldInput
            label="Area (ha)"
            required
            value={area}
            onChangeText={setSuperficie}
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
            onChangeText={setVariedad}
            placeholder="e.g. Pioneer P9241"
          />
          <DropdownField
            label="Status"
            value={status}
            onChange={value => setEstado(value as FieldStatus)}
            placeholder="e.g. Planned"
            options={FIELD_STATUS_OPCIONES}
          />
          <FieldInput
            label="Planting Date"
            value={plantingFecha}
            onChangeText={setPlantingFecha}
            placeholder="e.g. Apr 18, 2026"
          />

          <PrimaryButton
            label={saveEtiqueta}
            onPress={() => {
              if (!canGuardar) {
                return;
              }
              onGuardar({
                name,
                area,
                crop,
                variety,
                status,
                plantingFecha,
              });
            }}
            fullWidth
            style={[
              styles.EditFieldScreenSavePlinto,
              !canGuardar && styles.EditFieldScreenSavePlintoDisabled,
            ]}
          />
          <Pressable
            onPress={onCancel}
            style={styles.EditFieldScreenCancelPlinto}
          >
            <Text style={styles.EditFieldScreenCancelFiligrana}>Cancel</Text>
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
      <Text style={styles.EditFieldScreenFieldLabelFiligrana}>
        {label}
        {required ? (
          <Text style={styles.EditFieldScreenRequiredEmblema}> *</Text>
        ) : null}
      </Text>
      <View style={styles.EditFieldScreenFieldInputCasco}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.tabInactivo}
          keyboardType={keyboardType}
          style={styles.EditFieldScreenFieldInput}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  EditFieldScreenRaizCasco: {
    backgroundColor: colors.background,
    flex: 1,
  },

  EditFieldScreenHeaderRowDintel: {
    alignItems: 'center',
    borderBottomColor: colors.borderSuave,
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

  EditFieldScreenNavLinkFiligrana: {
    color: colors.gold,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },
  EditFieldScreenNavTitleFiligrana: {
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


  EditFieldScreenFieldLabelFiligrana: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginBottom: 8,
  },



  EditFieldScreenRequiredEmblema: {
    color: colors.danger,
  },
  EditFieldScreenFieldInputCasco: {
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

  EditFieldScreenSavePlinto: {
    marginTop: 10,
  },



  EditFieldScreenSavePlintoDisabled: {
    opacity: 0.55,
  },
  EditFieldScreenCancelPlinto: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 14,
    borderWidth: 1,
    height: 50,
    justifyContent: 'center',
    marginTop: 12,
  },



  EditFieldScreenCancelFiligrana: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
});
