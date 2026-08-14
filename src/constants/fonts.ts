import {Platform} from 'react-native';

const ios = {
  sansRegular: 'System',
  sansMedium: 'System',
  sansSemiBold: 'System',
  sansBold: 'System',
};

const android = {
  sansRegular: 'sans-serif',
  sansMedium: 'sans-serif-medium',
  sansSemiBold: 'sans-serif-medium',
  sansBold: 'sans-serif',
};

const platformFuentes = Platform.OS === 'ios' ? ios : android;

export const fonts = {
  sansRegular: platformFuentes.sansRegular,
  sansMedium: platformFuentes.sansMedium,
  sansSemiBold: platformFuentes.sansSemiBold,
  sansBold: platformFuentes.sansBold,
};
