import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts } from '../../constants/theme';

type ProgressRingProps = {
  done: number;
  total: number;
  size?: number;
  strokeWidth?: number;
};

const SEGMENTS = 36;

export function ProgressRing({
  done,
  total,
  size = 74,
  strokeWidth = 8,
}: ProgressRingProps) {
  const progress = total <= 0 ? 0 : Math.min(1, Math.max(0, done / total));
  const complete = total > 0 && done >= total;
  const filled = Math.round(progress * SEGMENTS);
  const ringColor = complete ? colors.success : colors.gold;
  const label =
    total <= 0 ? '0%' : complete ? '✓' : `${Math.round(progress * 100)}%`;

  const segments = useMemo(() => {
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const length = strokeWidth * 0.95;
    const thickness = (2 * Math.PI * radius) / SEGMENTS - 1.2;

    return Array.from({ length: SEGMENTS }, (_, index) => {
      const angle = (index / SEGMENTS) * Math.PI * 2 - Math.PI / 2;
      const x = center + radius * Math.cos(angle) - thickness / 2;
      const y = center + radius * Math.sin(angle) - length / 2;
      const deg = (angle * 180) / Math.PI + 90;
      return {
        key: index,
        active: index < filled,
        style: {
          position: 'absolute' as const,
          left: x,
          top: y,
          width: thickness,
          height: length,
          borderRadius: thickness / 2,
          backgroundColor: index < filled ? ringColor : colors.progressPista,
          transform: [{ rotate: `${deg}deg` }],
        },
      };
    });
  }, [filled, ringColor, size, strokeWidth]);

  return (
    <View
      style={[styles.ProgressRingRaizCasco, { width: size, height: size }]}
    >
      {segments.map(segment => (
        <View key={segment.key} style={segment.style} />
      ))}
      <View style={styles.ProgressRingCenter}>
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
  ProgressRingRaizCasco: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  ProgressRingCenter: {
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
