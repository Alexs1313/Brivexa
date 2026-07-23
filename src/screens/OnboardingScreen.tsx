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

import { onboardingBackground } from '../data/assets';
import { ONBOARDING_STEPS } from '../data/onboarding';

import { useAdaptive } from '../hooks/useAdaptive';
import { colors, fonts } from '../constants/theme';

type OnboardingScreenProps = {
  onComplete: () => void;
};

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const adaptive = useAdaptive();
  const insets = useSafeAreaInsets();
  const [stepIndex, setStepIndex] = useState(0);

  const step = ONBOARDING_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
      return;
    }
    setStepIndex(prev => prev + 1);
  };

  const handleBack = () => {
    setStepIndex(prev => Math.max(0, prev - 1));
  };

  return (
    <ImageBackground
      source={onboardingBackground}
      style={styles.OnboardingScreenBackground}
      resizeMode="cover"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          onPress={onComplete}
          style={[
            styles.OnboardingScreenTopSkip,
            { top: insets.top + adaptive.verticalScale(12) },
          ]}
          hitSlop={12}
        >
          <Text style={styles.OnboardingScreenTopSkipFiligree}>Skip</Text>
        </Pressable>

        <View
          style={[
            styles.OnboardingScreenContent,
            {
              paddingTop: insets.top + adaptive.verticalScale(70),
              paddingBottom: insets.bottom + adaptive.verticalScale(20),
            },
          ]}
        >
          <View style={styles.OnboardingScreenHeroEnclave}>
            <Image
              source={step.art}
              style={[
                styles.OnboardingScreenArtSigil,
                { width: adaptive.artSize, height: adaptive.artSize },
              ]}
              resizeMode="contain"
            />
          </View>

          <View style={styles.OnboardingScreenCaptionEnclave}>
            <Text style={styles.OnboardingScreenTitleFiligree}>
              {step.title}
            </Text>
            <Text style={styles.OnboardingScreenDescription}>
              {step.description}
            </Text>
          </View>

          <View style={styles.OnboardingScreenFooter}>
            <PaginationDots
              total={ONBOARDING_STEPS.length}
              activeIndex={stepIndex}
            />

            <View style={styles.OnboardingScreenActionRow}>
              {!isFirstStep ? (
                <BackButton label="Back" onPress={handleBack} />
              ) : null}
              <PrimaryButton
                label={step.buttonLabel}
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
  OnboardingScreenFacetChassis: {
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

  OnboardingScreenTopSkipFiligree: {
    color: colors.skip,
    fontFamily: fonts.sansRegular,
    fontSize: 15,
  },

  OnboardingScreenContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },
  OnboardingScreenHeroEnclave: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  OnboardingScreenArtSigil: {
    maxHeight: 393,
  },
  OnboardingScreenCaptionEnclave: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  OnboardingScreenTitleFiligree: {
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
