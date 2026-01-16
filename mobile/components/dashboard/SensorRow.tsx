/**
 * @file SensorRow.tsx
 * @brief Ligne d'affichage des valeurs de capteurs (température et AQI)
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * @interface SensorRowProps
 * @brief Propriétés de la ligne de capteurs
 * @property {number} temp - Température en degrés Celsius
 * @property {number} aqi - Indice de qualité de l'air
 */
interface SensorRowProps {
  temp: number;
  aqi: number;
}

/**
 * @function SensorRow
 * @brief Affiche la température et l'AQI sous forme de badges
 * @param {SensorRowProps} props - Propriétés du composant
 * @returns {React.JSX.Element} Ligne de capteurs
 */
export const SensorRow: React.FC<SensorRowProps> = ({ temp, aqi }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.value}>🌡️ {temp !== undefined && temp !== null ? temp.toFixed(1) : '--'}°C</Text>
      <Text style={styles.value}>🏭 AQI {aqi ?? '--'}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 25,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
});