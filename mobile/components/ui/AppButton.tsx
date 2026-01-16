/**
 * @file AppButton.tsx
 * @brief Bouton applicatif stylé (primaire, danger, outline) avec état de chargement
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from 'react-native';

/**
 * @interface AppButtonProps
 * @brief Propriétés du bouton
 * @property {string} title - Libellé du bouton
 * @property {'primary'|'danger'|'outline'} [variant='primary'] - Style visuel
 * @property {boolean} [isLoading=false] - Affiche un spinner et désactive le bouton
 */
interface AppButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'danger' | 'outline';
  isLoading?: boolean;
}

/**
 * @function AppButton
 * @brief Bouton réutilisable avec variantes et état de chargement
 * @param {AppButtonProps} props - Propriétés du composant
 * @returns {React.JSX.Element} Bouton stylé
 */
export const AppButton: React.FC<AppButtonProps> = ({ 
  title, 
  variant = 'primary', 
  isLoading = false,
  style, 
  disabled,
  ...props 
}) => {
  
  // Définition des couleurs selon la variante
  const getBackgroundColor = () => {
    if (variant === 'outline') return '#374151';
    if (variant === 'danger') return '#EF4444'; 
    return '#007A5E';
  };

  const getTextColor = () => {
    if (variant === 'outline') return 'white';
    return 'white';
  };


  return (
    <TouchableOpacity
      style={[
        styles.base,
        { backgroundColor: getBackgroundColor() },
        disabled && styles.disabled, // Style si désactivé
        style,
      ]}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  text: {
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.6,
  }
});