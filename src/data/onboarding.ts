import type {ImageSourcePropType} from 'react-native';

import {onboardingArte} from './assets';

export type OnboardingStep = {
  art: ImageSourcePropType;
  title: string;
  description: string;
  buttonEtiqueta: string;
};

export const ONBOARDING_PASOS: OnboardingStep[] = [
  {
    art: onboardingArte.step1,
    title: 'Manage Every Field',
    description:
      'Keep crop details, field activity, expenses, and harvest records in one organized place.',
    buttonEtiqueta: 'Next',
  },
  {
    art: onboardingArte.step2,
    title: 'Plan Daily Work',
    description:
      'Schedule jobs, assign equipment, record materials, and track progress from start to finish.',
    buttonEtiqueta: 'Next',
  },
  {
    art: onboardingArte.step3,
    title: 'Calculate and Control',
    description:
      'Calculate sowing, fertilizer, and spray requirements while monitoring stock, equipment, and farm costs.',
    buttonEtiqueta: 'Start Managing',
  },
];
