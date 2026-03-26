import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {Achievement, ACHIEVEMENTS, pointsToNextLevel} from '../types';

interface AchievementsScreenProps {
  unlockedAchievements: string[];
  points: number;
  level: number;
  onBack: () => void;
}

export function AchievementsScreen({
  unlockedAchievements,
  points,
  level,
  onBack,
}: AchievementsScreenProps) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnims = useRef(
    ACHIEVEMENTS.map(() => new Animated.Value(0.8)),
  ).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entry animations
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Staggered card animations
    const animations = scaleAnims.map((anim, index) =>
      Animated.spring(anim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        delay: index * 50,
        useNativeDriver: true,
      }),
    );
    Animated.stagger(30, animations).start();

    // Progress bar animation
    const {current, required} = pointsToNextLevel(points);
    const progress = current / required;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [fadeAnim, scaleAnims, progressAnim, points]);

  const {current, required} = pointsToNextLevel(points);
  const unlockedCount = unlockedAchievements.length;
  const totalCount = ACHIEVEMENTS.length;

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const renderAchievement = (achievement: Achievement, index: number) => {
    const isUnlocked = unlockedAchievements.includes(achievement.id);

    return (
      <Animated.View
        key={achievement.id}
        style={[
          styles.achievementCard,
          isUnlocked && styles.achievementCardUnlocked,
          {transform: [{scale: scaleAnims[index]}]},
        ]}>
        <View
          style={[
            styles.iconContainer,
            isUnlocked && styles.iconContainerUnlocked,
          ]}>
          <Text style={styles.icon}>
            {isUnlocked ? achievement.icon : '🔒'}
          </Text>
        </View>

        <View style={styles.achievementInfo}>
          <Text
            style={[
              styles.achievementTitle,
              !isUnlocked && styles.achievementTitleLocked,
            ]}>
            {achievement.title}
          </Text>
          <Text style={styles.achievementDescription}>
            {achievement.description}
          </Text>
          <View style={styles.rewardRow}>
            <Text style={styles.rewardText}>
              🎁 +{achievement.pointsReward} puan
            </Text>
            {isUnlocked && (
              <View style={styles.unlockedBadge}>
                <Text style={styles.unlockedBadgeText}>✓ Kazanıldı</Text>
              </View>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, {opacity: fadeAnim}]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🏅 Başarılar</Text>
      </Animated.View>

      <ScrollView style={styles.content}>
        {/* Level Progress Card */}
        <Animated.View style={[styles.levelCard, {opacity: fadeAnim}]}>
          <View style={styles.levelHeader}>
            <View style={styles.levelInfo}>
              <Text style={styles.levelLabel}>Seviye</Text>
              <Text style={styles.levelNumber}>{level}</Text>
            </View>
            <View style={styles.pointsInfo}>
              <Text style={styles.pointsNumber}>{points}</Text>
              <Text style={styles.pointsLabel}>toplam puan</Text>
            </View>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[styles.progressFill, {width: progressWidth}]}
              />
            </View>
            <Text style={styles.progressText}>
              {current} / {required} (Seviye {level + 1}'e)
            </Text>
          </View>

          <View style={styles.nextLevelRewards}>
            <Text style={styles.nextLevelTitle}>
              📦 Seviye {level + 1} Ödülleri
            </Text>
            <Text style={styles.nextLevelText}>
              • Yeni rozet açılır
            </Text>
            <Text style={styles.nextLevelText}>
              • Özel özellikler kazanılır
            </Text>
          </View>
        </Animated.View>

        {/* Progress Summary */}
        <Animated.View style={[styles.summaryCard, {opacity: fadeAnim}]}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{unlockedCount}</Text>
            <Text style={styles.summaryLabel}>Kazanılan</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>{totalCount - unlockedCount}</Text>
            <Text style={styles.summaryLabel}>Kalan</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryNumber}>
              {Math.round((unlockedCount / totalCount) * 100)}%
            </Text>
            <Text style={styles.summaryLabel}>İlerleme</Text>
          </View>
        </Animated.View>

        {/* Unlocked Achievements */}
        {unlockedCount > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ Kazanılan Başarılar</Text>
            {ACHIEVEMENTS.filter(a =>
              unlockedAchievements.includes(a.id),
            ).map((achievement, index) => renderAchievement(achievement, index))}
          </View>
        )}

        {/* Locked Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔒 Kilitli Başarılar</Text>
          {ACHIEVEMENTS.filter(
            a => !unlockedAchievements.includes(a.id),
          ).map((achievement, index) =>
            renderAchievement(achievement, unlockedCount + index),
          )}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#667eea',
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  levelCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#667eea',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelInfo: {
    alignItems: 'center',
  },
  levelLabel: {
    fontSize: 14,
    color: '#888',
  },
  levelNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#667eea',
  },
  pointsInfo: {
    alignItems: 'flex-end',
  },
  pointsNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#888',
  },
  progressContainer: {
    marginBottom: 16,
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
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  nextLevelRewards: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
  },
  nextLevelTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  nextLevelText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#667eea',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  summaryDivider: {
    width: 1,
    backgroundColor: '#e9ecef',
    marginHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  achievementCardUnlocked: {
    backgroundColor: '#f8fff8',
    borderWidth: 1,
    borderColor: '#28a745',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconContainerUnlocked: {
    backgroundColor: '#e8f5e9',
  },
  icon: {
    fontSize: 32,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  achievementTitleLocked: {
    color: '#888',
  },
  achievementDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  rewardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '600',
  },
  unlockedBadge: {
    backgroundColor: '#28a745',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  unlockedBadgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});
