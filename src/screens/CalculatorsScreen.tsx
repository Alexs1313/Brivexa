import React from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, radius } from '../constants/theme';
import { appBackground } from '../data/assets';

import { CALCULATOR_CARDS, type CalculatorId } from '../data/calculators';
import {
  calculatorMeta,
  useSavedCalculations,
} from '../data/SavedCalculationsContext';
import { useAdaptive } from '../hooks/useAdaptive';

type CalculatorsScreenProps = {
  onOpenCalculator: (id: CalculatorId) => void;
};

export function CalculatorsScreen({
  onOpenCalculator,
}: CalculatorsScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptive();
  const { saved } = useSavedCalculations();

  return (
    <ImageBackground
      source={appBackground}
      style={styles.CalculatorsScreenFacetChassis}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.CalculatorsScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalScale(8),
            paddingBottom: adaptive.verticalScale(110),
            paddingHorizontal: adaptive.horizontalPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.CalculatorsScreenTitleFiligree}>Calculators</Text>
        <Text style={styles.CalculatorsScreenSubtitleFiligree}>
          Plan seed, fertilizer & spray needs
        </Text>

        <View style={styles.CalculatorsScreenCardStack}>
          {CALCULATOR_CARDS.map(card => (
            <View key={card.id} style={styles.CalculatorsScreenCard}>
              <View style={styles.CalculatorsScreenCardTop}>
                <View
                  style={[
                    styles.CalculatorsScreenIconBox,
                    card.iconTone === 'success' &&
                      styles.CalculatorsScreenIconSuccess,
                    card.iconTone === 'info' &&
                      styles.CalculatorsScreenIconInfo,
                    card.iconTone === 'purple' &&
                      styles.CalculatorsScreenIconPurple,
                  ]}
                >
                  <Text style={styles.CalculatorsScreenIconGlyph}>
                    {card.icon}
                  </Text>
                </View>
                <View style={styles.CalculatorsScreenCardCopy}>
                  <Text style={styles.CalculatorsScreenCardTitle}>
                    {card.title}
                  </Text>
                  <Text style={styles.CalculatorsScreenCardBody}>
                    {card.description}
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => onOpenCalculator(card.id)}
                style={({ pressed }) => [
                  styles.CalculatorsScreenOpenBtn,
                  pressed && styles.CalculatorsScreenPressedDim,
                ]}
              >
                <Text style={styles.CalculatorsScreenOpenLabel}>
                  Open Calculator
                </Text>
              </Pressable>
            </View>
          ))}
        </View>

        <Text style={styles.CalculatorsScreenRecentTitle}>
          Recent Calculations
        </Text>
        {saved.length === 0 ? (
          <View style={styles.CalculatorsScreenEmptyRecent}>
            <Text style={styles.CalculatorsScreenEmptyRecentLabel}>
              No saved calculations yet
            </Text>
          </View>
        ) : (
          <View style={styles.CalculatorsScreenRecentStack}>
            {saved.map(item => {
              const meta = calculatorMeta(item.calculatorId);
              return (
                <Pressable
                  key={item.id}
                  onPress={() => onOpenCalculator(item.calculatorId)}
                  style={({ pressed }) => [
                    styles.CalculatorsScreenRecentCard,
                    pressed && styles.CalculatorsScreenPressedDim,
                  ]}
                >
                  <View
                    style={[
                      styles.CalculatorsScreenRecentIconBox,
                      meta.iconTone === 'success' &&
                        styles.CalculatorsScreenIconSuccess,
                      meta.iconTone === 'info' &&
                        styles.CalculatorsScreenIconInfo,
                      meta.iconTone === 'purple' &&
                        styles.CalculatorsScreenIconPurple,
                    ]}
                  >
                    <Text style={styles.CalculatorsScreenRecentIconGlyph}>
                      {meta.icon}
                    </Text>
                  </View>
                  <View style={styles.CalculatorsScreenRecentCopy}>
                    <Text style={styles.CalculatorsScreenRecentCardTitle}>
                      {item.title}
                    </Text>
                    <Text style={styles.CalculatorsScreenRecentSummary}>
                      {item.summary}
                    </Text>
                    <Text style={styles.CalculatorsScreenRecentTime}>
                      {item.savedAtLabel}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  CalculatorsScreenFacetChassis: {
    backgroundColor: colors.background,
    flex: 1,
  },
  CalculatorsScreenScrollContent: {
    flexGrow: 1,
  },

  CalculatorsScreenTitleFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 24,
    fontWeight: '700',
  },

  CalculatorsScreenSubtitleFiligree: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    marginBottom: 18,
    marginTop: 6,
  },

  CalculatorsScreenCardStack: {
    gap: 12,
    marginBottom: 22,
  },
  CalculatorsScreenCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    padding: 15,
  },
  CalculatorsScreenCardTop: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 14,
  },
  CalculatorsScreenIconBox: {
    alignItems: 'center',
    borderRadius: 14,
    height: 46,
    justifyContent: 'center',
    width: 46,
  },

  CalculatorsScreenIconSuccess: {
    backgroundColor: colors.successSoft,
  },

  CalculatorsScreenIconInfo: {
    backgroundColor: colors.infoIconSoft,
  },

  CalculatorsScreenIconPurple: {
    backgroundColor: 'rgba(124, 92, 255, 0.15)',
  },
  CalculatorsScreenIconGlyph: {
    fontSize: 22,
  },
  CalculatorsScreenCardCopy: {
    flex: 1,
  },

  CalculatorsScreenCardTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },
  CalculatorsScreenCardBody: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  CalculatorsScreenOpenBtn: {
    alignItems: 'center',
    backgroundColor: colors.backButton,
    borderColor: colors.backButtonBorder,
    borderRadius: 14,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
  },

  CalculatorsScreenPressedDim: {
    opacity: 0.88,
  },
  CalculatorsScreenOpenLabel: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },

  CalculatorsScreenRecentTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  CalculatorsScreenEmptyRecent: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 65,
    paddingHorizontal: 16,
  },

  CalculatorsScreenEmptyRecentLabel: {
    color: colors.tabInactive,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    textAlign: 'center',
  },
  CalculatorsScreenRecentStack: {
    gap: 10,
  },
  CalculatorsScreenRecentCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },

  CalculatorsScreenRecentIconBox: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },

  CalculatorsScreenRecentIconGlyph: {
    fontSize: 18,
  },
  CalculatorsScreenRecentCopy: {
    flex: 1,
  },
  CalculatorsScreenRecentCardTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
  },

  CalculatorsScreenRecentSummary: {
    color: colors.gold,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginTop: 3,
  },

  CalculatorsScreenRecentTime: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    marginTop: 4,
  },
});
