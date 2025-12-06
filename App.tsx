/**
 * YKS Tracking Application
 * Türkiye YKS sınavına hazırlık takip uygulaması
 *
 * @format
 */

import React, {useState, useEffect, useRef} from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Animated,
} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useStudyTracker} from './src/hooks/useStudyTracker';
import {useAuth} from './src/hooks/useAuth';
import {useAISchedule} from './src/hooks/useAISchedule';
import {DashboardScreen} from './src/screens/DashboardScreen';
import {AddStudyScreen} from './src/screens/AddStudyScreen';
import {HistoryScreen} from './src/screens/HistoryScreen';
import {ProfileScreen} from './src/screens/ProfileScreen';
import {AuthScreen} from './src/screens/AuthScreen';
import {AIScheduleScreen} from './src/screens/AIScheduleScreen';
import {LeaderboardScreen} from './src/screens/LeaderboardScreen';
import {AchievementsScreen} from './src/screens/AchievementsScreen';

type Screen =
  | 'auth'
  | 'dashboard'
  | 'addStudy'
  | 'history'
  | 'profile'
  | 'aiSchedule'
  | 'leaderboard'
  | 'achievements';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#667eea" />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');

  // Hooks
  const {
    studyRecords,
    userProfile,
    isLoading: studyLoading,
    addStudyRecord,
    deleteStudyRecord,
    updateUserProfile,
    getTodayStats,
    getWeeklyStats,
  } = useStudyTracker();

  const {
    userAccount,
    isLoggedIn,
    isLoading: authLoading,
    register,
    login,
    logout,
    addPoints,
    checkAchievements,
    getLeaderboard,
  } = useAuth();

  const {
    currentSchedule,
    isGenerating,
    loadSchedule,
    generateSchedule,
    markSessionCompleted,
  } = useAISchedule();

  // Animation values for nav
  const navAnims = useRef([
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
    new Animated.Value(1),
  ]).current;

  // Load schedule on mount
  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  // Navigate to dashboard when logged in
  useEffect(() => {
    if (isLoggedIn && currentScreen === 'auth') {
      setCurrentScreen('dashboard');
    } else if (!isLoggedIn && !authLoading) {
      setCurrentScreen('auth');
    }
  }, [isLoggedIn, authLoading, currentScreen]);

  // Check achievements when stats change
  useEffect(() => {
    if (userAccount && studyRecords.length > 0) {
      const todayStats = getTodayStats();
      const totalStudyTime = studyRecords.reduce((sum, r) => sum + r.studyDuration, 0);
      const totalQuestions = userProfile.totalQuestionsCompleted;
      const accuracy = todayStats.totalQuestions > 0
        ? (todayStats.totalCorrect / todayStats.totalQuestions) * 100
        : 0;

      checkAchievements({
        totalQuestions,
        streak: userProfile.currentStreak,
        accuracy,
        totalStudyTime,
      });
    }
  }, [studyRecords, userAccount, userProfile, getTodayStats, checkAchievements]);

  // Handle adding study record with points
  const handleAddStudyRecord = (record: Parameters<typeof addStudyRecord>[0]) => {
    const newRecord = addStudyRecord(record);
    // Add points: 1 point per question + bonus for correct answers
    const pointsEarned = record.questionsCompleted + Math.floor(record.correctAnswers * 0.5);
    addPoints(pointsEarned);
    return newRecord;
  };

  // Nav animation
  const animateNav = (index: number) => {
    Animated.sequence([
      Animated.timing(navAnims[index], {
        toValue: 0.8,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(navAnims[index], {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (authLoading || studyLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Yükleniyor...</Text>
      </View>
    );
  }

  // Show auth screen if not logged in
  if (!isLoggedIn) {
    return <AuthScreen onLogin={login} onRegister={register} />;
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
            onAddRecord={handleAddStudyRecord}
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
      case 'aiSchedule':
        return (
          <AIScheduleScreen
            currentSchedule={currentSchedule}
            isGenerating={isGenerating}
            examType={userProfile.targetExam}
            userId={userAccount?.id || ''}
            onGenerateSchedule={generateSchedule}
            onMarkCompleted={markSessionCompleted}
            onBack={() => setCurrentScreen('dashboard')}
          />
        );
      case 'leaderboard':
        return (
          <LeaderboardScreen
            entries={getLeaderboard()}
            onBack={() => setCurrentScreen('dashboard')}
          />
        );
      case 'achievements':
        return (
          <AchievementsScreen
            unlockedAchievements={userAccount?.achievements || []}
            points={userAccount?.points || 0}
            level={userAccount?.level || 1}
            onBack={() => setCurrentScreen('dashboard')}
          />
        );
      default:
        return null;
    }
  };

  const showBottomNav = !['addStudy', 'profile', 'aiSchedule', 'leaderboard', 'achievements'].includes(currentScreen);

  return (
    <View style={styles.container}>
      {renderScreen()}

      {/* Bottom Navigation */}
      {showBottomNav && (
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={[
              styles.navItem,
              currentScreen === 'dashboard' && styles.navItemActive,
            ]}
            onPress={() => {
              animateNav(0);
              setCurrentScreen('dashboard');
            }}>
            <Animated.Text
              style={[styles.navIcon, {transform: [{scale: navAnims[0]}]}]}>
              🏠
            </Animated.Text>
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
              currentScreen === 'aiSchedule' && styles.navItemActive,
            ]}
            onPress={() => {
              animateNav(1);
              setCurrentScreen('aiSchedule');
            }}>
            <Animated.Text
              style={[styles.navIcon, {transform: [{scale: navAnims[1]}]}]}>
              🤖
            </Animated.Text>
            <Text style={styles.navText}>AI Program</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.navItem,
              currentScreen === 'history' && styles.navItemActive,
            ]}
            onPress={() => {
              animateNav(2);
              setCurrentScreen('history');
            }}>
            <Animated.Text
              style={[styles.navIcon, {transform: [{scale: navAnims[2]}]}]}>
              📋
            </Animated.Text>
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
            onPress={() => {
              animateNav(3);
              setCurrentScreen('leaderboard');
            }}>
            <Animated.Text
              style={[styles.navIcon, {transform: [{scale: navAnims[3]}]}]}>
              🏆
            </Animated.Text>
            <Text style={styles.navText}>Sıralama</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            onPress={() => {
              animateNav(4);
              setCurrentScreen('achievements');
            }}>
            <Animated.Text
              style={[styles.navIcon, {transform: [{scale: navAnims[4]}]}]}>
              🏅
            </Animated.Text>
            <Text style={styles.navText}>Rozetler</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Profile Button */}
      {showBottomNav && (
        <TouchableOpacity
          style={styles.profileFab}
          onPress={() => setCurrentScreen('profile')}>
          <Text style={styles.profileFabText}>
            {userAccount?.username?.charAt(0).toUpperCase() || '👤'}
          </Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>{userAccount?.level || 1}</Text>
          </View>
        </TouchableOpacity>
      )}

      {/* Logout Button (in profile) */}
      {currentScreen === 'profile' && (
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>🚪 Çıkış Yap</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 8,
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
    fontSize: 22,
    marginBottom: 2,
  },
  navText: {
    fontSize: 10,
    color: '#666',
  },
  navTextActive: {
    color: '#667eea',
    fontWeight: '600',
  },
  profileFab: {
    position: 'absolute',
    top: 50,
    right: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#667eea',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  profileFabText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  levelBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  levelBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
  logoutButton: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: '#dc3545',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
