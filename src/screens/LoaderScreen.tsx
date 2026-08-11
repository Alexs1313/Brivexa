import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { APP_BRAND_LINE, APP_TAGLINE } from '../constants/brand';
import { icons } from '../data/assets';

import { colors, fonts } from '../constants/theme';

const LOADER_DURATION = 3000;

type LoaderScreenProps = {
  onComplete: () => void;
};

export function LoaderScreen({ onComplete }: LoaderScreenProps) {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1100,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    loop.start();

    const timeout = setTimeout(onComplete, LOADER_DURATION);

    return () => {
      loop.stop();
      clearTimeout(timeout);
    };
  }, [onComplete, spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.LoaderScreenFacetChassis}>
      <ImageBackground
        source={icons.loaderBg}
        style={styles.LoaderScreenBackground}
        resizeMode="cover"
      >
        <View style={styles.LoaderScreenContent}>
          <Text style={styles.LoaderScreenCowSigil}>🐂</Text>
          <Text style={styles.LoaderScreenBrandFiligree}>{APP_BRAND_LINE}</Text>
          <Text style={styles.LoaderScreenTaglineFiligree}>{APP_TAGLINE}</Text>

          <Animated.View
            style={[
              styles.LoaderScreenSpinnerRing,
              { transform: [{ rotate }] },
            ]}
          />
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  LoaderScreenFacetChassis: {
    backgroundColor: colors.black,
    flex: 1,
  },
  LoaderScreenBackground: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  LoaderScreenGlowVeil: {
    bottom: 0,
    height: '100%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
  },

  LoaderScreenContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  LoaderScreenCowSigil: {
    fontSize: 34,
    marginBottom: 10,
  },
  LoaderScreenBrandFiligree: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
    paddingHorizontal: 24,
    textAlign: 'center',
  },

  LoaderScreenTaglineFiligree: {
    color: colors.body,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    letterSpacing: 2,
    marginTop: 6,
  },

  LoaderScreenSpinnerRing: {
    borderColor: colors.gold,
    borderRadius: 24,
    borderTopColor: 'transparent',
    borderWidth: 3,
    height: 48,
    marginTop: 56,
    width: 48,
  },
});
