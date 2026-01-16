/**
 * @file Card.tsx
 * @brief Conteneur carte avec ombre et arrondis
 */

import React from 'react';
import { View, StyleSheet, ViewStyle, ViewProps } from 'react-native';

/**
 * @interface CardProps
 * @brief Propriétés du composant carte
 * @property {React.ReactNode} children - Contenu de la carte
 * @property {ViewStyle} [style] - Styles additionnels
 */
interface CardProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}
/**
 * @function Card
 * @brief Conteneur stylé type carte
 * @param {CardProps} props - Propriétés du composant
 * @returns {React.JSX.Element} Carte
 */
export const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  return <View style={[styles.card, style]} {...props}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});