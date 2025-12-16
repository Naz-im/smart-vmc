import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { AppButton } from '../ui/AppButton';

interface StatusDisplayProps {
  isOpen: boolean;
  onRefresh: () => void;
}

export const StatusDisplay: React.FC<StatusDisplayProps> = ({ isOpen, onRefresh }) => {
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
      <AppButton
        title="Actualiser l'état"
        onPress={onRefresh}
        variant="secondary"
        style={styles.refreshButton}
      />
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
  },
  refreshButton: {
    marginTop: 15,
  }
});