import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {UserProfile, WeeklyStats, MOTIVATION_MESSAGES} from '../types';

interface DashboardScreenProps {
  userProfile: UserProfile;
  todayStats: {
    totalQuestions: number;
    totalCorrect: number;
    totalWrong: number;
    totalEmpty: number;
    totalStudyTime: number;
    recordCount: number;
  };
  weeklyStats: WeeklyStats;
  onAddStudy: () => void;
}

export function DashboardScreen({
  userProfile,
  todayStats,
  weeklyStats,
  onAddStudy,
}: DashboardScreenProps) {
  const dailyProgress =
    userProfile.dailyGoal > 0
      ? Math.min(100, (todayStats.totalQuestions / userProfile.dailyGoal) * 100)
      : 0;

  const todayAccuracy =
    todayStats.totalQuestions > 0
      ? ((todayStats.totalCorrect / todayStats.totalQuestions) * 100).toFixed(1)
      : '0';

  const weeklyAccuracy =
    weeklyStats.totalQuestions > 0
      ? ((weeklyStats.totalCorrect / weeklyStats.totalQuestions) * 100).toFixed(
          1,
        )
      : '0';

  const formatStudyTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}s ${mins}dk`;
    }
    return `${mins}dk`;
  };

  const motivationMessage =
    MOTIVATION_MESSAGES[Math.floor(Math.random() * MOTIVATION_MESSAGES.length)];

  const getDaysUntilExam = () => {
    if (!userProfile.examDate) {
      return null;
    }
    const examDate = new Date(userProfile.examDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const diffTime = examDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysUntilExam = getDaysUntilExam();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Merhaba, {userProfile.name}! 👋</Text>
        <Text style={styles.motivation}>{motivationMessage}</Text>
      </View>

      {/* Quick Stats Row */}
      <View style={styles.quickStatsRow}>
        <View style={styles.quickStatCard}>
          <Text style={styles.quickStatNumber}>🔥 {userProfile.currentStreak}</Text>
          <Text style={styles.quickStatLabel}>Gün Serisi</Text>
        </View>
        {daysUntilExam !== null && (
          <View style={[styles.quickStatCard, styles.examCard]}>
            <Text style={styles.quickStatNumber}>{daysUntilExam}</Text>
            <Text style={styles.quickStatLabel}>Gün Kaldı</Text>
          </View>
        )}
        <View style={styles.quickStatCard}>
          <Text style={styles.quickStatNumber}>
            {userProfile.totalQuestionsCompleted.toLocaleString('tr-TR')}
          </Text>
          <Text style={styles.quickStatLabel}>Toplam Soru</Text>
        </View>
      </View>

      {/* Daily Progress */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>🎯 Günlük Hedef</Text>
          <Text style={styles.progressPercent}>{dailyProgress.toFixed(0)}%</Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, {width: `${dailyProgress}%`}]} />
        </View>
        <Text style={styles.progressText}>
          {todayStats.totalQuestions} / {userProfile.dailyGoal} soru
        </Text>
        {dailyProgress >= 100 && (
          <View style={styles.goalComplete}>
            <Text style={styles.goalCompleteText}>
              ✅ Günlük hedef tamamlandı!
            </Text>
          </View>
        )}
      </View>

      {/* Today Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Bugünün Özeti</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.correctText]}>
              {todayStats.totalCorrect}
            </Text>
            <Text style={styles.statLabel}>✅ Doğru</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.wrongText]}>
              {todayStats.totalWrong}
            </Text>
            <Text style={styles.statLabel}>❌ Yanlış</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, styles.emptyText]}>
              {todayStats.totalEmpty}
            </Text>
            <Text style={styles.statLabel}>⬜ Boş</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{todayAccuracy}%</Text>
            <Text style={styles.statLabel}>📈 Başarı</Text>
          </View>
        </View>
        <View style={styles.studyTimeRow}>
          <Text style={styles.studyTimeLabel}>⏱️ Çalışma Süresi:</Text>
          <Text style={styles.studyTimeValue}>
            {formatStudyTime(todayStats.totalStudyTime)}
          </Text>
        </View>
      </View>

      {/* Weekly Stats */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>📈 Bu Hafta</Text>
        <View style={styles.weeklyStatsRow}>
          <View style={styles.weeklyStatItem}>
            <Text style={styles.weeklyStatValue}>
              {weeklyStats.totalQuestions}
            </Text>
            <Text style={styles.weeklyStatLabel}>Soru</Text>
          </View>
          <View style={styles.weeklyStatItem}>
            <Text style={styles.weeklyStatValue}>{weeklyAccuracy}%</Text>
            <Text style={styles.weeklyStatLabel}>Başarı</Text>
          </View>
          <View style={styles.weeklyStatItem}>
            <Text style={styles.weeklyStatValue}>
              {weeklyStats.totalStudyHours.toFixed(1)}s
            </Text>
            <Text style={styles.weeklyStatLabel}>Çalışma</Text>
          </View>
        </View>
      </View>

      {/* Add Study Button */}
      <TouchableOpacity style={styles.addButton} onPress={onAddStudy}>
        <Text style={styles.addButtonText}>➕ Çalışma Ekle</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#667eea',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  motivation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontStyle: 'italic',
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: -20,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  quickStatCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  examCard: {
    backgroundColor: '#ff6b6b',
  },
  quickStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  quickStatLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#667eea',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#e9ecef',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 6,
  },
  progressText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
  },
  goalComplete: {
    backgroundColor: '#d4edda',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  goalCompleteText: {
    color: '#155724',
    textAlign: 'center',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  correctText: {
    color: '#28a745',
  },
  wrongText: {
    color: '#dc3545',
  },
  emptyText: {
    color: '#6c757d',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  studyTimeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  studyTimeLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  studyTimeValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#17a2b8',
  },
  weeklyStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  weeklyStatItem: {
    alignItems: 'center',
  },
  weeklyStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
  },
  weeklyStatLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#667eea',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 30,
  },
});
