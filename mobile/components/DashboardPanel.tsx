/**
 * @file DashboardPanel.tsx
 * @brief Tableau de bord affichant l’état, les capteurs et les commandes de la VMC
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { Card } from './ui/Card';
import { StatusDisplay } from './dashboard/StatusDisplay'; 
import { SensorRow } from './dashboard/SensorRow'; 
import { ControlPanel } from './dashboard/ControlPanel'; 
import { WindowState } from '../hooks/useWindowApi';
import NotificationService from '../services/NotificationService';

/**
 * @interface DashboardPanelProps
 * @brief Propriétés du tableau de bord
 * @property {WindowState|null} windowState - État courant de la VMC
 * @property {(value:boolean)=>void} onToggleAuto - Toggle du mode auto
 * @property {(action:'open'|'close')=>void} onCommand - Commande ouvrir/fermer
 * @property {(val:number)=>void} onAngleChange - Définir l’angle cible
 * @property {()=>void} onResetSafety - Réarmer le verrouillage de sécurité
 */
interface DashboardPanelProps {
  windowState: WindowState | null;
  onToggleAuto: (value: boolean) => void;
  onCommand: (action: 'open' | 'close') => void;
  onAngleChange: (val: number) => void;
  onResetSafety: () => void; // Nouveau prop
}

/**
 * @function DashboardPanel
 * @brief Affiche l’état, les capteurs et les commandes de la VMC
 * @param {DashboardPanelProps} props - Propriétés du composant
 * @returns {React.JSX.Element} Vue tableau de bord
 */
const DashboardPanel: React.FC<DashboardPanelProps> = ({ 
  windowState, 
  onToggleAuto, 
  onCommand, 
  onAngleChange,
  onResetSafety
}) => {
  
  const prevIsOpenRef = useRef<boolean | null>(null);

  useEffect(() => {
    NotificationService.requestPermission();
  }, []);

  useEffect(() => {
    if (!windowState) return;

    const currentIsOpen = windowState.isOpen;
    const prevIsOpen = prevIsOpenRef.current;

    if (prevIsOpen === null) {
      prevIsOpenRef.current = currentIsOpen;
      return;
    }

    if (prevIsOpen !== currentIsOpen) {
      if (currentIsOpen) {
        NotificationService.displayNotification(
          'VMC Ouverte 🌬️',
          `La VMC s'est ouverte (Temp: ${windowState.temp}°C)`
        );
      } else {
        NotificationService.displayNotification(
          'VMC Fermée 🔒',
          'La VMC est maintenant fermée.'
        );
      }
    }

    prevIsOpenRef.current = currentIsOpen;

  }, [windowState?.isOpen]);

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
