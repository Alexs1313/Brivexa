import {Platform} from 'react-native';

import {fonts} from './fonts';

export const DESIGN_WIDTH = 393;
export const DESIGN_HEIGHT = 852;

export const colors = {
  background: '#1a1140',
  surface: '#150e33',
  surfaceDeep: '#0f0a26',
  card: '#1b1550',
  cardElevated: '#221a5e',
  cardBorde: 'rgba(255, 194, 71, 0.28)',
  gold: '#ffc247',
  goldBrillante: '#ffd36a',
  buttonGradientStart: '#ffce5a',
  buttonGradientEnd: '#e8a021',
  goldBorde: 'rgba(255, 194, 71, 0.35)',
  cream: '#f3eeff',
  body: '#b9a8e8',
  bodyApagado: '#9d8ad4',
  bodySuave: '#cdbef0',
  label: '#7c6cae',
  skip: '#9d8ad4',
  border: '#3a2c72',
  borderSuave: '#2a1f5a',
  emptyBorde: '#4a3a86',
  emptyRelleno: '#180f42',
  pill: '#2a1f5a',
  tabInactivo: '#6b5aa0',
  tabBar: 'rgba(20, 10, 45, 0.94)',
  success: '#3ecf8e',
  successSuave: 'rgba(62, 207, 142, 0.16)',
  successBoton: '#3ecf8e',
  successButtonText: '#0b1f16',
  successButtonDark: '#0b1f16',
  priorityHigh: '#f0932b',
  prioritySuave: 'rgba(240, 147, 43, 0.16)',
  danger: '#ec5b5b',
  dangerSuave: 'rgba(236, 91, 91, 0.15)',
  dangerSoftStrong: 'rgba(236, 91, 91, 0.22)',
  dangerBorde: 'rgba(236, 91, 91, 0.45)',
  expenseDinero: '#ec8080',
  infoBanda: 'rgba(74, 158, 255, 0.1)',
  infoBannerBorde: 'rgba(74, 158, 255, 0.25)',
  infoBannerText: '#a9cdf5',
  info: '#5a8bff',
  infoSuave: 'rgba(74, 158, 255, 0.16)',
  infoIconSuave: 'rgba(74, 158, 255, 0.15)',
  goldSuave: 'rgba(245, 182, 66, 0.15)',
  plannedSuave: 'rgba(139, 148, 173, 0.16)',
  dotInactivo: '#3a2c72',
  progressPista: '#2a2060',
  progressTrackDeep: '#1a1548',
  toastBg: 'rgba(30, 22, 70, 0.96)',
  backBoton: '#2a2060',
  backButtonBorde: '#4a3a86',
  backButtonText: '#cdbef0',
  buttonText: '#2a1c05',
  loaderCapa: 'rgba(15, 10, 38, 0.6)',
  black: '#030807',
  white: '#ffffff',
};

export const spacing = {
  s: 8,
  m: 12,
  l: 16,
  xl: 20,
  xxl: 28,
};

export const radius = {
  card: 18,
  button: 14,
  chip: 8,
  pill: 100,
};

export const fontSize = {
  brand: 9,
  caption: 10,
  small: 11,
  body: 15,
  button: 15,
  title: 26,
  hero: 32,
};

export const layout = {
  screenRelleno: 18,
  buttonHeightCompact: 48,
  buttonHeightDefault: 50,
};

export const topInset = (value: number) =>
  Platform.OS === 'android' ? Math.max(value, 30) : value;

export {fonts};
