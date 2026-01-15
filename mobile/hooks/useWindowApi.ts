import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

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

export const useWindowApi = (serverIp: string) => {
  const [windowState, setWindowState] = useState<WindowState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
