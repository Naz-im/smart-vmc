/**
 * @file useWindowApi.ts
 * @brief Hook React pour communiquer avec l'API smart-vmc 
 * @details Fournit les appels REST pour lire l'état et piloter la VMC (ouverture, mode auto, seuils, sécurité).
 */

import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
/**
 * @interface WindowState
 * @brief État de la fenêtre côté mobile
 * @property {boolean} isOpen - Fenêtre ouverte (angle > 0)
 * @property {number} temp - Dernière température lue
 * @property {number} aqi - Dernier indice de qualité de l'air
 * @property {number} targetAngle - Angle cible (0-90)
 * @property {boolean} autoMode - Mode automatique actif
 * @property {boolean} safetyLockout - Verrouillage de sécurité actif
 * @property {number} currentLoad - Dernière lecture du capteur de courant
 * @property {number} tMax - Seuil température max
 * @property {number} tMin - Seuil température min
 * @property {number} aqiMax - Seuil AQI max
 */

export interface WindowState {
  isOpen: boolean;
  temp: number;
  aqi: number;
  targetAngle: number;
  autoMode: boolean;
  // Nouveaux champs sécurité
  safetyLockout: boolean;
  currentLoad: number;
  tMax: number;
  tMin: number;
  aqiMax: number;
}

/**
 * @function useWindowApi
 * @brief Hook pour appeler l'API HTTP de l'ESP32
 * @param {string} serverIp - Adresse IP de l'ESP32 (ex: "192.168.1.50")
 * @returns {object} API du hook
 * @returns {WindowState|null} return.windowState - Dernier état connu
 * @returns {() => Promise<void>} return.fetchStatus - Récupère l'état courant
 * @returns {(action:'open'|'close') => Promise<void>} return.sendCommand - Ouvre/ferme
 * @returns {(angle:number) => Promise<void>} return.sendAngle - Définit un angle précis
 * @returns {(value:boolean) => Promise<void>} return.toggleAutoMode - Active/désactive le mode auto
 * @returns {() => Promise<void>} return.resetSafety - Réarme la sécurité
 * @returns {(tMax:number,tMin:number,aqiMax:number)=>Promise<void>} return.updateThresholds - Met à jour les seuils
 * @returns {boolean} return.isLoading - Indique si une requête de seuils est en cours
 */
export const useWindowApi = (serverIp: string) => {
  /**
   * @state windowState
   * @brief Dernier état de la fenêtre remonté par l'API
   * @default null
   */  
  const [windowState, setWindowState] = useState<WindowState | null>(null);
    
  /**
   * @state isLoading
   * @brief Indique si une requête (seuils) est en cours
   * @default false
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * @function fetchStatus
   * @brief Récupère l'état de la VMC via GET /api/window/status
   */
  const fetchStatus = useCallback(async () => {
    if (!serverIp || serverIp === '0.0.0.0') return;
    try {
        const response = await fetch(`http://${serverIp}:3001/api/window/status`);
        const json = await response.json();
        setWindowState(json);
    } catch (error) {
        console.log('Erreur fetch status:', error);
    }
  }, [serverIp]);

  /**
   * @function sendCommand
   * @brief Envoie une commande d'ouverture/fermeture
   * @param {'open'|'close'} action - Action demandée
   */
  const sendCommand = async (action: 'open' | 'close') => {
      try {
          const response = await fetch(`http://${serverIp}:3001/api/window/control`, {
              method: 'POST',
              body: JSON.stringify({ action })
          });
          const json = await response.json();
          setWindowState(json.state || json);
      } catch (e) {
          Alert.alert("Erreur", "Impossible d'envoyer la commande");
      }
  };
  /**
   * @function sendAngle
   * @brief Positionne la fenêtre à un angle précis
   * @param {number} angle - Angle cible (0-90)
   */
  const sendAngle = async (angle: number) => {
      try {
          const response = await fetch(`http://${serverIp}:3001/api/window/control`, {
              method: 'POST',
              body: JSON.stringify({ angle })
          });
          const json = await response.json();
          setWindowState(json.state || json);
      } catch (e) {
          console.log(e);
      }
  };

  /**
   * @function toggleAutoMode
   * @brief Active/désactive le mode automatique
   * @param {boolean} value - true pour activer
   */
  const toggleAutoMode = async (value: boolean) => {
      try {
          const response = await fetch(`http://${serverIp}:3001/api/window/control`, {
              method: 'POST',
              body: JSON.stringify({ autoMode: value })
          });
          const json = await response.json();
          setWindowState(json.state || json);
      } catch (e) {
          Alert.alert("Erreur", "Impossible de changer le mode");
      }
  };

  /**
   * @function resetSafety
   * @brief Réarme le verrouillage de sécurité
   */
  const resetSafety = async () => {
    try {
        const response = await fetch(`http://${serverIp}:3001/api/window/control`, {
            method: 'POST',
            body: JSON.stringify({ resetSafety: true })
        });
        const json = await response.json();
        setWindowState(json.state || json);
        Alert.alert("Info", "Système réarmé. Vérifiez qu'il n'y a plus d'obstruction.");
    } catch (e) {
        Alert.alert("Erreur", "Impossible de réarmer");
    }
  };

  /**
   * @function updateThresholds
   * @brief Met à jour les seuils température/AQI
   * @param {number} tMax - Seuil max
   * @param {number} tMin - Seuil min
   * @param {number} aqiMax - Seuil AQI max
   */
  const updateThresholds = async (tMax: number, tMin: number, aqiMax: number) => {
      setIsLoading(true);
      try {
          const response = await fetch(`http://${serverIp}:3001/api/window/control`, {
              method: 'POST',
              body: JSON.stringify({ tMax, tMin, aqiMax })
          });
          const json = await response.json();
          setWindowState(json.state || json);
          Alert.alert("Succès", "Paramètres sauvegardés !");
      } catch (e) {
          Alert.alert("Erreur", "Echec sauvegarde");
      } finally {
          setIsLoading(false);
      }
  };

  return { 
    windowState, 
    fetchStatus, 
    sendCommand, 
    sendAngle, 
    toggleAutoMode,
    resetSafety,
    updateThresholds,
    isLoading 
  };
};
