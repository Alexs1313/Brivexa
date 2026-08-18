import React, { useState } from 'react';
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackButton, PrimaryButton } from '../components/buttons/PrimaryButton';
import { PaginationDots } from '../components/nav/PaginationDots';

import { onboardingFondo } from '../data/assets';
import { ONBOARDING_PASOS } from '../data/onboarding';

import { useAdaptativo } from '../hooks/useAdaptativo';
import { colors, fonts } from '../constants/theme';

type OnboardingScreenProps = {
  onCompletar: () => void;
};

export function OnboardingScreen({ onCompletar }: OnboardingScreenProps) {
  const adaptive = useAdaptativo();
  const insets = useSafeAreaInsets();
  const [stepIndice, setStepIndice] = useState(0);

  const step = ONBOARDING_PASOS[stepIndice];
  const isFirstPaso = stepIndice === 0;
  const isLastPaso = stepIndice === ONBOARDING_PASOS.length - 1;

  const handleNext = () => {
    if (isLastPaso) {
      onCompletar();
      return;
    }
    setStepIndice(prev => prev + 1);
  };

  const handleBack = () => {
    setStepIndice(prev => Math.max(0, prev - 1));
  };

  return (
    <ImageBackground
      source={onboardingFondo}
      style={styles.OnboardingScreenBackground}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={onCompletar}
          style={[
            styles.OnboardingScreenTopSkip,
            { top: insets.top + adaptive.verticalEscala(12) },
          ]}
          hitSlop={12}
        >
          <Text style={styles.OnboardingScreenTopSkipFiligrana}>Skip</Text>
        </Pressable>

        <View
          style={[
            styles.OnboardingScreenContent,
            {
              paddingTop: insets.top + adaptive.verticalEscala(70),
              paddingBottom: insets.bottom + adaptive.verticalEscala(20),
            },
          ]}
        >
          <View style={styles.OnboardingScreenHeroBolsillo}>
            <Image
              source={step.art}
              style={[
                styles.OnboardingScreenArtEmblema,
                { width: adaptive.artTamano, height: adaptive.artTamano },
              ]}
              resizeMode="contain"
            />
          </View>

          <View style={styles.OnboardingScreenCaptionBolsillo}>
            <Text style={styles.OnboardingScreenTitleFiligrana}>
              {step.title}
            </Text>
            <Text style={styles.OnboardingScreenDescription}>
              {step.description}
            </Text>
          </View>

          <View style={styles.OnboardingScreenFooter}>
            <PaginationDots
              total={ONBOARDING_PASOS.length}
              activeIndice={stepIndice}
            />

            <View style={styles.OnboardingScreenActionRow}>
              {!isFirstPaso ? (
                <BackButton label="Back" onPress={handleBack} />
              ) : null}
              <PrimaryButton
                label={step.buttonEtiqueta}
                onPress={handleNext}
                fullWidth
                style={styles.OnboardingScreenPrimaryAction}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  OnboardingScreenRaizCasco: {
    backgroundColor: colors.background,
    flex: 1,
  },



  OnboardingScreenBackground: {
    flex: 1,
  },



  OnboardingScreenTopSkip: {
    position: 'absolute',
    right: 18,
    zIndex: 2,
  },

  OnboardingScreenTopSkipFiligrana: {
    color: colors.skip,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },


  OnboardingScreenContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },

  OnboardingScreenHeroBolsillo: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },


  OnboardingScreenArtEmblema: {
    maxHeight: 393,
  },
  OnboardingScreenCaptionBolsillo: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },


  OnboardingScreenTitleFiligrana: {
    color: colors.cream,
    fontFamily: fonts.sansBold,
    fontSize: 26,
    fontWeight: '700',
    lineHeight: 31,
    marginBottom: 12,
    textAlign: 'center',
  },

  OnboardingScreenDescription: {
    color: colors.body,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
  },


  OnboardingScreenFooter: {
    gap: 24,
    paddingTop: 28,
  },



  OnboardingScreenActionRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },



  OnboardingScreenPrimaryAction: {
    flex: 1,
  },
});
