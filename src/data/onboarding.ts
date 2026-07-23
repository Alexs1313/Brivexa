import type {ImageSourcePropType} from 'react-native';

import {onboardingArt} from './assets';

export type OnboardingStep = {
  art: ImageSourcePropType;
  title: string;
  description: string;
  buttonLabel: string;
};

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    art: onboardingArt.step1,
    title: 'Manage Every Field',
    description:
      'Keep crop details, field activity, expenses, and harvest records in one organized place.',
    buttonLabel: 'Next',
  },
  {
    art: onboardingArt.step2,
    title: 'Plan Daily Work',
    description:
      'Schedule jobs, assign equipment, record materials, and track progress from start to finish.',
    buttonLabel: 'Next',
  },
  {
    art: onboardingArt.step3,
    title: 'Calculate and Control',
    description:
      'Calculate seed, fertilizer, and spray requirements while monitoring stock, equipment, and farm costs.',
    buttonLabel: 'Start Managing',
  },
];
