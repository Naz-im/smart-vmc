import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Alert, ActivityIndicator, View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useBLE } from './hooks/useBLE';
import { useWindowApi } from './hooks/useWindowApi';
import TabHeader from './components/TabHeader';
import SetupPanel from './components/SetupPanel';
import DashboardPanel from './components/DashboardPanel';
import ConfigurationPanel from './components/ConfigurationPanel';

function App(): React.JSX.Element {
  
  const [tab, setTab] = useState<'SETUP' | 'DASHBOARD' | 'CONFIGURATION'>('SETUP');
  const [serverIp, setServerIp] = useState('0.0.0.0');
  
  const [isAutoConnecting, setIsAutoConnecting] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('server_ip').then(val => {
        if(val) setServerIp(val);
    });
  }, []);

  const handleIpChange = (newIp: string) => {
      setServerIp(newIp);
      AsyncStorage.setItem('server_ip', newIp);
  };

  const { bleStatus, isScanning, scanAndConfigure, scanAndGetIp } = useBLE();
  const { 
    windowState, 
    fetchStatus, 
    sendCommand, 
    sendAngle, 
    toggleAutoMode, 
    resetSafety,
    updateThresholds, 
    isLoading 
} = useWindowApi(serverIp);

  useEffect(() => { 
    if (tab === 'DASHBOARD') fetchStatus();
  }, [tab, fetchStatus]);

  const handleConnect = (
    ssid: string, 
    pass: string, 
    lat: string, 
    lon: string, 
  ) => {

    scanAndConfigure(ssid, pass, lat, lon, () => {
        
        setIsAutoConnecting(true);
        
        setTimeout(() => {
            
            scanAndGetIp((detectedIp) => {
                setIsAutoConnecting(false);
                
                if (detectedIp && detectedIp !== "0.0.0.0") {
                    handleIpChange(detectedIp);
                    Alert.alert("Succès", "L'ESP32 est connecté ! Passage au tableau de bord.");
                    setTab('DASHBOARD');
                    fetchStatus();
                } else {
                    Alert.alert("Attention", "L'ESP32 a redémarré mais n'a pas donné d'IP valide. Vérifiez le mot de passe WiFi.");
                }
            });
            
        }, 5000);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007A5E" />
      <TabHeader activeTab={tab} onTabChange={setTab} />
      

      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'SETUP' && (
            <SetupPanel 
                bleStatus={isAutoConnecting ? "Connexion WiFi en cours..." : bleStatus}
                isScanning={isScanning || isAutoConnecting}
                onConnect={handleConnect}
                savedIp={serverIp}
            />
        )}

        {tab === 'DASHBOARD' && (
          <DashboardPanel 
            windowState={windowState}
            onToggleAuto={toggleAutoMode}
            onCommand={sendCommand}
            onAngleChange={sendAngle}
            onResetSafety={resetSafety}
          />
        )}

        {tab === 'CONFIGURATION' && (
            <ConfigurationPanel 
                windowState={windowState}
                onUpdateThresholds={updateThresholds}
                isLoading={isLoading}
            />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  content: { padding: 20 },
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  loadingText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginTop: 20 },
  loadingSubText: { color: '#ccc', fontSize: 14, marginTop: 5 }
});

export default App;
