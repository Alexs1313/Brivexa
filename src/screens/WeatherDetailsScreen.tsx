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
import { HOURLY_PRONOSTICO, TODAY_WEATHER, WEEK_PRONOSTICO } from '../data/today';

import { useAdaptativo } from '../hooks/useAdaptativo';

type WeatherDetailsScreenProps = {
  onBack: () => void;
};

export function WeatherDetailsScreen({ onBack }: WeatherDetailsScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptativo();

  return (
    <ImageBackground
      source={appFondo}
      style={styles.WeatherDetailsScreenWeatherScreenBackground}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.WeatherDetailsScreenWeatherScreenScroll,
          {
            paddingTop: insets.top + adaptive.verticalEscala(6),
            paddingBottom: insets.bottom + adaptive.verticalEscala(24),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.WeatherDetailsScreenWeatherScreenNav}>
          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={styles.WeatherDetailsScreenWeatherScreenBack}
          >
            <Text style={styles.WeatherDetailsScreenWeatherScreenBackFiligrana}>
              ‹ Today
            </Text>
          </Pressable>
          <Text style={styles.WeatherDetailsScreenWeatherScreenTitleFiligrana}>
            Weather
          </Text>
          <View style={styles.WeatherDetailsScreenWeatherScreenNavSpacer} />
        </View>

        <View style={{ paddingHorizontal: adaptive.horizontalRelleno }}>
          <View style={styles.WeatherDetailsScreenHeroCardCasco}>
            <Text style={styles.WeatherDetailsScreenHeroIcon}>
              {TODAY_WEATHER.icon}
            </Text>
            <Text style={styles.WeatherDetailsScreenHeroTempFiligrana}>
              {TODAY_WEATHER.temp}°C
            </Text>
            <Text style={styles.WeatherDetailsScreenHeroCondition}>
              {TODAY_WEATHER.condition}
            </Text>
          </View>

          <View style={styles.WeatherDetailsScreenMetricsGrid}>
            <MetricCard label="Wind" value={TODAY_WEATHER.wind} />
            <MetricCard label="Rain" value={TODAY_WEATHER.rain} />
            <MetricCard label="Humidity" value={TODAY_WEATHER.humidity} />
            <MetricCard
              label="Feels Like"
              value={`${TODAY_WEATHER.feelsComo}°C`}
            />
          </View>

          <Text style={styles.WeatherDetailsScreenSectionTitleFiligrana}>
            Hourly
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.WeatherDetailsScreenHourlyRow}
          >
            {HOURLY_PRONOSTICO.map(hour => (
              <View key={hour.id} style={styles.WeatherDetailsScreenHourlyCard}>
                <Text style={styles.WeatherDetailsScreenHourlyLabel}>
                  {hour.label}
                </Text>
                <Text style={styles.WeatherDetailsScreenHourlyIcon}>
                  {hour.icon}
                </Text>
                <Text style={styles.WeatherDetailsScreenHourlyTempFiligrana}>
                  {hour.temp}°
                </Text>
              </View>
            ))}
          </ScrollView>

          <Text style={styles.WeatherDetailsScreenSectionTitleFiligrana}>
            7-Day Forecast
          </Text>
          <View style={styles.WeatherDetailsScreenWeekCardCasco}>
            {WEEK_PRONOSTICO.map((day, index) => (
              <View
                key={day.id}
                style={[
                  styles.WeatherDetailsScreenWeekRow,
                  index < WEEK_PRONOSTICO.length - 1 &&
                    styles.WeatherDetailsScreenWeekRowDivider,
                ]}
              >
                <Text style={styles.WeatherDetailsScreenWeekDay}>
                  {day.day}
                </Text>
                <Text style={styles.WeatherDetailsScreenWeekIcon}>
                  {day.icon}
                </Text>
                <Text style={styles.WeatherDetailsScreenWeekRain}>
                  🌧 {day.rain}
                </Text>
                <Text style={styles.WeatherDetailsScreenWeekTempFiligrana}>
                  {day.high}° / {day.low}°
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.WeatherDetailsScreenMetricCard}>
      <Text style={styles.WeatherDetailsScreenMetricLabel}>{label}</Text>
      <Text style={styles.WeatherDetailsScreenMetricValueFiligrana}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  WeatherDetailsScreenWeatherScreenBackground: {
    backgroundColor: colors.background,
    flex: 1,
  },



  WeatherDetailsScreenWeatherScreenNav: {
    alignItems: 'center',
    borderBottomColor: colors.borderSuave,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },

  WeatherDetailsScreenWeatherScreenBack: {
    minWidth: 72,
  },


  WeatherDetailsScreenWeatherScreenBackFiligrana: {
    color: colors.gold,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },


  WeatherDetailsScreenWeatherScreenTitleFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },


  WeatherDetailsScreenWeatherScreenNavSpacer: {
    minWidth: 72,
  },
  WeatherDetailsScreenWeatherScreenScroll: {
    flexGrow: 1,
  },

  WeatherDetailsScreenHeroCardCasco: {
    alignItems: 'center',
    backgroundColor: 'rgba(27, 21, 80, 0.72)',
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    marginBottom: 14,
    paddingVertical: 18,
  },


  WeatherDetailsScreenHeroIcon: {
    fontSize: 50,
  },
  WeatherDetailsScreenHeroTempFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 40,
    fontWeight: '700',
    marginTop: 4,
  },
  WeatherDetailsScreenHeroCondition: {
    color: colors.bodySuave,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    marginTop: 4,
  },



  WeatherDetailsScreenMetricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 22,
  },

  WeatherDetailsScreenMetricCard: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    height: 70,
    justifyContent: 'center',
    paddingHorizontal: 15,
    width: '48%',
  },

  WeatherDetailsScreenMetricLabel: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
  },



  WeatherDetailsScreenMetricValueFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },



  WeatherDetailsScreenSectionTitleFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
  },



  WeatherDetailsScreenHourlyRow: {
    gap: 8,
    marginBottom: 22,
    paddingRight: 8,
  },
  WeatherDetailsScreenHourlyCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    height: 82,
    justifyContent: 'center',
    width: 56,
  },


  WeatherDetailsScreenHourlyLabel: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 11,
  },

  WeatherDetailsScreenHourlyIcon: {
    fontSize: 18,
    marginVertical: 4,
  },
  WeatherDetailsScreenHourlyTempFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },


  WeatherDetailsScreenWeekCardCasco: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },

  WeatherDetailsScreenWeekRow: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  WeatherDetailsScreenWeekRowDivider: {
    borderBottomColor: colors.borderSuave,
    borderBottomWidth: 1,
  },



  WeatherDetailsScreenWeekDay: {
    color: colors.bodySuave,
    flex: 1,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
  },



  WeatherDetailsScreenWeekIcon: {
    fontSize: 16,
    marginRight: 10,
    width: 24,
  },
  WeatherDetailsScreenWeekRain: {
    color: colors.info,
    fontFamily: fonts.sansRegular,
    fontSize: 12,
    marginRight: 12,
    width: 52,
  },


  WeatherDetailsScreenWeekTempFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'right',
    width: 74,
  },
});
