import React from 'react';
import { GestureResponderEvent, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

const themeColor = '#20756aff';

type ButtonProps = {
  title: string;
  type?: 'primary' | 'secondary';
  onPress: (event: GestureResponderEvent) => void;
  style?: ViewStyle | ViewStyle[];
};

export default function Button({ title, type = 'primary', onPress, style }: ButtonProps) {
  const isPrimary = type === 'primary';

  return (
    <TouchableOpacity
      style={[isPrimary ? styles.primaryButton : styles.secondaryButton, style]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={isPrimary ? styles.primaryText : styles.secondaryText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: themeColor,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  } as ViewStyle,
  secondaryButton: {
    backgroundColor: '#fff',
    borderColor: themeColor,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle,
  secondaryText: {
    color: themeColor,
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle,
});
