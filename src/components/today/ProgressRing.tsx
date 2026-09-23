import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors, fonts } from '../../constants/theme';

type ProgressRingProps = {
  done: number;
  total: number;
  size?: number;
  strokeWidth?: number;
};

export function ProgressRing({
  done,
  total,
  size = 74,
  strokeWidth = 8,
}: ProgressRingProps) {
  const progress = total <= 0 ? 0 : Math.min(1, Math.max(0, done / total));
  const complete = total > 0 && done >= total;
  const ringColor = complete ? colors.success : colors.gold;
  const label =
    total <= 0 ? '0%' : complete ? '✓' : `${Math.round(progress * 100)}%`;

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);
  const center = size / 2;

  return (
    <View
      style={[styles.ProgressRingNucleoAndamio, { width: size, height: size }]}
    >
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={colors.progressPista}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={ringColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View style={styles.ProgressRingCenter} pointerEvents="none">
        <Text
          style={[
            styles.ProgressRingCenterLabel,
            complete && styles.ProgressRingCenterLabelDone,
            { color: complete ? colors.success : colors.cream },
          ]}
        >
          {label}
        </Text>
        {!complete && total > 0 ? (
          <Text style={styles.ProgressRingCenterMeta}>
            {done}/{total}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ProgressRingNucleoAndamio: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  ProgressRingCenter: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ProgressRingCenterLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },

  ProgressRingCenterLabelDone: {
    fontSize: 22,
  },

  ProgressRingCenterMeta: {
    color: colors.bodyApagado,
    fontFamily: fonts.sansRegular,
    fontSize: 10,
    marginTop: 1,
  },
});
