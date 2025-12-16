import React from 'react';
import { StyleSheet } from 'react-native';
import { Card } from './ui/Card';
import { AppButton } from './ui/AppButton';
import { StatusDisplay } from './dashboard/StatusDisplay';
import { SensorRow } from './dashboard/SensorRow';
import { ControlPanel } from './dashboard/ControlPanel';

export interface WindowState {
  isOpen: boolean;
  temp: number;
  aqi: number;
  targetAngle: number;
  autoMode: boolean;
}

interface DashboardPanelProps {
  windowState: WindowState | null;
  onRefresh: () => void;
  onToggleAuto: (value: boolean) => void;
  onCommand: (action: 'open' | 'close') => void;
  onAngleChange: (angle: number) => void;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({ 
  windowState, 
  onRefresh, 
  onToggleAuto, 
  onCommand, 
  onAngleChange 
}) => {
  
  const isOpen = windowState?.isOpen ?? false;
  const isAuto = windowState?.autoMode ?? true;
  const targetAngle = windowState?.targetAngle ?? 0;

  return (
    <Card style={styles.container}>
      
      <StatusDisplay isOpen={isOpen} />

      <SensorRow 
        temp={windowState?.temp} 
        aqi={windowState?.aqi} 
      />

      <ControlPanel 
        isAuto={isAuto}
        targetAngle={targetAngle}
        onToggleAuto={onToggleAuto}
        onCommand={onCommand}
        onAngleChange={onAngleChange}
      />

      <AppButton 
        title="Actualiser" 
        variant="outline" 
        style={styles.refreshBtn}
        onPress={onRefresh}
      />

    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  refreshBtn: {
    width: '100%', 
    marginTop: 20 
  }
});

export default DashboardPanel;