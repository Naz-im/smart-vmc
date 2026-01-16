/**
 * @file ConfigurationPanel.tsx
 * @brief Panneau de configuration des seuils de température et pollution
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Card } from './ui/Card';
import { AppInput } from './ui/AppInput';
import { AppButton } from './ui/AppButton';
import { WindowState } from '../hooks/useWindowApi';

/**
 * @interface ConfigurationPanelProps
 * @brief Propriétés du panneau de configuration
 * @property {WindowState|null} windowState - État courant de la fenêtre
 * @property {(tMax:number,tMin:number,aqiMax:number)=>void} onUpdateThresholds - Callback de mise à jour des seuils
 * @property {boolean} isLoading - Indique si une sauvegarde est en cours
 */
interface ConfigurationPanelProps {
  windowState: WindowState | null;
  onUpdateThresholds: (tMax: number, tMin: number, aqiMax: number) => void;
  isLoading: boolean;
}

/**
 * @function ConfigurationPanel
 * @brief Formulaire de configuration des seuils (température, AQI) pour le mode Auto
 * @param {ConfigurationPanelProps} props - Propriétés du composant
 * @returns {React.JSX.Element} Carte de configuration
 */
const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({ 
  windowState, 
  onUpdateThresholds, 
  isLoading 
}) => {

  const [localTMax, setLocalTMax] = useState(String(windowState?.tMax ?? '25'));
  const [localTMin, setLocalTMin] = useState(String(windowState?.tMin ?? '19'));
  const [localAqiMax, setLocalAqiMax] = useState(String(windowState?.aqiMax ?? '50'));

  useEffect(() => {
    if (windowState) {
      setLocalTMax(String(windowState.tMax));
      setLocalTMin(String(windowState.tMin));
      setLocalAqiMax(String(windowState.aqiMax));
    }
  }, [windowState]);

  /**
   * @function handleSaveThresholds
   * @brief Valide et transmet les nouveaux seuils
   * @details Vérifie que les valeurs sont numériques avant d'appeler onUpdateThresholds
   */
  const handleSaveThresholds = () => {
    const tMax = parseFloat(localTMax);
    const tMin = parseFloat(localTMin);
    const aqiMax = parseInt(localAqiMax, 10);
    
    if (isNaN(tMax) || isNaN(tMin) || isNaN(aqiMax)) {
        Alert.alert("Erreur", "Veuillez entrer des valeurs numériques valides.");
        return;
    }
    
    onUpdateThresholds(tMax, tMin, aqiMax);
  };

  return (
    <View>
      <Card>
          <Text style={styles.cardTitle}>Configuration Automatique</Text>
          <Text style={styles.subtitle}>Ces seuils pilotent le mode Auto.</Text>

          {/* SECTION TEMPÉRATURE */}
          <Text style={styles.sectionLabel}>Seuils de Température (°C)</Text>
          <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Ouverture entre</Text>
                <AppInput 
                    value={localTMin} 
                    onChangeText={setLocalTMin} 
                    placeholder="Min" 
                    keyboardType='numeric'
                    editable={!isLoading}
                />
              </View>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Et</Text>
                <AppInput 
                    value={localTMax} 
                    onChangeText={setLocalTMax} 
                    placeholder="Max" 
                    keyboardType='numeric'
                    editable={!isLoading}
                />
              </View>
          </View>
          
          {/* SECTION POLLUTION */}
          <Text style={styles.sectionLabel}>Seuils de Pollution (AQI)</Text>
          <View style={styles.row}>
              <View style={styles.halfInput}>
                <Text style={styles.inputLabel}>Ouverture sous le seuil de:</Text>
                <AppInput 
                    value={localAqiMax} 
                    onChangeText={setLocalAqiMax} 
                    placeholder="Max" 
                    keyboardType='numeric'
                    editable={!isLoading}
                />
              </View>
          </View>
          
          <AppButton 
              title={isLoading ? "SAUVEGARDE EN COURS..." : "ENREGISTRER LES RÉGLAGES"} 
              onPress={handleSaveThresholds} 
              style={{marginTop: 10}}
              isLoading={isLoading}
          />
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007A5E',
    marginBottom: 5,
  },
  subtitle: {
    color: '#666',
    marginBottom: 20,
    fontStyle: 'italic',
    fontSize: 14,
  },
  sectionLabel: {
    fontWeight: '700',
    marginBottom: 10,
    color: '#333',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row', 
    gap: 15, 
    marginBottom: 10 
  },
  halfInput: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 12,
    color: '#888',
    marginBottom: 4,
    marginLeft: 4,
  }
});

export default ConfigurationPanel;