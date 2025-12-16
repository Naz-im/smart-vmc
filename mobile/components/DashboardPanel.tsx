import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { Card } from './ui/Card';
// ATTENTION: Changement des imports de default (sans {}) à named (avec {})
import { StatusDisplay } from './dashboard/StatusDisplay'; 
import { SensorRow } from './dashboard/SensorRow';
import { ControlPanel } from './dashboard/ControlPanel';
import { WindowApiState } from '../hooks/useWindowApi';
import { AppInput } from './ui/AppInput';
import { AppButton } from './ui/AppButton';

interface DashboardPanelProps {
  windowState: WindowApiState;
  onRefresh: () => void;
  onToggleAuto: (value: boolean) => void;
  onCommand: (action: 'open' | 'close') => void;
  onAngleChange: (val: number) => void;
  onUpdateThresholds: (tMax: number, tMin: number, aqiMax: number, aqiMin: number) => void;
  isLoading: boolean;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({ 
  windowState, 
  onRefresh, 
  onToggleAuto, 
  onCommand, 
  onAngleChange,
  onUpdateThresholds,
  isLoading
}) => {
  
  const [localTMax, setLocalTMax] = useState(String(windowState.tMax));
  const [localTMin, setLocalTMin] = useState(String(windowState.tMin));
  const [localAqiMax, setLocalAqiMax] = useState(String(windowState.aqiMax));
  const [localAqiMin, setLocalAqiMin] = useState(String(windowState.aqiMin));

  useEffect(() => {
    setLocalTMax(String(windowState.tMax));
    setLocalTMin(String(windowState.tMin));
    setLocalAqiMax(String(windowState.aqiMax));
    setLocalAqiMin(String(windowState.aqiMin));
  }, [windowState.tMax, windowState.tMin, windowState.aqiMax, windowState.aqiMin]);

  const handleSaveThresholds = () => {
    const tMax = parseFloat(localTMax);
    const tMin = parseFloat(localTMin);
    const aqiMax = parseInt(localAqiMax, 10);
    const aqiMin = parseInt(localAqiMin, 10);
    
    if (isNaN(tMax) || isNaN(tMin) || isNaN(aqiMax) || isNaN(aqiMin)) {
        Alert.alert("Erreur", "Veuillez entrer des valeurs numériques valides.");
        return;
    }
    
    onUpdateThresholds(tMax, tMin, aqiMax, aqiMin);
  };

  return (
    <View>
      
      <StatusDisplay windowState={windowState} onRefresh={onRefresh} />
      
      <Card style={{marginBottom: 20}}>
          <Text style={styles.cardTitle}>Configuration Auto</Text>
          <Text style={{fontWeight:'bold', marginTop:10}}>Seuils de Température (°C)</Text>
          <View style={{flexDirection:'row', gap:10}}>
              <AppInput 
                  style={{flex:1}} 
                  value={localTMax} 
                  onChangeText={setLocalTMax} 
                  placeholder="Max (Fermeture)" 
                  keyboardType='numeric'
                  editable={!isLoading}
              />
              <AppInput 
                  style={{flex:1}} 
                  value={localTMin} 
                  onChangeText={setLocalTMin} 
                  placeholder="Min (Ouverture)" 
                  keyboardType='numeric'
                  editable={!isLoading}
              />
          </View>
          
          <Text style={{fontWeight:'bold', marginTop:10}}>Seuils de Pollution (AQI)</Text>
          <View style={{flexDirection:'row', gap:10}}>
              <AppInput 
                  style={{flex:1}} 
                  value={localAqiMax} 
                  onChangeText={setLocalAqiMax} 
                  placeholder="Max (Fermeture)" 
                  keyboardType='numeric'
                  editable={!isLoading}
              />
              <AppInput 
                  style={{flex:1}} 
                  value={localAqiMin} 
                  onChangeText={setLocalAqiMin} 
                  placeholder="Min (Ouverture)" 
                  keyboardType='numeric'
                  editable={!isLoading}
              />
          </View>
          
          <AppButton 
              title={isLoading ? "SAUVEGARDE..." : "SAUVEGARDER LES SEUILS"} 
              onPress={handleSaveThresholds} 
              style={{marginTop: 15}}
              isLoading={isLoading}
          />
      </Card>

      <SensorRow title="Température Actuelle" value={windowState.temp} unit="°C" icon="thermometer" />
      <SensorRow title="Qualité Air (AQI)" value={windowState.aqi} unit="" icon="air-filter" />
      <ControlPanel 
          windowState={windowState}
          onToggleAuto={onToggleAuto}
          onCommand={onCommand}
          onAngleChange={onAngleChange}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
});

export default DashboardPanel;