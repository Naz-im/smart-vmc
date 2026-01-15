import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ControlPanel } from '../components/dashboard/ControlPanel';

describe('Composant ControlPanel', () => {
  
  test('Affiche le bouton de DÉBLOCAGE en mode sécurité', () => {
    const mockReset = jest.fn();
    
    const { getByText } = render(
      <ControlPanel 
        isAuto={false} 
        targetAngle={0} 
        isLocked={true} // Simulation du blocage
        onToggleAuto={() => {}} 
        onCommand={() => {}} 
        onAngleChange={() => {}}
        onResetSafety={mockReset} 
      />
    );

    // Vérifie que le bouton d'urgence est là
    const btn = getByText('DÉBLOQUER / RÉARMER');
    expect(btn).toBeTruthy();

    // Vérifie qu'on peut cliquer dessus
    fireEvent.press(btn);
    expect(mockReset).toHaveBeenCalledTimes(1);
  });

  test('Affiche les contrôles standards quand tout va bien', () => {
    const { getByText } = render(
      <ControlPanel 
        isAuto={false} 
        isLocked={false} 
        targetAngle={0} 
        onToggleAuto={() => {}} 
        onCommand={() => {}} 
        onAngleChange={() => {}}
        onResetSafety={() => {}} 
      />
    );
    
    expect(getByText('OUVRIR')).toBeTruthy();
  });
});
