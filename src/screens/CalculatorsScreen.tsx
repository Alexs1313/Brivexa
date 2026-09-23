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
import { appFondo } from '../data/assets';

import { CALCULATOR_CARDS, type CalculatorId } from '../data/calculators';
import {
  calculatorMeta,
  useSavedCalculos,
} from '../data/SavedCalculationsContext';
import { useAdaptativo } from '../hooks/useAdaptativo';

type CalculatorsScreenProps = {
  onOpenCalculadora: (id: CalculatorId) => void;
};

export function CalculatorsScreen({
  onOpenCalculadora,
}: CalculatorsScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptativo();
  const { saved } = useSavedCalculos();

  return (
    <ImageBackground
      source={appFondo}
      style={styles.CalculatorsScreenNucleoAndamio}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.CalculatorsScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalEscala(8),
            paddingBottom: adaptive.verticalEscala(110),
            paddingHorizontal: adaptive.horizontalRelleno,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.CalculatorsScreenTitleLamina}>Calculators</Text>
        <Text style={styles.CalculatorsScreenSubtitleLamina}>
          Plan sowing, fertilizer & spray needs
        </Text>

        <View style={styles.CalculatorsScreenCardStack}>
          {CALCULATOR_CARDS.map(card => (
            <View key={card.id} style={styles.CalculatorsScreenCard}>
              <View style={styles.CalculatorsScreenCardTop}>
                <View
                  style={[
                    styles.CalculatorsScreenIconBox,
                    card.iconTono === 'success' &&
                      styles.CalculatorsScreenIconSuccess,
                    card.iconTono === 'info' &&
                      styles.CalculatorsScreenIconInfo,
                    card.iconTono === 'purple' &&
                      styles.CalculatorsScreenIconPurple,
                  ]}
                >
                  <Text style={styles.CalculatorsScreenIconSello}>
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
                onPress={() => onOpenCalculadora(card.id)}
                style={({ pressed }) => [
                  styles.CalculatorsScreenOpenBtn,
                  pressed && styles.CalculatorsScreenPressedOpaco,
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
            <Text style={styles.CalculatorsScreenEmptyRecentTitle}>
              No saved calculations yet
            </Text>
            <Text style={styles.CalculatorsScreenEmptyRecentLabel}>
              Run a calculator and save the result to see it here.
            </Text>
          </View>
        ) : (
          <View style={styles.CalculatorsScreenRecentStack}>
            {saved.map(item => {
              const meta = calculatorMeta(item.calculatorId);
              return (
                <Pressable
                  key={item.id}
                  onPress={() => onOpenCalculadora(item.calculatorId)}
                  style={({ pressed }) => [
                    styles.CalculatorsScreenRecentCard,
                    pressed && styles.CalculatorsScreenPressedOpaco,
                  ]}
                >
                  <View
                    style={[
                      styles.CalculatorsScreenRecentIconBox,
                      meta.iconTono === 'success' &&
                        styles.CalculatorsScreenIconSuccess,
                      meta.iconTono === 'info' &&
                        styles.CalculatorsScreenIconInfo,
                      meta.iconTono === 'purple' &&
                        styles.CalculatorsScreenIconPurple,
                    ]}
                  >
                    <Text style={styles.CalculatorsScreenRecentIconSello}>
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
                      {item.savedAtEtiqueta}
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
  CalculatorsScreenNucleoAndamio: {
    backgroundColor: colors.background,
    flex: 1,
  },

  CalculatorsScreenScrollContent: {
    flexGrow: 1,
  },

  CalculatorsScreenTitleLamina: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 24,
    fontWeight: '700',
  },

  CalculatorsScreenSubtitleLamina: {
    color: colors.bodyApagado,
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
    backgroundColor: colors.successSuave,
  },

  CalculatorsScreenIconInfo: {
    backgroundColor: colors.infoIconSuave,
  },

  CalculatorsScreenIconPurple: {
    backgroundColor: 'rgba(124, 92, 255, 0.15)',
  },

  CalculatorsScreenIconSello: {
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
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },

  CalculatorsScreenOpenBtn: {
    alignItems: 'center',
    backgroundColor: colors.backBoton,
    borderColor: colors.backButtonBorde,
    borderRadius: 14,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
  },

  CalculatorsScreenPressedOpaco: {
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
    minHeight: 88,
    paddingHorizontal: 16,
    paddingVertical: 18,
  },

  CalculatorsScreenEmptyRecentTitle: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },

  CalculatorsScreenEmptyRecentLabel: {
    color: colors.tabInactivo,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    lineHeight: 18,
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

  CalculatorsScreenRecentIconSello: {
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
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    marginTop: 4,
  },
});
