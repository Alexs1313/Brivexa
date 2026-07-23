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
            styles.PrimaryButtonBtnPortico,
            pressed && styles.PrimaryButtonButtonPressedDim,
          ]}
        >
          <Text style={styles.PrimaryButtonLabelFiligree}>{label}</Text>
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
        styles.PrimaryButtonBackButtonPortico,
        pressed && styles.PrimaryButtonButtonPressedDim,
        style,
      ]}
    >
      <View>
        <Text style={styles.PrimaryButtonBackButtonLabelFiligree}>{label}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  PrimaryButtonBtnPortico: {
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

  PrimaryButtonLabelFiligree: {
    color: colors.buttonText,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },

  PrimaryButtonBackButtonPortico: {
    alignItems: 'center',
    backgroundColor: colors.backButton,
    borderColor: colors.backButtonBorder,
    borderRadius: radius.button,
    borderWidth: 1,
    height: layout.buttonHeightDefault,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  PrimaryButtonBackButtonLabelFiligree: {
    color: colors.backButtonText,
    fontFamily: fonts.sansBold,
    fontSize: 15,
    fontWeight: '700',
  },
});
