import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TabHeaderProps {
  activeTab: 'SETUP' | 'DASHBOARD';
  onTabChange: (tab: 'SETUP' | 'DASHBOARD') => void;
}

const TabHeader: React.FC<TabHeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>𖣘 Smart VMC</Text>
      <View style={styles.tabs}>
        <TouchableOpacity 
          onPress={() => onTabChange('SETUP')} 
          style={[styles.tab, activeTab === 'SETUP' && styles.activeTab]}
        >
          <Text style={styles.tabText}>📡 Setup</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => onTabChange('DASHBOARD')} 
          style={[styles.tab, activeTab === 'DASHBOARD' && styles.activeTab]}
        >
          <Text style={styles.tabText}>📊 Contrôle</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#007A5E', 
    paddingTop: 50, 
    paddingBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    zIndex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    width: '90%',
    justifyContent: 'space-between',
    paddingBottom: 5,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
});

export default TabHeader;