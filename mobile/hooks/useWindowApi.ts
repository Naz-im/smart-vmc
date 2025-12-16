import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

export interface WindowApiState {
  isOpen: boolean;
  temp: number;
  aqi: number;
  targetAngle: number;
  autoMode: boolean;
  tMax: number;
  tMin: number;
  aqiMax: number;
  aqiMin: number;
}

export const useWindowApi = (serverIp: string) => {
  const [windowState, setWindowState] = useState<WindowApiState>({
    isOpen: false,
    temp: 0,
    aqi: 0,
    targetAngle: 0,
    autoMode: true,
    tMax: 30,
    tMin: 18,
    aqiMax: 50,
    aqiMin: 20,
  });
  const [isLoading, setLoading] = useState(false);
  
  const getBaseUrl = () => `http://${serverIp}:3001`;

  const fetchStatus = useCallback(async () => {
    if (!serverIp || serverIp === '0.0.0.0') return;
    setLoading(true);
    try {
      const response = await fetch(`${getBaseUrl()}/api/window/status`);
      if (response.ok) {
        const data: WindowApiState = await response.json();
        setWindowState(data);
      }
    } catch (e) {
      console.log("Erreur API fetchStatus", e);
    } finally {
      setLoading(false);
    }
  }, [serverIp]);

  const sendCommand = useCallback(async (action: 'open' | 'close') => {
    if (!serverIp || serverIp === '0.0.0.0') return;
    try {
      const res = await fetch(`${getBaseUrl()}/api/window/control`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ action, autoMode: false })
      });
      const data = await res.json();
      if (data.success && data.state) setWindowState(data.state);
      else fetchStatus();
    } catch (e) {
      Alert.alert("Erreur", "Impossible d'envoyer la commande");
    }
  }, [serverIp, fetchStatus]);

  const sendAngle = useCallback(async (val: number) => {
    if (!serverIp || serverIp === '0.0.0.0') return;
    const angleInt = Math.round(val);
    try {
      const res = await fetch(`${getBaseUrl()}/api/window/control`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ angle: angleInt, autoMode: false })
      });
      const data = await res.json();
      if (data.success && data.state) setWindowState(data.state);
    } catch (e) { console.log(e); }
  }, [serverIp]);

  const toggleAutoMode = useCallback(async (value: boolean) => {
    if (!serverIp || serverIp === '0.0.0.0') return;
    try {
      const res = await fetch(`${getBaseUrl()}/api/window/control`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ autoMode: value })
      });
      const data = await res.json();
      if (data.success && data.state) setWindowState(data.state);
      else fetchStatus();
    } catch (e) {
      Alert.alert("Erreur", "Erreur réseau");
    }
  }, [serverIp, fetchStatus]);
  
  const updateThresholds = useCallback(async (tMax: number, tMin: number, aqiMax: number) => {
    if (!serverIp || serverIp === '0.0.0.0') return;
    setLoading(true);
    
    try {
        const response = await fetch(`http://${serverIp}:3001/api/window/control`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ tMax, tMin, aqiMax }),
        });
        
        if (response.ok) {
            const data = await response.json();
            setWindowState(prev => ({
                ...prev,
                ...data.state,
            }));
            Alert.alert("Succès", "Seuils mis à jour avec succès. La nouvelle logique est appliquée.");
        } else {
            Alert.alert("Erreur", `Impossible d'appliquer les seuils : ${response.status}`);
        }
    } catch (e) {
        Alert.alert("Erreur de connexion", "Impossible de joindre l'ESP32. Vérifiez l'adresse IP.");
    } finally {
        setLoading(false);
    }
  }, [serverIp]);


  return { windowState, fetchStatus, sendCommand, sendAngle, toggleAutoMode, updateThresholds, isLoading };
};