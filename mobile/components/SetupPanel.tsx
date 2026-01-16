/**
 * @file SetupPanel.tsx
 * @brief Panneau de configuration initiale avec saisie WiFi et localisation
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import { Card } from './ui/Card';
import { AppInput } from './ui/AppInput';
import { AppButton } from './ui/AppButton';

import Geolocation from 'react-native-geolocation-service';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

/**
 * @interface SetupPanelProps
 * @brief Propriétés du panneau de configuration initiale
 * @property {string} bleStatus - Message de statut BLE
 * @property {boolean} isScanning - Indique si un scan BLE est en cours
 * @property {(ssid:string,pass:string,lat:string,lon:string,ip:string)=>void} onConnect - Callback d’envoi de config
 * @property {string} savedIp - IP mémorisée de l’ESP32
 */
interface SetupPanelProps {
  bleStatus: string;
  isScanning: boolean;
  onConnect: (ssid: string, pass: string, lat: string, lon: string, ip: string) => void;
  savedIp: string;
}

/**
 * @function SetupPanel
 * @brief Formulaire d’envoi des identifiants WiFi + localisation via BLE
 * @param {SetupPanelProps} props - Propriétés du composant
 * @returns {React.JSX.Element} Carte de configuration initiale
 */
const SetupPanel: React.FC<SetupPanelProps> = ({ bleStatus, isScanning, onConnect, savedIp }) => {
  const [ssid, setSsid] = useState('');
  const [password, setPassword] = useState('');
  const [lat, setLat] = useState('45.188');
  const [lon, setLon] = useState('5.724');
  const [ip, setIp] = useState(savedIp);

  useEffect(() => {
    setIp(savedIp);
  }, [savedIp]);

  // Logique de récupération GPS
  useEffect(() => {
    const getLocation = async () => {
      try {
        const permissionType = Platform.OS === 'ios' 
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

        const result = await check(permissionType);
        
        let hasPermission = result === RESULTS.GRANTED;
        
        if (result === RESULTS.DENIED) {
          const requestResult = await request(permissionType);
          hasPermission = requestResult === RESULTS.GRANTED;
        }

        if (!hasPermission) {
          console.log('Permission de localisation refusée');
          return;
        }

        Geolocation.getCurrentPosition(
          (position) => {
            setLat(position.coords.latitude.toString());
            setLon(position.coords.longitude.toString());
          },
          (error) => {
            console.log('Erreur GPS:', error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );

      } catch (err) {
        console.warn(err);
      }
    };

    getLocation();
  }, []);

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