import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // <--- Import Storage

import { useBLE } from './hooks/useBLE';
import { useWindowApi } from './hooks/useWindowApi';
import TabHeader from './components/TabHeader';
import SetupPanel from './components/SetupPanel';
import DashboardPanel from './components/DashboardPanel';

function App(): React.JSX.Element {
  const [tab, setTab] = useState<'SETUP' | 'DASHBOARD'>('SETUP');
  const [serverIp, setServerIp] = useState('192.168.1.50');

  useEffect(() => {
    AsyncStorage.getItem('server_ip').then(val => {
        if(val) setServerIp(val);
    });
  }, []);

  const handleIpChange = (newIp: string) => {
      setServerIp(newIp);
      AsyncStorage.setItem('server_ip', newIp);
  };

  const { bleStatus, isScanning, scanAndConfigure } = useBLE();
  const { windowState, fetchStatus, sendCommand, sendAngle, toggleAutoMode } = useWindowApi(serverIp);

  useEffect(() => { 
    if (tab === 'DASHBOARD') fetchStatus();
  }, [tab, fetchStatus]);

  const handleConnect = (ssid: string, pass: string, lat: string, lon: string, ip: string) => {
    handleIpChange(ip);
    
    scanAndConfigure(ssid, pass, lat, lon, ip, () => {
        setTab('DASHBOARD');
        fetchStatus();
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#007A5E" />
      <TabHeader activeTab={tab} onTabChange={setTab} />
      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'SETUP' && (
            <SetupPanel 
                bleStatus={bleStatus}
                isScanning={isScanning}
                onConnect={handleConnect}
                savedIp={serverIp}
            />
        )}
        {tab === 'DASHBOARD' && (
            <DashboardPanel 
                windowState={windowState}
                onRefresh={fetchStatus}
                onToggleAuto={toggleAutoMode}
                onCommand={sendCommand}
                onAngleChange={sendAngle}
            />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  content: { padding: 20 },
});
export default App;