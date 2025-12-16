import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { AppInput } from './ui/AppInput';
import { AppButton } from './ui/AppButton';

interface SetupPanelProps {
  bleStatus: string;
  isScanning: boolean;
  onConnect: (ssid: string, pass: string, lat: string, lon: string, ip: string, tMax: string, tMin: string, aqiMax: string, aqiMin: string) => void;
  savedIp: string;
  onAutoDetect: () => void;
}

const SetupPanel: React.FC<SetupPanelProps> = ({ bleStatus, isScanning, onConnect, savedIp }) => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [lat, setLat] = useState('45.188');
  const [lon, setLon] = useState('5.724');
  const [ip, setIp] = useState(savedIp);
  const [tMax, setTMax] = useState('30');
  const [tMin, setTMin] = useState('18');
  const [aqiMax, setAqiMax] = useState('50');
  const [aqiMin, setAqiMin] = useState('20');

  useEffect(() => {
    setIp(savedIp);
  }, [savedIp]);

  return (
    <Card>
      <Text style={styles.sectionTitle}>Configuration</Text>
      
      <Text style={{fontWeight:'bold', marginTop:10}}>Adresse IP de l'ESP32</Text>
      <AppInput 
        value={ip} 
        onChangeText={setIp} 
        placeholder="0.0.0.0 (Trouvée automatiquement après config)" 
        keyboardType='numeric'
        editable={!isScanning}
      />
      <View style={{height: 15}} />

      <Text style={{fontWeight:'bold', marginTop:10}}>WiFi & Localisation</Text>
      <AppInput value={ssid} onChangeText={setSsid} placeholder="SSID WiFi" autoCapitalize='none' editable={!isScanning}/>
      <AppInput value={password} onChangeText={setPassword} secureTextEntry placeholder="Mot de passe" editable={!isScanning}/>
      
      <View style={{flexDirection:'row', gap:10}}>
        <AppInput style={{flex:1}} value={lat} onChangeText={setLat} placeholder="Lat" keyboardType='numeric' editable={!isScanning}/>
        <AppInput style={{flex:1}} value={lon} onChangeText={setLon} placeholder="Lon" keyboardType='numeric' editable={!isScanning}/>
      </View>
      
      <Text style={{fontWeight:'bold', marginTop:10}}>Seuils Automatiques (Défaut)</Text>
      <View style={{flexDirection:'row', gap:10}}>
          <AppInput style={{flex:1}} value={tMax} onChangeText={setTMax} placeholder="T° Max (fermeture)" keyboardType='numeric' editable={!isScanning}/>
          <AppInput style={{flex:1}} value={tMin} onChangeText={setTMin} placeholder="T° Min (ouverture)" keyboardType='numeric' editable={!isScanning}/>
      </View>
      <View style={{flexDirection:'row', gap:10}}>
          <AppInput style={{flex:1}} value={aqiMax} onChangeText={setAqiMax} placeholder="AQI Max (fermeture)" keyboardType='numeric' editable={!isScanning}/>
          <AppInput style={{flex:1}} value={aqiMin} onChangeText={setAqiMin} placeholder="AQI Min (ouverture)" keyboardType='numeric' editable={!isScanning}/>
      </View>


      <Text style={styles.statusText}>{bleStatus}</Text>
      
      <AppButton 
        title={isScanning ? 'ENVOI EN COURS...' : 'ENVOYER CONFIG'}
        onPress={() => onConnect(ssid, password, lat, lon, ip, tMax, tMin, aqiMax, aqiMin)}
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