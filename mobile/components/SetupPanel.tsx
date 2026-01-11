import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { AppInput } from './ui/AppInput';
import { AppButton } from './ui/AppButton';

interface SetupPanelProps {
  bleStatus: string;
  isScanning: boolean;
  onConnect: (ssid: string, pass: string, lat: string, lon: string, ip: string) => void;
  savedIp: string;
}

const SetupPanel: React.FC<SetupPanelProps> = ({ bleStatus, isScanning, onConnect, savedIp }) => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [lat, setLat] = useState('45.188');
  const [lon, setLon] = useState('5.724');
  const [ip, setIp] = useState(savedIp);

  useEffect(() => {
    setIp(savedIp);
  }, [savedIp]);

  return (
    <Card>
      <Text style={styles.sectionTitle}>Configuration</Text>

      <Text style={{fontWeight:'bold', marginTop:10}}>WiFi & Localisation</Text>
      <AppInput value={ssid} onChangeText={setSsid} placeholder="SSID WiFi" autoCapitalize='none' editable={!isScanning}/>
      <AppInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Mot de passe" editable={!isScanning}/>
      
      <View style={{flexDirection:'row', gap:10}}>
        <AppInput style={{flex:1}} value={lat} onChangeText={setLat} placeholder="Lat" keyboardType='numeric' editable={!isScanning}/>
        <AppInput style={{flex:1}} value={lon} onChangeText={setLon} placeholder="Lon" keyboardType='numeric' editable={!isScanning}/>
      </View>

      <Text style={styles.statusText}>{bleStatus}</Text>
      
      <AppButton 
        title={isScanning ? 'ENVOI EN COURS...' : 'ENVOYER CONFIG'}
        // Simplification de l'appel
        onPress={() => onConnect(ssid, password, lat, lon, ip)}
        isLoading={isScanning}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 15, color: '#007A5E' },
  statusText: { marginBottom: 15, textAlign: 'center', color: '#666', fontSize: 14 },
});

export default SetupPanel;