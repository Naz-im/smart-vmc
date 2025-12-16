import { useState, useCallback } from 'react';
import { Alert } from 'react-native';

export interface WindowState {
  isOpen: boolean;
  temp: number;
  aqi: number;
  targetAngle: number;
  autoMode: boolean;
}

export const useWindowApi = (serverIp: string) => {
  const [windowState, setWindowState] = useState<WindowState | null>(null);
  
  const getBaseUrl = () => `http://${serverIp}:3001`;

  const fetchStatus = useCallback(async () => {
    if (!serverIp) return;
    try {
      const res = await fetch(`${getBaseUrl()}/api/window/status`);
      const data = await res.json();
      setWindowState(data);
    } catch (e) {
      console.log("Erreur API fetchStatus", e);
    }
  }, [serverIp]);

  const sendCommand = useCallback(async (action: 'open' | 'close') => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/window/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
    const angleInt = Math.round(val);
    try {
      const res = await fetch(`${getBaseUrl()}/api/window/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ angle: angleInt, autoMode: false })
      });
      const data = await res.json();
      if (data.success && data.state) setWindowState(data.state);
    } catch (e) {
      console.log(e);
    }
  }, [serverIp]);

  const toggleAutoMode = useCallback(async (value: boolean) => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/window/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autoMode: value })
      });
      const data = await res.json();
      if (data.success && data.state) setWindowState(data.state);
      else fetchStatus();
    } catch (e) {
      Alert.alert("Erreur", "Erreur réseau");
    }
  }, [serverIp, fetchStatus]);

  return { windowState, fetchStatus, sendCommand, sendAngle, toggleAutoMode };
};