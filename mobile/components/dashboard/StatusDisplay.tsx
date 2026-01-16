/**
 * @file StatusDisplay.tsx
 * @brief Affichage de l'état global de la VMC (ouverte/fermée/verrouillée)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * @interface StatusDisplayProps
 * @brief Propriétés de l'affichage d'état
 * @property {boolean} isOpen - Fenêtre ouverte ou non
 * @property {boolean} [isLocked] - Verrouillage de sécurité actif
 */
interface StatusDisplayProps {
  isOpen: boolean;
  isLocked?: boolean;
}
/**
 * @function StatusDisplay
 * @brief Affiche l'état visuel de la VMC avec emoji et texte coloré
 * @param {StatusDisplayProps} props - Propriétés du composant
 * @returns {React.JSX.Element} Vue d'état
 */
export const StatusDisplay: React.FC<StatusDisplayProps> = ({ isOpen, isLocked }) => {
  /**
   * @section Cas verrouillé
   * @brief Affiche l'alerte de sécurité
   */
  if (isLocked) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>⚠️</Text>
        <Text style={[styles.text, { color: '#DC2626' }]}>
          SÉCURITÉ ACTIVE
        </Text>
        <Text style={styles.subtext}>Moteur bloqué</Text>
      </View>
    );
  }
  /**
   * @section Cas normal
   * @brief Affiche OUVERTE (vert) ou FERMÉE (rouge)
   */
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>
        {isOpen ? '💨' : '🚫'}
      </Text>
      <Text style={[
        styles.text, 
        { color: isOpen ? '#007A5E' : '#EF4444' }
      ]}>
        {isOpen ? 'OUVERTE' : 'FERMÉE'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  text: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  }
});
