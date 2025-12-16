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
  onAutoDetect: () => void;
}

const SetupPanel: React.FC<SetupPanelProps> = ({ bleStatus, isScanning, onConnect, savedIp, onAutoDetect }) => {
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
      
      <Text style={{fontWeight:'bold', marginTop:10}}>Adresse IP de l'ESP32</Text>
      <View style={{flexDirection:'row', gap: 10, alignItems: 'center'}}>
          <AppInput 
            style={{flex: 1, marginBottom: 0}} 
            value={ip} 
            onChangeText={setIp} 
            placeholder="0.0.0.0" 
            keyboardType='numeric'
          />
          <AppButton 
            title="🔍 AUTO" 
            onPress={onAutoDetect} 
            isLoading={isScanning}
            style={{height: 50, paddingHorizontal: 15, marginBottom: 0}}
          />
      </View>
      <View style={{height: 15}} />

      <Text style={{fontWeight:'bold', marginTop:10}}>WiFi & Localisation</Text>
      <AppInput value={ssid} onChangeText={setSsid} placeholder="SSID WiFi" autoCapitalize='none'/>
      <AppInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Mot de passe"/>
      
      <View style={{flexDirection:'row', gap:10}}>
        <AppInput style={{flex:1}} value={lat} onChangeText={setLat} placeholder="Lat" keyboardType='numeric'/>
        <AppInput style={{flex:1}} value={lon} onChangeText={setLon} placeholder="Lon" keyboardType='numeric'/>
      </View>

      <Text style={styles.statusText}>{bleStatus}</Text>
      
      <AppButton 
        title={isScanning ? 'RECHERCHE...' : 'ENVOYER CONFIG'}
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