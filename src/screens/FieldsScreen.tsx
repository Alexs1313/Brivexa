import React, { useMemo, useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, radius } from '../constants/theme';
import { appFondo, fieldRecursos } from '../data/assets';
import {
  DEMO_BANDA,
  FIELD_STATUS_FILTROS,
  type FarmField,
  type FieldStatus,
} from '../data/fields';
import { useCampos } from '../data/FieldsContext';

import { useAdaptativo } from '../hooks/useAdaptativo';

type FieldsScreenProps = {
  onOpenCampo: (fieldId: string) => void;
  onAddCampo: () => void;
};

export function FieldsScreen({ onOpenCampo, onAddCampo }: FieldsScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptativo();
  const { fields, isMuestra } = useCampos();
  const [query, setConsulta] = useState('');
  const [filter, setFiltro] =
    useState<(typeof FIELD_STATUS_FILTROS)[number]>('All');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fields.filter(field => {
      const matchesFiltro =
        filter === 'All' ||
        field.status === filter ||
        (filter === 'Growing' && field.status === 'Growing') ||
        (filter === 'Harvested' && field.status === 'Harvested') ||
        (filter === 'Prepared' && field.status === 'Prepared') ||
        (filter === 'Planted' && field.status === 'Planted');
      const matchesConsulta =
        !q ||
        field.name.toLowerCase().includes(q) ||
        field.crop.toLowerCase().includes(q) ||
        field.variety.toLowerCase().includes(q);
      return matchesFiltro && matchesConsulta;
    });
  }, [fields, filter, query]);

  return (
    <ImageBackground
      source={appFondo}
      style={styles.FieldsScreenBackground}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.FieldsScreenScroll,
          {
            paddingTop: insets.top + adaptive.verticalEscala(8),
            paddingBottom: adaptive.verticalEscala(110),
            paddingHorizontal: adaptive.horizontalRelleno,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.FieldsScreenHeader}>
          <Text style={styles.FieldsScreenTitleFiligrana}>Fields</Text>
          <Pressable onPress={onAddCampo} hitSlop={8}>
            <LinearGradient
              colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.FieldsScreenAddOrbe}
            >
              <Text style={styles.FieldsScreenAddMarca}>+</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.FieldsScreenSearchCasco}>
          <TextInput
            value={query}
            onChangeText={setConsulta}
            placeholder="🔍  Search fields"
            placeholderTextColor={colors.tabInactivo}
            style={styles.FieldsScreenSearchInput}
          />
        </View>

        <View style={styles.FieldsScreenFilterRow}>
          {FIELD_STATUS_FILTROS.map(item => {
            const active = item === filter;
            return (
              <Pressable
                key={item}
                onPress={() => setFiltro(item)}
                style={[
                  styles.FieldsScreenFilterChip,
                  active
                    ? styles.FieldsScreenFilterChipActive
                    : styles.FieldsScreenFilterChipIdle,
                ]}
              >
                <Text
                  style={[
                    styles.FieldsScreenFilterChipLabel,
                    active && styles.FieldsScreenFilterChipLabelActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {isMuestra ? (
          <View style={styles.FieldsScreenDemoBannerCasco}>
            <Text style={styles.FieldsScreenDemoBannerEmblema}>ℹ️</Text>
            <Text style={styles.FieldsScreenDemoBannerFiligrana}>
              {DEMO_BANDA}
            </Text>
          </View>
        ) : null}

        <View style={styles.FieldsScreenListStack}>
          {visible.map(field => (
            <FieldCard
              key={field.id}
              field={field}
              onPress={() => onOpenCampo(field.id)}
            />
          ))}
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

function FieldCard({
  field,
  onPress,
}: {
  field: FarmField;
  onPress: () => void;
}) {
  const cover =
    field.coverTono === 'ready'
      ? fieldRecursos.coverListo
      : fieldRecursos.coverCrecimiento;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.FieldsScreenFieldCardCasco,
        pressed && styles.FieldsScreenPressedDim,
      ]}
    >
      <ImageBackground
        source={cover}
        style={[
          styles.FieldsScreenFieldCardCover,
          field.coverTono === 'harvested' &&
            styles.FieldsScreenFieldCardCoverHarvested,
        ]}
        imageStyle={styles.FieldsScreenFieldCardCoverImage}
        resizeMode="cover"
      >
        <View style={styles.FieldsScreenFieldCardChipRow}>
          <StatusPill status={field.status} />
          {field.warning ? (
            <View style={styles.FieldsScreenWarningPill}>
              <Text style={styles.FieldsScreenWarningPillLabel}>
                ⚠ {field.warning}
              </Text>
            </View>
          ) : null}
        </View>
      </ImageBackground>
      <View style={styles.FieldsScreenFieldCardBody}>
        <View style={styles.FieldsScreenFieldCardTitleRow}>
          <Text style={styles.FieldsScreenFieldCardNameFiligrana}>
            {field.name}
          </Text>
          <Text style={styles.FieldsScreenFieldCardAreaFiligrana}>
            {field.areaEtiqueta}
          </Text>
        </View>
        <Text style={styles.FieldsScreenFieldCardCrop}>
          {field.crop} — {field.variety}
        </Text>
        <View style={styles.FieldsScreenFieldCardFooter}>
          <Text style={styles.FieldsScreenFieldCardNext}>
            {field.nextEtiqueta}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export function StatusPill({ status }: { status: FieldStatus }) {
  const tone =
    status === 'Growing'
      ? 'success'
      : status === 'Ready to Harvest'
      ? 'gold'
      : status === 'Harvested'
      ? 'muted'
      : 'muted';

  return (
    <View
      style={[
        styles.FieldsScreenStatusPill,
        tone === 'success' && styles.FieldsScreenStatusPillSuccess,
        tone === 'gold' && styles.FieldsScreenStatusPillGold,
        tone === 'muted' && styles.FieldsScreenStatusPillMuted,
      ]}
    >
      <Text
        style={[
          styles.FieldsScreenStatusPillLabel,
          tone === 'success' && { color: colors.success },
          tone === 'gold' && { color: colors.gold },
          tone === 'muted' && { color: colors.bodyApagado },
        ]}
      >
        ● {status}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  FieldsScreenBackground: {
    backgroundColor: colors.background,
    flex: 1,
  },



  FieldsScreenScroll: {
    flexGrow: 1,
  },


  FieldsScreenHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },


  FieldsScreenTitleFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 24,
    fontWeight: '700',
  },



  FieldsScreenAddOrbe: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },

  FieldsScreenAddMarca: {
    color: colors.buttonText,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },



  FieldsScreenSearchCasco: {
    backgroundColor: colors.card,
    borderColor: colors.emptyBorde,
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    marginBottom: 12,
    paddingHorizontal: 14,
  },



  FieldsScreenSearchInput: {
    color: colors.cream,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    padding: 0,
  },



  FieldsScreenFilterRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },



  FieldsScreenFilterChip: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    height: 20,
    justifyContent: 'center',
    paddingHorizontal: 9,
  },


  FieldsScreenFilterChipActive: {
    backgroundColor: 'rgba(245, 182, 66, 0.16)',
  },



  FieldsScreenFilterChipIdle: {
    backgroundColor: 'rgba(139, 148, 173, 0.16)',
  },


  FieldsScreenFilterChipLabel: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansBold,
    fontSize: 10,
    fontWeight: '700',
  },


  FieldsScreenFilterChipLabelActive: {
    color: colors.gold,
  },



  FieldsScreenDemoBannerCasco: {
    backgroundColor: colors.infoBanda,
    borderColor: colors.infoBannerBorde,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  FieldsScreenDemoBannerEmblema: {
    fontSize: 16,
    marginTop: 2,
  },
  FieldsScreenDemoBannerFiligrana: {
    color: colors.infoBannerText,
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    lineHeight: 18,
  },



  FieldsScreenListStack: {
    gap: 12,
  },

  FieldsScreenFieldCardCasco: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    overflow: 'hidden',
  },

  FieldsScreenPressedDim: {
    opacity: 0.9,
  },


  FieldsScreenFieldCardCover: {
    alignItems: 'flex-start',
    height: 70,
    justifyContent: 'flex-end',
    paddingBottom: 10,
    paddingHorizontal: 12,
  },
  FieldsScreenFieldCardCoverHarvested: {
    opacity: 0.85,
  },



  FieldsScreenFieldCardCoverImage: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },


  FieldsScreenFieldCardChipRow: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  FieldsScreenStatusPill: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },

  FieldsScreenStatusPillSuccess: {
    backgroundColor: colors.successSuave,
  },
  FieldsScreenStatusPillGold: {
    backgroundColor: 'rgba(245, 182, 66, 0.16)',
  },



  FieldsScreenStatusPillMuted: {
    backgroundColor: colors.plannedSuave,
  },

  FieldsScreenStatusPillLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    fontWeight: '700',
  },



  FieldsScreenWarningPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(236, 91, 91, 0.16)',
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  FieldsScreenWarningPillLabel: {
    color: colors.danger,
    fontFamily: fonts.sansBold,
    fontSize: 10,
    fontWeight: '700',
  },

  FieldsScreenFieldCardBody: {
    paddingHorizontal: 14,
    paddingTop: 12,
  },



  FieldsScreenFieldCardTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  FieldsScreenFieldCardNameFiligrana: {
    color: colors.cream,
    flexShrink: 1,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },

  FieldsScreenFieldCardAreaFiligrana: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },



  FieldsScreenFieldCardCrop: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginTop: 4,
  },
  FieldsScreenFieldCardFooter: {
    borderTopColor: colors.borderSuave,
    borderTopWidth: 1,
    marginTop: 10,
    paddingBottom: 12,
    paddingTop: 8,
  },



  FieldsScreenFieldCardNext: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },
});
