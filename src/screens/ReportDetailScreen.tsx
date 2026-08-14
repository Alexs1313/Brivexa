import React, { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, fonts, radius } from '../constants/theme';
import { appFondo } from '../data/assets';

import { SEASON_REPORT } from '../data/farm';

import { useAdaptativo } from '../hooks/useAdaptativo';

type ReportDetailScreenProps = {
  onBack: () => void;
};

export function ReportDetailScreen({ onBack }: ReportDetailScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptativo();
  const report = SEASON_REPORT;
  const [toast, setAviso] = useState<string | null>(null);

  const showAviso = (message: string) => {
    setAviso(message);
    setTimeout(() => setAviso(null), 2000);
  };

  const shareMensaje = [
    report.title,
    report.subtitle,
    '',
    ...report.metrics.map(metric => `${metric.label}: ${metric.value}`),
  ].join('\n');

  return (
    <ImageBackground
      source={appFondo}
      style={styles.ReportDetailScreenRaizCasco}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={[
          styles.ReportDetailScreenScrollContent,
          {
            paddingTop: insets.top + adaptive.verticalEscala(6),
            paddingBottom: insets.bottom + adaptive.verticalEscala(28),
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.ReportDetailScreenHeaderRowDintel}>
          <Pressable
            onPress={onBack}
            hitSlop={12}
            style={styles.ReportDetailScreenNavSide}
          >
            <Text style={styles.ReportDetailScreenNavLinkFiligrana}>
              ‹ Reports
            </Text>
          </Pressable>
          <Text style={styles.ReportDetailScreenTitleFiligrana}>Report</Text>
          <View style={styles.ReportDetailScreenNavSide} />
        </View>

        <View style={{ paddingHorizontal: adaptive.horizontalRelleno }}>
          <Text style={styles.ReportDetailScreenSubtitleFiligrana}>
            {report.subtitle}
          </Text>

          <View style={styles.ReportDetailScreenMetricsStack}>
            {report.metrics.map(metric => (
              <View
                key={metric.label}
                style={styles.ReportDetailScreenMetricCard}
              >
                <Text style={styles.ReportDetailScreenMetricLabel}>
                  {metric.label}
                </Text>
                <Text
                  style={[
                    styles.ReportDetailScreenMetricValue,
                    metric.tone === 'success' && { color: colors.success },
                    metric.tone === 'danger' && { color: colors.expenseDinero },
                    metric.tone === 'gold' && { color: colors.gold },
                  ]}
                >
                  {metric.value}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.ReportDetailScreenActionRow}>
            <Pressable
              onPress={async () => {
                try {
                  await Share.share({
                    title: report.title,
                    message: shareMensaje,
                  });
                } catch {
                  showAviso('Unable to share');
                }
              }}
              style={({ pressed }) => [
                styles.ReportDetailScreenActionBtn,
                pressed && styles.ReportDetailScreenPressedDim,
              ]}
            >
              <Text style={styles.ReportDetailScreenActionLabel}>Share</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {toast ? (
        <View
          style={[
            styles.ReportDetailScreenToastCasco,
            { bottom: insets.bottom + adaptive.verticalEscala(24) },
          ]}
        >
          <Text style={styles.ReportDetailScreenToastFiligrana}>{toast}</Text>
        </View>
      ) : null}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  ReportDetailScreenRaizCasco: {
    backgroundColor: colors.background,
    flex: 1,
  },
  ReportDetailScreenScrollContent: {
    flexGrow: 1,
  },

  ReportDetailScreenHeaderRowDintel: {
    alignItems: 'center',
    borderBottomColor: colors.borderSuave,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },

  ReportDetailScreenNavSide: {
    minWidth: 90,
  },
  ReportDetailScreenNavLinkFiligrana: {
    color: colors.gold,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },
  ReportDetailScreenTitleFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },

  ReportDetailScreenSubtitleFiligrana: {
    color: colors.body,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
    marginBottom: 14,
  },

  ReportDetailScreenMetricsStack: {
    gap: 11,
    marginBottom: 16,
  },
  ReportDetailScreenMetricCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderRadius: radius.card,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 49,
    paddingHorizontal: 16,
  },

  ReportDetailScreenMetricLabel: {
    color: colors.body,
    fontFamily: fonts.sansRegular,
    fontSize: 14,
  },
  ReportDetailScreenMetricValue: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 16,
    fontWeight: '700',
  },
  ReportDetailScreenActionRow: {
    flexDirection: 'row',
    gap: 10,
  },

  ReportDetailScreenActionBtn: {
    alignItems: 'center',
    backgroundColor: colors.backBoton,
    borderColor: colors.backButtonBorde,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },

  ReportDetailScreenActionLabel: {
    color: colors.backButtonText,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
  ReportDetailScreenPressedDim: {
    opacity: 0.88,
  },
  ReportDetailScreenToastCasco: {
    alignSelf: 'center',
    backgroundColor: colors.toastBg,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: 'absolute',
  },

  ReportDetailScreenToastFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 13,
    fontWeight: '700',
  },
});
