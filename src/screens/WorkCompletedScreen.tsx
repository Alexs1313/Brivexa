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

import { PrimaryButton } from '../components/buttons/PrimaryButton';
import { colors, fonts, layout, radius } from '../constants/theme';
import { appFondo } from '../data/assets';
import { useTareas } from '../data/TasksContext';
import { useAdaptativo } from '../hooks/useAdaptativo';

type WorkCompletedScreenProps = {
  taskId: string;
  onBackToTrabajo: () => void;
  onViewResumen: () => void;
};

export function WorkCompletedScreen({
  taskId,
  onBackToTrabajo,
  onViewResumen,
}: WorkCompletedScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptativo();
  const { getTarea } = useTareas();
  const task = getTarea(taskId);

  const rows = [
    {
      label: 'Materials deducted',
      value: '22 bags → inventory',
      color: colors.gold,
    },
    {
      label: 'Cost added to finance',
      value: '+$320',
      color: colors.expenseDinero,
    },
    {
      label: 'Equipment hours',
      value: `+3 hrs ${task?.equipment ?? 'Tractor T-150'}`,
      color: colors.infoBannerText,
    },
  ];

  return (
    <ImageBackground
      source={appFondo}
      style={styles.WorkCompletedScreenRaizCasco}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.WorkCompletedScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalEscala(6),
            paddingBottom: insets.bottom + adaptive.verticalEscala(28),
            paddingHorizontal: adaptive.horizontalRelleno,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.WorkCompletedScreenHeaderRowDintel}>
          <Pressable
            onPress={onBackToTrabajo}
            hitSlop={12}
            style={styles.WorkCompletedScreenNavSide}
          >
            <Text style={styles.WorkCompletedScreenNavLinkFiligrana}>
              ‹ Work
            </Text>
          </Pressable>
          <Text style={styles.WorkCompletedScreenTitleFiligrana}>Completed</Text>
          <View style={styles.WorkCompletedScreenNavSide} />
        </View>

        <View style={styles.WorkCompletedScreenHeroBolsillo}>
          <View style={styles.WorkCompletedScreenCheckOrbe}>
            <Text style={styles.WorkCompletedScreenCheckEmblema}>✓</Text>
          </View>
          <Text style={styles.WorkCompletedScreenHeroTitleFiligrana}>
            Work Completed
          </Text>
          <Text style={styles.WorkCompletedScreenHeroHintFiligrana}>
            The activity has been saved and farm records have been updated.
          </Text>
        </View>

        <View style={styles.WorkCompletedScreenSummaryCasco}>
          {rows.map((row, index) => (
            <View
              key={row.label}
              style={[
                styles.WorkCompletedScreenKvRow,
                index < rows.length - 1 &&
                  styles.WorkCompletedScreenKvRowBorder,
              ]}
            >
              <Text style={styles.WorkCompletedScreenKvLabel}>{row.label}</Text>
              <Text
                style={[
                  styles.WorkCompletedScreenKvValue,
                  { color: row.color },
                ]}
              >
                {row.value}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.WorkCompletedScreenFooterRow}>
          <Pressable
            onPress={onBackToTrabajo}
            style={({ pressed }) => [
              styles.WorkCompletedScreenSecondaryBtn,
              pressed && styles.WorkCompletedScreenPressedDim,
            ]}
          >
            <Text style={styles.WorkCompletedScreenSecondaryBtnLabel}>
              Back to Work
            </Text>
          </Pressable>
          <PrimaryButton
            label="View Summary"
            onPress={onViewResumen}
            style={styles.WorkCompletedScreenPrimaryBtn}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  WorkCompletedScreenRaizCasco: {
    backgroundColor: colors.background,
    flex: 1,
  },

  WorkCompletedScreenScrollContent: { flexGrow: 1 },

  WorkCompletedScreenHeaderRowDintel: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 28,
  },

  WorkCompletedScreenNavSide: { minWidth: 72 },
  WorkCompletedScreenNavLinkFiligrana: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },
  WorkCompletedScreenTitleFiligrana: {
    color: colors.cream,
    flex: 1,
    fontFamily: fonts.sansBold,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },

  WorkCompletedScreenHeroBolsillo: { alignItems: 'center', marginBottom: 28 },
  WorkCompletedScreenCheckOrbe: {
    alignItems: 'center',
    backgroundColor: colors.successBoton,
    borderColor: colors.white,
    borderRadius: 40,
    borderWidth: 2,
    height: 72,
    justifyContent: 'center',
    marginBottom: 18,
    width: 72,
  },

  WorkCompletedScreenCheckEmblema: {
    color: colors.white,
    fontFamily: fonts.sansBold,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 38,
  },
  WorkCompletedScreenHeroTitleFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 26,
    fontWeight: '700',
  },

  WorkCompletedScreenHeroHintFiligrana: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    paddingHorizontal: 24,
    textAlign: 'center',
  },

  WorkCompletedScreenSummaryCasco: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: 28,
    overflow: 'hidden',
    paddingHorizontal: 16,
  },
  WorkCompletedScreenKvRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },

  WorkCompletedScreenKvRowBorder: {
    borderBottomColor: colors.borderSuave,
    borderBottomWidth: 1,
  },
  WorkCompletedScreenKvLabel: {
    color: colors.bodyApagado,
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginRight: 10,
  },
  WorkCompletedScreenKvValue: {
    flexShrink: 1,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'right',
  },

  WorkCompletedScreenFooterRow: { flexDirection: 'row', gap: 10 },
  WorkCompletedScreenSecondaryBtn: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.button,
    borderWidth: 1,
    flex: 1,
    height: layout.buttonHeightDefault,
    justifyContent: 'center',
  },
  WorkCompletedScreenSecondaryBtnLabel: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
  },

  WorkCompletedScreenPrimaryBtn: { flex: 1 },

  WorkCompletedScreenPressedDim: { opacity: 0.85 },
});
