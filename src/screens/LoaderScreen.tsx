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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_BRAND_LINE, APP_TAGLINE } from '../constants/brand';
import { icons } from '../data/assets';
import { useAdaptativo } from '../hooks/useAdaptativo';

import { colors, fonts } from '../constants/theme';

const LOADER_DURATION = 4100;

type LoaderScreenProps = {
  onCompletar: () => void;
};

export function LoaderScreen({ onCompletar }: LoaderScreenProps) {
  const insets = useSafeAreaInsets();
  const adaptive = useAdaptativo();

  const spin = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.82)).current;

  const logoPulse = useRef(new Animated.Value(1)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslate = useRef(new Animated.Value(12)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const enter = Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 520,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 7,
          tension: 55,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(textTranslate, {
          toValue: 0,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(footerOpacity, {
          toValue: 1,
          duration: 480,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]);

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, {
          toValue: 1.05,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(logoPulse, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const spinLoop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    enter.start();
    pulse.start();
    spinLoop.start();

    const timeout = setTimeout(onCompletar, LOADER_DURATION);

    return () => {
      enter.stop();
      pulse.stop();
      spinLoop.stop();
      clearTimeout(timeout);
    };
  }, [
    footerOpacity,
    logoOpacity,
    logoPulse,
    logoScale,
    onCompletar,
    spin,
    textOpacity,
    textTranslate,
  ]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const logoSize = adaptive.loaderLogoTamano;

  return (
    <View style={styles.LoaderScreenNucleoAndamio}>
      <ImageBackground
        source={icons.loaderBg}
        style={styles.LoaderScreenBackground}
        resizeMode="cover"
      >
        <View style={styles.LoaderScreenCenterRecinto}>
          <Animated.View
            style={[
              styles.LoaderScreenLogoWrap,
              {
                opacity: logoOpacity,
                transform: [{ scale: Animated.multiply(logoScale, logoPulse) }],
              },
            ]}
          >
            <Image
              source={icons.appLogo}
              style={[
                styles.LoaderScreenLogoEscudo,
                { width: 320, height: 320 },
              ]}
              resizeMode="cover"
            />
          </Animated.View>

          <Animated.View
            style={{
              opacity: textOpacity,
              transform: [{ translateY: textTranslate }],
              alignItems: 'center',
            }}
          >
            <Text style={styles.LoaderScreenBrandLamina}>
              {APP_BRAND_LINE}
            </Text>
            <Text style={styles.LoaderScreenTaglineLamina}>
              {APP_TAGLINE}
            </Text>
          </Animated.View>
        </View>

        <Animated.View
          style={[
            styles.LoaderScreenFooterAndamio,
            {
              opacity: footerOpacity,
              paddingBottom: Math.max(insets.bottom, 16) + 12,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.LoaderScreenSpinnerRing,
              { transform: [{ rotate }] },
            ]}
          />
        </Animated.View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  LoaderScreenNucleoAndamio: {
    backgroundColor: colors.black,
    flex: 1,
  },

  LoaderScreenBackground: {
    flex: 1,
  },

  LoaderScreenCenterRecinto: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  LoaderScreenLogoWrap: {
    borderRadius: 35,
    marginBottom: 14,
    overflow: 'hidden',
  },

  LoaderScreenLogoEscudo: {
    borderRadius: 52,
  },

  LoaderScreenBrandLamina: {
    color: colors.gold,
    fontFamily: fonts.sansBold,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1,
    paddingHorizontal: 24,
    textAlign: 'center',
    marginTop: 20,
  },

  LoaderScreenTaglineLamina: {
    color: colors.body,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    letterSpacing: 2,
    marginTop: 6,
    textAlign: 'center',
  },

  LoaderScreenFooterAndamio: {
    alignItems: 'center',
    paddingHorizontal: 40,
    width: '100%',
  },

  LoaderScreenSpinnerRing: {
    borderColor: colors.gold,
    borderRadius: 22,
    borderTopColor: 'transparent',
    borderWidth: 3,
    height: 44,
    width: 44,
  },
});
