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
import { appBackground, fieldAssets } from '../data/assets';
import {
  DEMO_BANNER,
  FIELD_STATUS_FILTERS,
  type FarmField,
  type FieldStatus,
} from '../data/fields';
import { useFields } from '../data/FieldsContext';

import { useAdaptive } from '../hooks/useAdaptive';

type FieldsScreenProps = {
  onOpenField: (fieldId: string) => void;
  onAddField: () => void;
};

export function FieldsScreen({ onOpenField, onAddField }: FieldsScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptive();
  const { fields, isDemo } = useFields();
  const [query, setQuery] = useState('');
  const [filter, setFilter] =
    useState<(typeof FIELD_STATUS_FILTERS)[number]>('All');

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return fields.filter(field => {
      const matchesFilter =
        filter === 'All' ||
        field.status === filter ||
        (filter === 'Growing' && field.status === 'Growing') ||
        (filter === 'Harvested' && field.status === 'Harvested') ||
        (filter === 'Prepared' && field.status === 'Prepared') ||
        (filter === 'Planted' && field.status === 'Planted');
      const matchesQuery =
        !q ||
        field.name.toLowerCase().includes(q) ||
        field.crop.toLowerCase().includes(q) ||
        field.variety.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [fields, filter, query]);

  return (
    <ImageBackground
      source={appBackground}
      style={styles.FieldsScreenBackground}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.FieldsScreenScroll,
          {
            paddingTop: insets.top + adaptive.verticalScale(8),
            paddingBottom: adaptive.verticalScale(110),
            paddingHorizontal: adaptive.horizontalPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.FieldsScreenHeader}>
          <Text style={styles.FieldsScreenTitleFlourish}>Fields</Text>
          <Pressable onPress={onAddField} hitSlop={8}>
            <LinearGradient
              colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.FieldsScreenAddBead}
            >
              <Text style={styles.FieldsScreenAddMark}>+</Text>
            </LinearGradient>
          </Pressable>
        </View>

        <View style={styles.FieldsScreenSearchHull}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="🔍  Search fields"
            placeholderTextColor={colors.tabInactive}
            style={styles.FieldsScreenSearchInput}
          />
        </View>

        <View style={styles.FieldsScreenFilterRow}>
          {FIELD_STATUS_FILTERS.map(item => {
            const active = item === filter;
            return (
              <Pressable
                key={item}
                onPress={() => setFilter(item)}
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

        {isDemo ? (
          <View style={styles.FieldsScreenDemoBannerHull}>
            <Text style={styles.FieldsScreenDemoBannerEmblem}>ℹ️</Text>
            <Text style={styles.FieldsScreenDemoBannerFlourish}>
              {DEMO_BANNER}
            </Text>
          </View>
        ) : null}

        <View style={styles.FieldsScreenListStack}>
          {visible.map(field => (
            <FieldCard
              key={field.id}
              field={field}
              onPress={() => onOpenField(field.id)}
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
    field.coverTone === 'ready'
      ? fieldAssets.coverReady
      : fieldAssets.coverGrowing;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.FieldsScreenFieldCardHull,
        pressed && styles.FieldsScreenPressedDim,
      ]}
    >
      <ImageBackground
        source={cover}
        style={[
          styles.FieldsScreenFieldCardCover,
          field.coverTone === 'harvested' &&
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
          <Text style={styles.FieldsScreenFieldCardNameFlourish}>
            {field.name}
          </Text>
          <Text style={styles.FieldsScreenFieldCardAreaFlourish}>
            {field.areaLabel}
          </Text>
        </View>
        <Text style={styles.FieldsScreenFieldCardCrop}>
          {field.crop} — {field.variety}
        </Text>
        <View style={styles.FieldsScreenFieldCardFooter}>
          <Text style={styles.FieldsScreenFieldCardNext}>
            {field.nextLabel}
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
          tone === 'muted' && { color: colors.bodyMuted },
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
  FieldsScreenTitleFlourish: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 24,
    fontWeight: '700',
  },
  FieldsScreenAddBead: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },

  FieldsScreenAddMark: {
    color: colors.buttonText,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },

  FieldsScreenSearchHull: {
    backgroundColor: colors.card,
    borderColor: colors.emptyBorder,
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
    color: colors.bodyMuted,
    fontFamily: fonts.sansBold,
    fontSize: 10,
    fontWeight: '700',
  },
  FieldsScreenFilterChipLabelActive: {
    color: colors.gold,
  },

  FieldsScreenDemoBannerHull: {
    backgroundColor: colors.infoBanner,
    borderColor: colors.infoBannerBorder,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },

  FieldsScreenDemoBannerEmblem: {
    fontSize: 16,
    marginTop: 2,
  },
  FieldsScreenDemoBannerFlourish: {
    color: colors.infoBannerText,
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    lineHeight: 18,
  },
  FieldsScreenListStack: {
    gap: 12,
  },

  FieldsScreenFieldCardHull: {
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
    backgroundColor: colors.successSoft,
  },
  FieldsScreenStatusPillGold: {
    backgroundColor: 'rgba(245, 182, 66, 0.16)',
  },
  FieldsScreenStatusPillMuted: {
    backgroundColor: colors.plannedSoft,
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
  FieldsScreenFieldCardNameFlourish: {
    color: colors.cream,
    flexShrink: 1,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },

  FieldsScreenFieldCardAreaFlourish: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },
  FieldsScreenFieldCardCrop: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginTop: 4,
  },

  FieldsScreenFieldCardFooter: {
    borderTopColor: colors.borderSoft,
    borderTopWidth: 1,
    marginTop: 10,
    paddingBottom: 12,
    paddingTop: 8,
  },

  FieldsScreenFieldCardNext: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },
});
