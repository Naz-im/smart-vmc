import React from 'react';
import { render } from '@testing-library/react-native';
import { StatusDisplay } from '../components/dashboard/StatusDisplay';

describe('Composant StatusDisplay', () => {
  
  test('Affiche "OUVERTE" quand isOpen est vrai', () => {
    const { getByText } = render(<StatusDisplay isOpen={true} />);
    expect(getByText('OUVERTE')).toBeTruthy();
  });

  test('Affiche "FERMÉE" quand isOpen est faux', () => {
    const { getByText } = render(<StatusDisplay isOpen={false} />);
    expect(getByText('FERMÉE')).toBeTruthy();
  });

  test('Affiche "SÉCURITÉ ACTIVE" en rouge quand isLocked est vrai', () => {
    // On simule le cas critique défini dans l'exigence 07
    const { getByText } = render(<StatusDisplay isOpen={false} isLocked={true} />);
    
    // On vérifie que le message d'alerte est présent
    expect(getByText('SÉCURITÉ ACTIVE')).toBeTruthy();
    expect(getByText('Moteur bloqué')).toBeTruthy();
  });
});
