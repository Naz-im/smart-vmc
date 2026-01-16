/**
 * @file ControlPanel.tsx
 * @brief Panneau de contrôle de la VMC (mode auto, commandes manuelles, slider)
 */
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { AppButton } from '../ui/AppButton';

/**
 * @interface ControlPanelProps
 * @brief Propriétés du panneau de contrôle
 * @property {boolean} isAuto - Mode automatique activé
 * @property {boolean} [isLocked] - Verrouillage de sécurité actif
 * @property {number} targetAngle - Angle cible du servomoteur
 * @property {(value:boolean)=>void} onToggleAuto - Callback de basculement auto/manuel
 * @property {(action:'open'|'close')=>void} onCommand - Callback de commande ouvrir/fermer
 * @property {(angle:number)=>void} onAngleChange - Callback de changement d'angle
 * @property {()=>void} onResetSafety - Callback de réarmement de la sécurité
 */
interface ControlPanelProps {
  isAuto: boolean;
  isLocked?: boolean; // Nouveau prop
  targetAngle: number;
  onToggleAuto: (value: boolean) => void;
  onCommand: (action: 'open' | 'close') => void;
  onAngleChange: (angle: number) => void;
  onResetSafety: () => void; // Nouvelle action
}

/**
 * @function ControlPanel
 * @brief Panneau de contrôle principal de la VMC
 * @param {ControlPanelProps} props - Propriétés du composant
 * @returns {React.JSX.Element} Panneau de contrôle
 * @details
 * Affiche deux modes :
 * - Mode verrouillé : Bouton de réarmement sécurité
 * - Mode normal : Switch auto/manuel, boutons ouvrir/fermer, slider d'angle
 */
export const ControlPanel: React.FC<ControlPanelProps> = ({
  isAuto,
  isLocked,
  targetAngle,
  onToggleAuto,
  onCommand,
  onAngleChange,
  onResetSafety
}) => {

  /**
   * @section Cas critique : Système verrouillé
   * @brief Affiche uniquement le bouton de réarmement
   */
  if (isLocked) {
    return (
        <View style={[styles.container, { borderColor: '#DC2626', borderWidth: 2 }]}>
            <Text style={[styles.label, {color: '#DC2626', marginBottom: 10}]}>
                SYSTÈME VERROUILLÉ
            </Text>
            <Text style={styles.hintText}>
                Une surintensité a été détectée. Vérifiez que rien ne bloque le clapet avant de réarmer.
            </Text>
            <AppButton 
                title="DÉBLOQUER / RÉARMER" 
                variant="danger" 
                onPress={onResetSafety}
                style={{marginTop: 15}}
            />
        </View>
    );
  }

  /**
   * @section Cas normal : Contrôles standard
   * @brief Affiche switch auto, boutons et slider
   */
  return (
    <View style={styles.container}>
      <View style={styles.switchRow}>
        <Text style={styles.label}>Mode Automatique</Text>
        <Switch 
          value={isAuto} 
          onValueChange={onToggleAuto}
          trackColor={{ false: "#D1D5DB", true: "#007A5E" }}    
          thumbColor={isAuto ? "#FFFFFF" : "#f4f3f4"}
          ios_backgroundColor="#D1D5DB"
        />
      </View>

      {!isAuto ? (
        <>
          <View style={styles.btnRow}>
            <AppButton 
              title="OUVRIR" 
              variant="primary" 
              style={{flex: 1}} 
              onPress={() => onCommand('open')} 
            />
            <AppButton 
              title="FERMER" 
              variant="danger" 
              style={{flex: 1}} 
              onPress={() => onCommand('close')} 
            />
          </View>

          <View style={styles.sliderContainer}>
            <Text style={styles.label}>Ouverture : {targetAngle}°</Text>
            <Slider
              style={{width: '100%', height: 40}}
              minimumValue={0}
              maximumValue={90}
              step={1}
              value={targetAngle}
              onSlidingComplete={onAngleChange}
              minimumTrackTintColor="#007A5E"
              maximumTrackTintColor="#D1D5DB"
              thumbTintColor="#007A5E"
            />
          </View>
        </>
      ) : (
        <Text style={styles.hintText}>
          Désactivez le mode auto pour contrôler manuellement.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    padding: 20,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  sliderContainer: {
    width: '100%',
    marginVertical: 10,
  },
  hintText: {
    fontStyle: 'italic',
    color: '#9CA3AF',
    marginTop: 8,
    fontSize: 13,
    textAlign: 'center',
  },
});
