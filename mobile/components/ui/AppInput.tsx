/**
 * @file AppInput.tsx
 * @brief Champ de saisie stylé avec placeholder grisé
 */

import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

/**
 * @interface AppInputProps
 * @brief Propriétés du champ de saisie
 * @extends TextInputProps
 */
interface AppInputProps extends TextInputProps {}

/**
 * @function AppInput
 * @brief Champ de saisie réutilisable
 * @param {AppInputProps} props - Propriétés du composant
 * @returns {React.JSX.Element} Input stylé
 */
export const AppInput: React.FC<AppInputProps> = ({ style, ...props }) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="#9CA3AF"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
    color: '#1F2937',
  },
});