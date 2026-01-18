/**
 * @file useBLE.ts
 * @brief Hook React pour la communication Bluetooth avec l'ESP32
 * @details Gère le scan BLE, la connexion à l'ESP32, et l'échange de données
 */

import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform, Alert } from 'react-native';
import { BleManager } from 'react-native-ble-plx';
import { encode, decode } from 'base-64';

/**
 * @constant {string} SERVICE_UUID
 * @brief UUID du service BLE principal
 */
const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
/**
 * @constant {string} CHAR_UUID
 * @brief UUID de la caractéristique BLE pour la configuration WiFi et localisation
 */
const CHAR_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
/**
 * @constant {string} CHAR_IP_UUID
 * @brief UUID de la caractéristique BLE pour lire l'adresse IP de l'appareil
 */
const CHAR_IP_UUID = "12345678-1234-1234-1234-1234567890ab";
/**
 * @constant {BleManager} bleManager
 * @brief Instance globale du gestionnaire BLE
 */
const bleManager = new BleManager();

/**
 * @function useBLE
 * @brief Hook pour gérer les opérations Bluetooth
 * @details
 * Fournit :
 * - Le statut de la connexion BLE
 * - L'état du scan
 * - Une fonction pour configurer l'ESP32 via BLE
 * - Une fonction pour récupérer l'IP de l'ESP32 via BLE
 * 
 * @returns {Object} Objet contenant les états et fonctions BLE
 * @returns {string} bleStatus - Message de statut de la connexion BLE
 * @returns {boolean} isScanning - Indique si un scan est en cours
 * @returns {Function} scanAndConfigure - Configure l'ESP32 avec WiFi/GPS
 * @returns {Function} scanAndGetIp - Récupère l'adresse IP de l'ESP32
 */
export const useBLE = () => {
    /**
   * @state {string} bleStatus - Message de statut BLE
   * @default 'En attente...'
   */
  const [bleStatus, setBleStatus] = useState('En attente...');

    /**
   * @state {boolean} isScanning - Indique si un scan BLE est actif
   * @default false
   */
  const [isScanning, setIsScanning] = useState(false);
  
  /**
   * @effect Demande les permissions BLE au démarrage (Android uniquement)
   * @details Permissions requises :
   * - ACCESS_FINE_LOCATION
   * - BLUETOOTH_SCAN
   * - BLUETOOTH_CONNECT
   */
  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
    }
  }, []);

  /**
   * @function scanAndConfigure
   * @brief Scan et configure l'ESP32 avec les identifiants WiFi et GPS
   * @param {string} ssid - SSID du réseau WiFi
   * @param {string} pass - Mot de passe WiFi
   * @param {string} lat - Latitude au format décimal
   * @param {string} lon - Longitude au format décimal
   * @param {Function} onSuccess - Callback appelé après succès de la configuration
   * @details
   * Processus :
   * 1. Scan les appareils BLE (timeout 15s)
   * 2. Connecte à 'ESP32_SmartWindow'
   * 3. Envoie la config au format "ssid;pass;lat;lon"
   * 4. Ferme la connexion
   * 5. Affiche une alerte de succès
   */
  const scanAndConfigure = (
    ssid: string, 
    pass: string, 
    lat: string, 
    lon: string, 
    onSuccess: () => void 
  ) => {
    if (isScanning) return;
    setIsScanning(true);
    setBleStatus('Recherche ESP32...');

    const scanTimeout = setTimeout(() => { 
        if (isScanning) { 
            bleManager.stopDeviceScan(); 
            setIsScanning(false); 
            setBleStatus('Timeout'); 
        } 
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
            const configStr = `${ssid};${pass};${lat};${lon}`;
            return d.writeCharacteristicWithResponseForService(SERVICE_UUID, CHAR_UUID, encode(configStr))
                .then(() => d);
          })
          .then(async (d) => {
            setBleStatus('Config envoyée ! ✅');

            try {
                await d.cancelConnection();
                console.log('Connection closed cleanly');
            } catch (e) {
                console.log('Error closing connection (ignored):', e);
            }

            setIsScanning(false);
            
            Alert.alert(
                "Succès", 
                "L'ESP32 redémarre...",
                [{ text: "OK", onPress: onSuccess }]
            );
          })
          .catch(async (err) => {
             console.error(err);
             setBleStatus('Erreur écriture: ' + err.message);
             setIsScanning(false);
             if (device) {
                 try { await device.cancelConnection(); } catch (e) {}
             }
          });
      }
    });
  };

  /**
   * @function scanAndGetIp
   * @brief Scan et récupère l'adresse IP de l'ESP32 via BLE
   * @param {Function} onFound - Callback appelé avec l'IP trouvée
   * @details
   * Processus :
   * 1. Scan les appareils BLE (timeout 10s)
   * 2. Connecte à 'ESP32_SmartWindow'
   * 3. Lit la caractéristique IP
   * 4. Décode l'IP en Base64
   * 5. Ferme la connexion
   * 6. Appelle le callback avec l'IP
   */
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