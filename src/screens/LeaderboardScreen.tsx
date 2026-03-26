import React, {useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {LeaderboardEntry} from '../types';

interface LeaderboardScreenProps {
  entries: LeaderboardEntry[];
  onBack: () => void;
}

export function LeaderboardScreen({entries, onBack}: LeaderboardScreenProps) {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnims = useRef(entries.map(() => new Animated.Value(50))).current;

  useEffect(() => {
    // Entry animations
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();

    // Staggered list animations
    const animations = slideAnims.map((anim, index) =>
      Animated.timing(anim, {
        toValue: 0,
        duration: 300,
        delay: index * 50,
        useNativeDriver: true,
      }),
    );
    Animated.stagger(50, animations).start();
  }, [fadeAnim, slideAnims]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, {opacity: fadeAnim}]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🏆 Liderlik Tablosu</Text>
      </Animated.View>

      {/* Top 3 Podium */}
      {entries.length >= 3 && (
        <Animated.View style={[styles.podium, {opacity: fadeAnim}]}>
          {/* Second Place */}
          <View style={[styles.podiumItem, styles.podiumSecond]}>
            <Text style={styles.podiumMedal}>🥈</Text>
            <Text style={styles.podiumUsername} numberOfLines={1}>
              {entries[1]?.username}
            </Text>
            <Text style={styles.podiumPoints}>{entries[1]?.points} puan</Text>
            <View style={[styles.podiumBar, styles.podiumBarSecond]} />
          </View>

          {/* First Place */}
          <View style={[styles.podiumItem, styles.podiumFirst]}>
            <Text style={styles.podiumMedal}>🥇</Text>
            <Text style={styles.podiumUsername} numberOfLines={1}>
              {entries[0]?.username}
            </Text>
            <Text style={styles.podiumPoints}>{entries[0]?.points} puan</Text>
            <View style={[styles.podiumBar, styles.podiumBarFirst]} />
          </View>

          {/* Third Place */}
          <View style={[styles.podiumItem, styles.podiumThird]}>
            <Text style={styles.podiumMedal}>🥉</Text>
            <Text style={styles.podiumUsername} numberOfLines={1}>
              {entries[2]?.username}
            </Text>
            <Text style={styles.podiumPoints}>{entries[2]?.points} puan</Text>
            <View style={[styles.podiumBar, styles.podiumBarThird]} />
          </View>
        </Animated.View>
      )}

      {/* Rest of the List */}
      <ScrollView style={styles.list}>
        {entries.slice(3).map((entry, index) => (
          <Animated.View
            key={entry.userId}
            style={[
              styles.listItem,
              entry.isCurrentUser && styles.listItemCurrent,
              {
                opacity: fadeAnim,
                transform: [{translateX: slideAnims[index + 3] || new Animated.Value(0)}],
              },
            ]}>
            <View style={styles.rankContainer}>
              <Text style={styles.rankNumber}>{entry.rank}</Text>
            </View>

            <View style={styles.userInfo}>
              <Text
                style={[
                  styles.username,
                  entry.isCurrentUser && styles.usernameCurrent,
                ]}>
                {entry.username}
                {entry.isCurrentUser && ' (Sen)'}
              </Text>
              <Text style={styles.levelText}>Seviye {entry.level}</Text>
            </View>

            <View style={styles.statsContainer}>
              <Text style={styles.points}>{entry.points}</Text>
              <Text style={styles.pointsLabel}>puan</Text>
            </View>
          </Animated.View>
        ))}

        {entries.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>Henüz sıralama verisi yok</Text>
            <Text style={styles.emptySubtext}>
              Çalışmaya başlayarak sıralamaya girin!
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Info Card */}
      <Animated.View style={[styles.infoCard, {opacity: fadeAnim}]}>
        <Text style={styles.infoTitle}>📈 Nasıl Puan Kazanılır?</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoItem}>• Soru çöz: +1 puan/soru</Text>
          <Text style={styles.infoItem}>• Başarı: +bonus puan</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoItem}>• Seri: +10 puan/gün</Text>
          <Text style={styles.infoItem}>• Rozetler: +bonus</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#667eea',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
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
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  podiumItem: {
    alignItems: 'center',
    width: 100,
  },
  podiumFirst: {
    marginBottom: 0,
  },
  podiumSecond: {
    marginBottom: 20,
  },
  podiumThird: {
    marginBottom: 30,
  },
  podiumMedal: {
    fontSize: 40,
    marginBottom: 4,
  },
  podiumUsername: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    maxWidth: 80,
  },
  podiumPoints: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
  },
  podiumBar: {
    width: 80,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  podiumBarFirst: {
    height: 100,
    backgroundColor: '#FFD700',
  },
  podiumBarSecond: {
    height: 70,
    backgroundColor: '#C0C0C0',
  },
  podiumBarThird: {
    height: 50,
    backgroundColor: '#CD7F32',
  },
  list: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  listItemCurrent: {
    backgroundColor: '#e8f0fe',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  usernameCurrent: {
    color: '#667eea',
  },
  levelText: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  points: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#667eea',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#888',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 100,
  },
  infoCard: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
});
