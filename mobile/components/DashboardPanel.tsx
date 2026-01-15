import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from './ui/Card';
import { StatusDisplay } from './dashboard/StatusDisplay'; 
import { SensorRow } from './dashboard/SensorRow'; 
import { ControlPanel } from './dashboard/ControlPanel'; 
import { WindowState } from '../hooks/useWindowApi';

interface DashboardPanelProps {
  windowState: WindowState | null;
  onToggleAuto: (value: boolean) => void;
  onCommand: (action: 'open' | 'close') => void;
  onAngleChange: (val: number) => void;
  onResetSafety: () => void; // Nouveau prop
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({ 
  windowState, 
  onToggleAuto, 
  onCommand, 
  onAngleChange,
  onResetSafety
}) => {
  
  return (
    <View> 
      <Card style={styles.container}>
        <StatusDisplay 
            isOpen={windowState?.isOpen ?? false} 
            isLocked={windowState?.safetyLockout} // Transmission du lock
        />
        
        <SensorRow 
            temp={windowState?.temp} 
            aqi={windowState?.aqi} 
        />

        <ControlPanel 
            isAuto={windowState?.autoMode ?? true}
            isLocked={windowState?.safetyLockout} // Transmission du lock
            targetAngle={windowState?.targetAngle ?? 0}
            onToggleAuto={onToggleAuto}
            onCommand={onCommand}
            onAngleChange={onAngleChange}
            onResetSafety={onResetSafety}
        />
        
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default DashboardPanel;
