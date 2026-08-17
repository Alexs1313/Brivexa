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
import { appFondo } from '../data/assets';

import {
  QUICK_ACTIONS,
  TODAY_HEADER,
  TODAY_WEATHER,
  UPCOMING_WORK,
} from '../data/today';
import { useTareas } from '../data/TasksContext';
import { useAdaptativo } from '../hooks/useAdaptativo';

type TodayScreenProps = {
  onOpenClima: () => void;
  onAddTarea: () => void;
  onAddCampo: () => void;
  onAddGasto: () => void;
  onStartTrabajo: () => void;
};

export function TodayScreen({
  onOpenClima,
  onAddTarea,
  onAddCampo,
  onAddGasto,
  onStartTrabajo,
}: TodayScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptativo();
  const { isMuestra, todayTareas, upcomingTrabajo, todayProgreso } =
    useTareas();

  const tasks = todayTareas;
  const upcoming = isMuestra ? UPCOMING_WORK : upcomingTrabajo;
  const empty = tasks.length === 0;
  const showProgreso = isMuestra || todayProgreso.total > 0;
  const allHecho =
    todayProgreso.total > 0 && todayProgreso.done >= todayProgreso.total;

  return (
    <ImageBackground
      source={appFondo}
      style={styles.TodayScreenBackground}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.TodayScreenScroll,
          {
            paddingTop: insets.top + adaptive.verticalEscala(8),
            paddingBottom: adaptive.verticalEscala(110),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.TodayScreenContent,
            { paddingHorizontal: adaptive.horizontalRelleno },
          ]}
        >
          <View style={styles.TodayScreenHeader}>
            <View>
              <View style={styles.TodayScreenBrandRow}>
                <Text style={styles.TodayScreenCowEmblema}>🐂</Text>
                <Text style={styles.TodayScreenBrandFiligrana}>
                  Terra Bull Farm
                </Text>
              </View>
              <Text style={styles.TodayScreenGreetingFiligrana}>
                {TODAY_HEADER.greeting}
              </Text>
              <Text style={styles.TodayScreenDate}>
                {TODAY_HEADER.dateEtiqueta}
              </Text>
            </View>
            <Pressable onPress={onAddTarea} hitSlop={8}>
              <LinearGradient
                colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.TodayScreenAddOrbe}
              >
                <Text style={styles.TodayScreenAddMarca}>+</Text>
              </LinearGradient>
            </Pressable>
          </View>

          <Pressable
            onPress={onOpenClima}
            style={({ pressed }) => [
              styles.TodayScreenWeatherCardCasco,
              pressed && styles.TodayScreenPressedDim,
            ]}
          >
            <View style={styles.TodayScreenWeatherCardMain}>
              <View style={styles.TodayScreenWeatherCardTempRow}>
                <Text style={styles.TodayScreenWeatherCardIcon}>
                  {TODAY_WEATHER.icon}
                </Text>
                <Text style={styles.TodayScreenWeatherCardTempFiligrana}>
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

          {showProgreso ? (
            <View style={styles.TodayScreenProgressCardCasco}>
              <ProgressRing
                done={todayProgreso.done}
                total={todayProgreso.total}
              />
              <View style={styles.TodayScreenProgressCopyBolsillo}>
                <Text
                  style={[
                    styles.TodayScreenProgressTitleFiligrana,
                    allHecho && styles.TodayScreenProgressTitleDone,
                  ]}
                >
                  {allHecho ? 'All tasks completed 🎉' : "Today's Progress"}
                </Text>
                <View style={styles.TodayScreenProgressStatsRow}>
                  <View>
                    <Text style={styles.TodayScreenProgressStatValue}>
                      {todayProgreso.planned}
                    </Text>
                    <Text style={styles.TodayScreenProgressStatLabel}>
                      planned
                    </Text>
                  </View>
                  <View style={styles.TodayScreenProgressOverdueCol}>
                    <Text style={styles.TodayScreenProgressOverdueValue}>
                      {todayProgreso.overdue}
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
            <View style={styles.TodayScreenEmptyCardCasco}>
              <Text style={styles.TodayScreenEmptyEmblema}>🗓️</Text>
              <Text style={styles.TodayScreenEmptyTitleFiligrana}>
                No tasks today
              </Text>
              <Text style={styles.TodayScreenEmptyHintFiligrana}>
                Enjoy the quiet — or plan ahead.
              </Text>
              <PrimaryButton
                label="+ Add Task"
                onPress={onAddTarea}
                style={styles.TodayScreenEmptyPlinto}
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
                onAddTarea();
              } else if (id === 'field') {
                onAddCampo();
              } else if (id === 'expense') {
                onAddGasto();
              } else if (id === 'work') {
                onStartTrabajo();
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
  TodayScreenCowEmblema: {
    fontSize: 14,
  },

  TodayScreenBrandFiligrana: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },

  TodayScreenGreetingFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 6,
  },
  TodayScreenDate: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginTop: 4,
  },
  TodayScreenAddOrbe: {
    alignItems: 'center',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },

  TodayScreenAddMarca: {
    color: colors.buttonText,
    fontFamily: fonts.sansBold,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 24,
  },

  TodayScreenDemoBannerCasco: {
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

  TodayScreenDemoBannerEmblema: {
    fontSize: 16,
    marginTop: 2,
  },
  TodayScreenDemoBannerFiligrana: {
    color: colors.infoBannerText,
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    lineHeight: 18,
  },
  TodayScreenWeatherCardCasco: {
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
  TodayScreenWeatherCardTempFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 38,
    fontWeight: '700',
  },

  TodayScreenWeatherCardCondition: {
    color: colors.bodySuave,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    marginTop: 2,
  },

  TodayScreenWeatherCardStats: {
    alignItems: 'flex-end',
    gap: 4,
  },
  TodayScreenWeatherCardStat: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    textAlign: 'right',
  },

  TodayScreenProgressCardCasco: {
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

  TodayScreenProgressCopyBolsillo: {
    flex: 1,
  },
  TodayScreenProgressTitleFiligrana: {
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
    color: colors.bodySuave,
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
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 11,
    marginTop: 2,
  },
  TodayScreenEmptyCardCasco: {
    alignItems: 'center',
    backgroundColor: colors.emptyRelleno,
    borderColor: colors.emptyBorde,
    borderRadius: radius.card,
    borderStyle: 'dashed',
    borderWidth: 1,
    marginBottom: 22,
    paddingBottom: 18,
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  TodayScreenEmptyEmblema: {
    fontSize: 38,
  },

  TodayScreenEmptyTitleFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 10,
  },
  TodayScreenEmptyHintFiligrana: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 13,
    marginBottom: 14,
    marginTop: 6,
    textAlign: 'center',
  },

  TodayScreenEmptyPlinto: {
    minWidth: 122,
  },

  TodayScreenSectionSpacer: {
    height: 22,
  },
});
