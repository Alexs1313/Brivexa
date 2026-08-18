import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors } from '../../constants/theme';

type PaginationDotsProps = {
  total: number;
  activeIndice: number;
};

export function PaginationDots({ total, activeIndice }: PaginationDotsProps) {
  return (
    <View style={styles.PaginationDotsRaizCasco}>
      {Array.from({ length: total }).map((_, index) => {
        const isActivo = index === activeIndice;

        return (
          <View
            key={index}
            style={[
              styles.PaginationDotsDot,
              isActivo && styles.PaginationDotsDotActive,
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  PaginationDotsRaizCasco: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  PaginationDotsDot: {
    backgroundColor: colors.dotInactivo,
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
