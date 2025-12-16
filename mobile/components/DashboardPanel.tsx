import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from './ui/Card';
import { AppButton } from './ui/AppButton';
import { StatusDisplay } from './dashboard/StatusDisplay'; 
import { SensorRow } from './dashboard/SensorRow'; 
import { ControlPanel } from './dashboard/ControlPanel'; 
import { WindowState } from '../hooks/useWindowApi';

interface DashboardPanelProps {
  windowState: WindowState | null;
  onToggleAuto: (value: boolean) => void;
  onCommand: (action: 'open' | 'close') => void;
  onAngleChange: (val: number) => void;
}

const DashboardPanel: React.FC<DashboardPanelProps> = ({ 
  windowState, 
  onToggleAuto, 
  onCommand, 
  onAngleChange,
}) => {
  

  return (
    <View> 
      
      <Card style={styles.container}>
        <StatusDisplay isOpen={windowState?.isOpen ?? false} />
        
        <SensorRow 
            temp={windowState?.temp} 
            aqi={windowState?.aqi} 
        />

        <ControlPanel 
            isAuto={windowState?.autoMode ?? true}
            targetAngle={windowState?.targetAngle ?? 0}
            onToggleAuto={onToggleAuto}
            onCommand={onCommand}
            onAngleChange={onAngleChange}
        />
        
        {/* Le bouton Actualiser si tu veux le garder ici ou le mettre dans la TopBar */}
      </Card>

      {/* LA CARD DE CONFIGURATION A DISPARU D'ICI 🎉 */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});

export default DashboardPanel;