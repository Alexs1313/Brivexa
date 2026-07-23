import React from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '../components/buttons/PrimaryButton';

import { ProgressRing } from '../components/today/ProgressRing';
import {
  QuickActionsGrid,
  SectionTitle,
  TaskCard,
  UpcomingList,
} from '../components/today/TodayBlocks';
import { APP_BRAND_LINE } from '../constants/brand';

import { colors, fonts, radius } from '../constants/theme';
import { appBackground } from '../data/assets';

import {
  QUICK_ACTIONS,
  TODAY_HEADER,
  TODAY_WEATHER,
  UPCOMING_WORK,
} from '../data/today';
import { useTasks } from '../data/TasksContext';
import { useAdaptive } from '../hooks/useAdaptive';

type TodayScreenProps = {
  onOpenWeather: () => void;
  onAddTask: () => void;
  onAddField: () => void;
  onAddExpense: () => void;
  onStartWork: () => void;
};

export function TodayScreen({
  onOpenWeather,
  onAddTask,
  onAddField,
  onAddExpense,
  onStartWork,
}: TodayScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptive();
  const { isDemo, todayTasks, upcomingWork, todayProgress } = useTasks();

  const tasks = todayTasks;
  const upcoming = isDemo ? UPCOMING_WORK : upcomingWork;
  const empty = tasks.length === 0;
  const showProgress = isDemo || todayProgress.total > 0;
  const allDone =
    todayProgress.total > 0 && todayProgress.done >= todayProgress.total;

  return (
    <ImageBackground
      source={appBackground}
      style={styles.TodayScreenBackground}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.TodayScreenScroll,
          {
            paddingTop: insets.top + adaptive.verticalScale(8),
            paddingBottom: adaptive.verticalScale(110),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.TodayScreenContent,
            { paddingHorizontal: adaptive.horizontalPadding },
          ]}
        >
          <View style={styles.TodayScreenHeader}>
            <View>
              <View style={styles.TodayScreenBrandRow}>
                <Text style={styles.TodayScreenCowSigil}>🐂</Text>
                <Text style={styles.TodayScreenBrandFiligree}>
                  {APP_BRAND_LINE}
                </Text>
              </View>
              <Text style={styles.TodayScreenGreetingFiligree}>
                {TODAY_HEADER.greeting}
              </Text>
              <Text style={styles.TodayScreenDate}>
                {TODAY_HEADER.dateLabel}
              </Text>
            </View>
            <Pressable onPress={onAddTask} hitSlop={8}>
              <LinearGradient
                colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.TodayScreenAddOrb}
              >
                <Text style={styles.TodayScreenAddGlyph}>+</Text>
              </LinearGradient>
            </Pressable>
          </View>

          <Pressable
            onPress={onOpenWeather}
            style={({ pressed }) => [
              styles.TodayScreenWeatherCardChassis,
              pressed && styles.TodayScreenPressedDim,
            ]}
          >
            <View style={styles.TodayScreenWeatherCardMain}>
              <View style={styles.TodayScreenWeatherCardTempRow}>
                <Text style={styles.TodayScreenWeatherCardIcon}>
                  {TODAY_WEATHER.icon}
                </Text>
                <Text style={styles.TodayScreenWeatherCardTempFiligree}>
                  {TODAY_WEATHER.temp}°
                </Text>
              </View>
              <Text style={styles.TodayScreenWeatherCardCondition}>
                {TODAY_WEATHER.condition} · {TODAY_WEATHER.location}
              </Text>
            </View>
            <View style={styles.TodayScreenWeatherCardStats}>
              <Text style={styles.TodayScreenWeatherCardStat}>
                H {TODAY_WEATHER.high}° · L {TODAY_WEATHER.low}°
              </Text>
              <Text style={styles.TodayScreenWeatherCardStat}>
                💨 {TODAY_WEATHER.wind}
              </Text>
              <Text style={styles.TodayScreenWeatherCardStat}>
                🌧 {TODAY_WEATHER.rain}
              </Text>
            </View>
          </Pressable>

          {showProgress ? (
            <View style={styles.TodayScreenProgressCardChassis}>
              <ProgressRing
                done={todayProgress.done}
                total={todayProgress.total}
              />
              <View style={styles.TodayScreenProgressCopyEnclave}>
                <Text
                  style={[
                    styles.TodayScreenProgressTitleFiligree,
                    allDone && styles.TodayScreenProgressTitleDone,
                  ]}
                >
                  {allDone ? 'All tasks completed 🎉' : "Today's Progress"}
                </Text>
                <View style={styles.TodayScreenProgressStatsRow}>
                  <View>
                    <Text style={styles.TodayScreenProgressStatValue}>
                      {todayProgress.planned}
                    </Text>
                    <Text style={styles.TodayScreenProgressStatLabel}>
                      planned
                    </Text>
                  </View>
                  <View style={styles.TodayScreenProgressOverdueCol}>
                    <Text style={styles.TodayScreenProgressOverdueValue}>
                      {todayProgress.overdue}
                    </Text>
                    <Text style={styles.TodayScreenProgressStatLabel}>
                      overdue
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : null}

          <SectionTitle title="Today's Tasks" />

          {empty ? (
            <View style={styles.TodayScreenEmptyCardChassis}>
              <Text style={styles.TodayScreenEmptySigil}>🗓️</Text>
              <Text style={styles.TodayScreenEmptyTitleFiligree}>
                No tasks today
              </Text>
              <Text style={styles.TodayScreenEmptyHintFiligree}>
                Enjoy the quiet — or plan ahead.
              </Text>
              <PrimaryButton
                label="+ Add Task"
                onPress={onAddTask}
                style={styles.TodayScreenEmptyPortico}
              />
            </View>
          ) : (
            tasks.map(task => <TaskCard key={task.id} task={task} />)
          )}

          {upcoming.length > 0 ? (
            <>
              <SectionTitle title="Upcoming Work" />
              <UpcomingList items={upcoming} />
              <View style={styles.TodayScreenSectionSpacer} />
            </>
          ) : null}

          <SectionTitle title="Quick Actions" />
          <QuickActionsGrid
            actions={QUICK_ACTIONS}
            onPress={id => {
              if (id === 'task') {
                onAddTask();
              } else if (id === 'field') {
                onAddField();
              } else if (id === 'expense') {
                onAddExpense();
              } else if (id === 'work') {
                onStartWork();
              }
            }}
          />
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  TodayScreenBackground: {
    backgroundColor: colors.background,
    flex: 1,
  },

  TodayScreenScroll: {
    flexGrow: 1,
  },
  TodayScreenContent: {
    gap: 0,
  },
  TodayScreenHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  TodayScreenBrandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  TodayScreenCowSigil: {
    fontSize: 14,
  },

  TodayScreenBrandFiligree: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },

  TodayScreenGreetingFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 6,
  },
  TodayScreenDate: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginTop: 4,
  },
  TodayScreenAddOrb: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },

  TodayScreenAddGlyph: {
    color: colors.buttonText,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },

  TodayScreenDemoBannerChassis: {
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

  TodayScreenDemoBannerSigil: {
    fontSize: 16,
    marginTop: 2,
  },
  TodayScreenDemoBannerFiligree: {
    color: colors.infoBannerText,
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    lineHeight: 18,
  },
  TodayScreenWeatherCardChassis: {
    backgroundColor: 'rgba(27, 21, 80, 0.72)',
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  TodayScreenPressedDim: {
    opacity: 0.88,
  },

  TodayScreenWeatherCardMain: {
    flex: 1,
    marginRight: 12,
  },
  TodayScreenWeatherCardTempRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  TodayScreenWeatherCardIcon: {
    fontSize: 34,
  },
  TodayScreenWeatherCardTempFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 38,
    fontWeight: '700',
  },

  TodayScreenWeatherCardCondition: {
    color: colors.bodySoft,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    marginTop: 2,
  },

  TodayScreenWeatherCardStats: {
    alignItems: 'flex-end',
    gap: 4,
  },
  TodayScreenWeatherCardStat: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    textAlign: 'right',
  },

  TodayScreenProgressCardChassis: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  TodayScreenProgressCopyEnclave: {
    flex: 1,
  },
  TodayScreenProgressTitleFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },

  TodayScreenProgressTitleDone: {
    color: colors.success,
  },

  TodayScreenProgressStatsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  TodayScreenProgressOverdueCol: {
    minWidth: 48,
  },
  TodayScreenProgressStatValue: {
    color: colors.bodySoft,
    fontFamily: fonts.sansBold,
    fontSize: 17,
    fontWeight: '700',
  },

  TodayScreenProgressOverdueValue: {
    color: colors.danger,
    fontFamily: fonts.sansBold,
    fontSize: 17,
    fontWeight: '700',
  },

  TodayScreenProgressStatLabel: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    marginTop: 2,
  },
  TodayScreenEmptyCardChassis: {
    alignItems: 'center',
    backgroundColor: colors.emptyFill,
    borderColor: colors.emptyBorder,
    borderRadius: radius.card,
    borderStyle: 'dashed',
    borderWidth: 1,
    marginBottom: 22,
    paddingBottom: 18,
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  TodayScreenEmptySigil: {
    fontSize: 38,
  },

  TodayScreenEmptyTitleFiligree: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  TodayScreenEmptyHintFiligree: {
    color: colors.bodyMuted,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginBottom: 14,
    marginTop: 6,
    textAlign: 'center',
  },

  TodayScreenEmptyPortico: {
    minWidth: 122,
  },

  TodayScreenSectionSpacer: {
    height: 22,
  },
});
