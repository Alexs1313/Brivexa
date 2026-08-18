import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import { colors, fonts, layout, radius } from '../../constants/theme';

type PrimaryButtonProps = {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  fullWidth?: boolean;
};

export function PrimaryButton({
  label,
  onPress,
  style,
  fullWidth = false,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[fullWidth && styles.PrimaryButtonButtonWide, style]}
    >
      {({ pressed }) => (
        <LinearGradient
          colors={[colors.buttonGradientStart, colors.buttonGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.PrimaryButtonBtnPlinto,
            pressed && styles.PrimaryButtonButtonPressedDim,
          ]}
        >
          <Text style={styles.PrimaryButtonLabelFiligrana}>{label}</Text>
        </LinearGradient>
      )}
    </Pressable>
  );
}

type BackButtonProps = {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

export function BackButton({ label, onPress, style }: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.PrimaryButtonBackButtonPlinto,
        pressed && styles.PrimaryButtonButtonPressedDim,
        style,
      ]}
    >
      <View>
        <Text style={styles.PrimaryButtonBackButtonLabelFiligrana}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  PrimaryButtonBtnPlinto: {
    alignItems: 'center',
    borderRadius: radius.button,
    flexDirection: 'row',
    gap: 8,
    height: layout.buttonHeightDefault,
    justifyContent: 'center',
  },

  PrimaryButtonButtonWide: {
    flex: 0,
    width: '100%',
  },
  PrimaryButtonButtonPressedDim: {
    opacity: 0.85,
  },



  PrimaryButtonLabelFiligrana: {
    color: colors.buttonText,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
  PrimaryButtonBackButtonPlinto: {
    alignItems: 'center',
    backgroundColor: colors.backBoton,
    borderColor: colors.backButtonBorde,
    borderRadius: radius.button,
    borderWidth: 1,
    height: layout.buttonHeightDefault,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },

  PrimaryButtonBackButtonLabelFiligrana: {
    color: colors.backButtonText,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
});
