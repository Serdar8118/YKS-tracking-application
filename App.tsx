/**
 * YKS Tracking Application
 * Türkiye YKS sınavına hazırlık takip uygulaması
 *
 * @format
 */

import React, {useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useStudyTracker} from './src/hooks/useStudyTracker';
import {DashboardScreen} from './src/screens/DashboardScreen';
import {AddStudyScreen} from './src/screens/AddStudyScreen';
import {HistoryScreen} from './src/screens/HistoryScreen';
import {ProfileScreen} from './src/screens/ProfileScreen';

type Screen = 'dashboard' | 'addStudy' | 'history' | 'profile';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const {
    studyRecords,
    userProfile,
    isLoading,
    addStudyRecord,
    deleteStudyRecord,
    updateUserProfile,
    getTodayStats,
    getWeeklyStats,
  } = useStudyTracker();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return (
          <DashboardScreen
            userProfile={userProfile}
            todayStats={getTodayStats()}
            weeklyStats={getWeeklyStats()}
            onAddStudy={() => setCurrentScreen('addStudy')}
          />
        );
      case 'addStudy':
        return (
          <AddStudyScreen
            targetExam={userProfile.targetExam}
            onAddRecord={addStudyRecord}
            onCancel={() => setCurrentScreen('dashboard')}
          />
        );
      case 'history':
        return (
          <HistoryScreen
            records={studyRecords}
            onDeleteRecord={deleteStudyRecord}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            userProfile={userProfile}
            onUpdateProfile={updateUserProfile}
            onBack={() => setCurrentScreen('dashboard')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {renderScreen()}

      {/* Bottom Navigation */}
      {currentScreen !== 'addStudy' && currentScreen !== 'profile' && (
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[
              styles.navItem,
              currentScreen === 'dashboard' && styles.navItemActive,
            ]}
            onPress={() => setCurrentScreen('dashboard')}>
            <Text style={styles.navIcon}>🏠</Text>
            <Text
              style={[
                styles.navText,
                currentScreen === 'dashboard' && styles.navTextActive,
              ]}>
              Ana Sayfa
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navItem,
              currentScreen === 'history' && styles.navItemActive,
            ]}
            onPress={() => setCurrentScreen('history')}>
            <Text style={styles.navIcon}>📋</Text>
            <Text
              style={[
                styles.navText,
                currentScreen === 'history' && styles.navTextActive,
              ]}>
              Geçmiş
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setCurrentScreen('profile')}>
            <Text style={styles.navIcon}>👤</Text>
            <Text style={styles.navText}>Profil</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navItemActive: {
    backgroundColor: '#f0f0ff',
    borderRadius: 12,
  },
  navIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  navText: {
    fontSize: 12,
    color: '#666',
  },
  navTextActive: {
    color: '#667eea',
    fontWeight: '600',
  },
});

export default App;
