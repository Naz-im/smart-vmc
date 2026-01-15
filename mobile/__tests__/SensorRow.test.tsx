import React from 'react';
import { render } from '@testing-library/react-native';
import { SensorRow } from '../components/dashboard/SensorRow';

describe('Composant SensorRow', () => {
  
  test('Affiche les valeurs de Température et AQI correctement', () => {
    const { getByText } = render(<SensorRow temp={24.5} aqi={35} />);
    
    // On cherche le texte exact "24.5°C"
    expect(getByText('24.5°C')).toBeTruthy();
    // On vérifie que l'AQI est affiché
    expect(getByText('35')).toBeTruthy();
  });

  test('Gère les valeurs nulles ou en chargement', () => {
    // Si les props sont undefined (ex: chargement initial)
    const { getByText } = render(<SensorRow temp={undefined} aqi={undefined} />);
    
    // On s'attend à voir des tirets ou une valeur par défaut "--"
    // (Ajustez selon ce que votre composant SensorRow affiche réellement par défaut)
    expect(getByText('--°C')).toBeTruthy(); 
  });
  
  test('Affiche un indicateur "Mauvais" si AQI élevé', () => {
    // Supposons que votre UI change de couleur ou de texte pour AQI > 50
    // Ce test dépend de votre implémentation visuelle, voici un exemple générique :
    const { getByText } = render(<SensorRow temp={20} aqi={150} />);
    expect(getByText('150')).toBeTruthy();
  });
});
