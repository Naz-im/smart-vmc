import { useState, useEffect, useMemo } from 'react';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { BleManager, Device } from 'react-native-ble-plx';
import { encode, decode } from 'base-64';

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
const CHAR_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
const CHAR_IP_UUID = "12345678-1234-1234-1234-1234567890ab";

export const useBLE = () => {
  const bleManager = useMemo(() => new BleManager(), []);
  const [bleStatus, setBleStatus] = useState('En attente...');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
    }
    return () => { bleManager.destroy(); };
  }, [bleManager]);

  const scanAndConfigure = (
    ssid: string, 
    pass: string, 
    lat: string, 
    lon: string, 
    ip: string,
    tMax: string,
    tMin: string,
    aqiMax: string,
    aqiMin: string,
    onSuccess: () => void
  ) => {
    if (isScanning) return;
    setIsScanning(true);
    setBleStatus('Recherche ESP32...');

    const scanTimeout = setTimeout(() => { 
        if (isScanning) { bleManager.stopDeviceScan(); setIsScanning(false); setBleStatus('Timeout'); } 
    }, 15000);

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        setBleStatus('Erreur: ' + error.message);
        setIsScanning(false);
        clearTimeout(scanTimeout);
        return;
      }

      if (device && (device.name === 'ESP32_SmartWindow' || device.localName === 'ESP32_SmartWindow')) {
        bleManager.stopDeviceScan();
        clearTimeout(scanTimeout);
        setBleStatus('Connexion...');
        
        device.connect()
          .then((d) => d.discoverAllServicesAndCharacteristics())
          .then((d) => {
            setBleStatus('Envoi Config...');
            const configStr = `${ssid};${pass};${lat};${lon};${tMax};${tMin};${aqiMax};${aqiMin}`;
            return d.writeCharacteristicWithResponseForService(SERVICE_UUID, CHAR_UUID, encode(configStr))
                .then(() => d);
          })
          .then(async (d) => {
            setBleStatus('Config envoyée ! ✅');
            setIsScanning(false);
            Alert.alert("Succès", "L'ESP32 redémarre...");
            setTimeout(onSuccess, 1000);
            await d.cancelConnection();
          })
          .catch(async (err) => {
             setBleStatus('Erreur écriture: ' + err.message);
             setIsScanning(false);
             if (device) await device.cancelConnection();
          });
      }
    });
  };

  const scanAndGetIp = (onFound: (ip: string) => void) => {
    if (isScanning) return;
    setIsScanning(true);
    setBleStatus('Recherche IP...');

    const scanTimeout = setTimeout(() => { 
        if (isScanning) { bleManager.stopDeviceScan(); setIsScanning(false); setBleStatus('Timeout IP'); } 
    }, 10000);

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) { setIsScanning(false); return; }

      if (device && (device.name === 'ESP32_SmartWindow' || device.localName === 'ESP32_SmartWindow')) {
        bleManager.stopDeviceScan();
        clearTimeout(scanTimeout);
        setBleStatus('Lecture IP...');
        
        device.connect()
          .then((d) => d.discoverAllServicesAndCharacteristics())
          .then((d) => d.readCharacteristicForService(SERVICE_UUID, CHAR_IP_UUID)
            .then(char => ({ char, device: d }))
          )
          .then(async ({ char, device }) => {
            if (char.value) {
                const decodedIp = decode(char.value);
                setBleStatus('IP Trouvée: ' + decodedIp);
                onFound(decodedIp);
            }
            await device.cancelConnection(); 
            setIsScanning(false);
          })
          .catch(async (err) => {
             setBleStatus('Erreur Lecture: ' + err.message);
             setIsScanning(false);
             if (device) await device.cancelConnection();
          });
      }
    });
  };

  return { bleStatus, isScanning, scanAndConfigure, scanAndGetIp };
};