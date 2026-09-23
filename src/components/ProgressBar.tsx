import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { colors } from '../constants/theme';

type ProgressBarProps = {
  progress: number;
  height?: number;
  color?: string;
  trackColor?: string;
  borderRadius?: number;
};

export function ProgressBar({
  progress,
  height = 6,
  color = colors.gold,
  trackColor = colors.progressTrackDeep,
  borderRadius = 999,
}: ProgressBarProps) {
  const clamped = Math.min(1, Math.max(0, progress));
  const [width, setWidth] = React.useState(0);
  const fillWidth = Math.max(clamped > 0 ? height : 0, width * clamped);

  return (
    <View
      style={[styles.ProgressBarTrack, { height, borderRadius }]}
      onLayout={event => setWidth(event.nativeEvent.layout.width)}
    >
      {width > 0 ? (
        <Svg width={width} height={height}>
          <Rect
            x={0}
            y={0}
            width={width}
            height={height}
            rx={borderRadius}
            ry={borderRadius}
            fill={trackColor}
          />
          {fillWidth > 0 ? (
            <Rect
              x={0}
              y={0}
              width={fillWidth}
              height={height}
              rx={borderRadius}
              ry={borderRadius}
              fill={color}
            />
          ) : null}
        </Svg>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ProgressBarTrack: {
    overflow: 'hidden',
    width: '100%',
  },
});
