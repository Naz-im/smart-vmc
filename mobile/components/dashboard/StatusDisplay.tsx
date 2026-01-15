import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StatusDisplayProps {
  isOpen: boolean;
  isLocked?: boolean;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ isOpen, isLocked }) => {
  
  if (isLocked) {
    return (
      <View style={styles.container}>
        <Text style={styles.emoji}>⚠️</Text>
        <Text style={[styles.text, { color: '#DC2626' }]}>
          SÉCURITÉ ACTIVE
        </Text>
        <Text style={styles.subtext}>Moteur bloqué</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>
        {isOpen ? '💨' : '🚫'}
      </Text>
      <Text style={[
        styles.text, 
        { color: isOpen ? '#007A5E' : '#EF4444' }
      ]}>
        {isOpen ? 'OUVERTE' : 'FERMÉE'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 10,
  },
  text: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  }
});
