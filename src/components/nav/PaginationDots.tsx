import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '../../constants/theme';

type PaginationDotsProps = {
  total: number;
  activeIndex: number;
};

export function PaginationDots({ total, activeIndex }: PaginationDotsProps) {
  return (
    <View style={styles.PaginationDotsRootHull}>
      {Array.from({ length: total }).map((_, index) => {
        const isActive = index === activeIndex;

        return (
          <View
            key={index}
            style={[
              styles.PaginationDotsDot,
              isActive && styles.PaginationDotsDotActive,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  PaginationDotsRootHull: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  PaginationDotsDot: {
    backgroundColor: colors.dotInactive,
    borderRadius: 4,
    height: 7,
    width: 7,
  },

  PaginationDotsDotActive: {
    backgroundColor: colors.gold,
    borderRadius: 4,
    width: 22,
  },
});
