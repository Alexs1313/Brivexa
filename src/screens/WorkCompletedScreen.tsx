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
import { appBackground } from '../data/assets';
import { useTasks } from '../data/TasksContext';
import { useAdaptive } from '../hooks/useAdaptive';

type WorkCompletedScreenProps = {
  taskId: string;
  onBackToWork: () => void;
  onViewSummary: () => void;
};

export function WorkCompletedScreen({
  taskId,
  onBackToWork,
  onViewSummary,
}: WorkCompletedScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptive();
  const { getTask } = useTasks();
  const task = getTask(taskId);

  const rows = [
    {
      label: 'Materials deducted',
      value: '22 bags → inventory',
      color: colors.gold,
    },
    {
      label: 'Cost added to finance',
      value: '+$320',
      color: colors.expenseMoney,
    },
    {
      label: 'Equipment hours',
      value: `+3 hrs ${task?.equipment ?? 'Tractor T-150'}`,
      color: colors.infoBannerText,
    },
  ];

  return (
    <ImageBackground
      source={appBackground}
      style={styles.WorkCompletedScreenRootHull}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.WorkCompletedScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalScale(6),
            paddingBottom: insets.bottom + adaptive.verticalScale(28),
            paddingHorizontal: adaptive.horizontalPadding,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.WorkCompletedScreenHeaderRowCapstone}>
          <Pressable
            onPress={onBackToWork}
            hitSlop={12}
            style={styles.WorkCompletedScreenNavSide}
          >
            <Text style={styles.WorkCompletedScreenNavLinkFlourish}>
              ‹ Work
            </Text>
          </Pressable>
          <Text style={styles.WorkCompletedScreenTitleFlourish}>Completed</Text>
          <View style={styles.WorkCompletedScreenNavSide} />
        </View>

        <View style={styles.WorkCompletedScreenHeroPocket}>
          <View style={styles.WorkCompletedScreenCheckBead}>
            <Text style={styles.WorkCompletedScreenCheckEmblem}>✓</Text>
          </View>
          <Text style={styles.WorkCompletedScreenHeroTitleFlourish}>
            Work Completed
          </Text>
          <Text style={styles.WorkCompletedScreenHeroHintFlourish}>
            The activity has been saved and farm records have been updated.
          </Text>
        </View>

        <View style={styles.WorkCompletedScreenSummaryHull}>
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
            onPress={onBackToWork}
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
            onPress={onViewSummary}
            style={styles.WorkCompletedScreenPrimaryBtn}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  WorkCompletedScreenRootHull: {
    backgroundColor: colors.background,
    flex: 1,
  },

  WorkCompletedScreenScrollContent: { flexGrow: 1 },

  WorkCompletedScreenHeaderRowCapstone: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 28,
  },

  WorkCompletedScreenNavSide: { minWidth: 72 },
  WorkCompletedScreenNavLinkFlourish: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },
  WorkCompletedScreenTitleFlourish: {
    color: colors.cream,
    flex: 1,
    fontFamily: fonts.sansBold,
    fontSize: 17,
    fontWeight: '700',
    textAlign: 'center',
  },

  WorkCompletedScreenHeroPocket: { alignItems: 'center', marginBottom: 28 },
  WorkCompletedScreenCheckBead: {
    alignItems: 'center',
    backgroundColor: colors.successButton,
    borderColor: colors.white,
    borderRadius: 40,
    borderWidth: 2,
    height: 72,
    justifyContent: 'center',
    marginBottom: 18,
    width: 72,
  },

  WorkCompletedScreenCheckEmblem: {
    color: colors.white,
    fontFamily: fonts.sansBold,
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 38,
  },
  WorkCompletedScreenHeroTitleFlourish: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 26,
    fontWeight: '700',
  },

  WorkCompletedScreenHeroHintFlourish: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
    paddingHorizontal: 24,
    textAlign: 'center',
  },

  WorkCompletedScreenSummaryHull: {
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
    borderBottomColor: colors.borderSoft,
    borderBottomWidth: 1,
  },
  WorkCompletedScreenKvLabel: {
    color: colors.bodyMuted,
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
