import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {StudyRecord} from '../types';

interface HistoryScreenProps {
  records: StudyRecord[];
  onDeleteRecord: (id: string) => void;
}

export function HistoryScreen({records, onDeleteRecord}: HistoryScreenProps) {
  const [filter, setFilter] = useState<'all' | 'TYT' | 'AYT'>('all');

  // En son kayıtlar önce görünsün
  const sortedRecords = [...records].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) {
      return dateCompare;
    }
    return b.id.localeCompare(a.id);
  });

  const filteredRecords =
    filter === 'all'
      ? sortedRecords
      : sortedRecords.filter(r => r.examType === filter);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split('T')[0];

    if (dateStr === today) {
      return 'Bugün';
    }
    if (dateStr === yesterday) {
      return 'Dün';
    }

    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      weekday: 'long',
    });
  };

  const formatDuration = (minutes: number) => {
    if (minutes === 0) {
      return '-';
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}s ${mins}dk`;
    }
    return `${mins}dk`;
  };

  const calculateAccuracy = (correct: number, total: number) => {
    if (total === 0) {
      return 0;
    }
    return ((correct / total) * 100).toFixed(1);
  };

  const handleDelete = (id: string, subjectName: string) => {
    Alert.alert(
      'Kaydı Sil',
      `"${subjectName}" çalışma kaydını silmek istediğinize emin misiniz?`,
      [
        {text: 'İptal', style: 'cancel'},
        {
          text: 'Sil',
          style: 'destructive',
          onPress: () => onDeleteRecord(id),
        },
      ],
    );
  };

  // Günlere göre grupla
  const groupedByDate = filteredRecords.reduce(
    (groups, record) => {
      const date = record.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
      return groups;
    },
    {} as {[date: string]: StudyRecord[]},
  );

  const dates = Object.keys(groupedByDate).sort().reverse();

  if (records.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📋 Çalışma Geçmişi</Text>
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>📖</Text>
          <Text style={styles.emptyTitle}>Henüz çalışma kaydı yok</Text>
          <Text style={styles.emptyStateText}>
            İlk çalışma kaydınızı ekleyerek başlayın!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📋 Çalışma Geçmişi</Text>
        <View style={styles.filterRow}>
          {(['all', 'TYT', 'AYT'] as const).map(f => (
            <TouchableOpacity
              key={f}
              style={[styles.filterButton, filter === f && styles.filterButtonActive]}
              onPress={() => setFilter(f)}>
              <Text
                style={[
                  styles.filterText,
                  filter === f && styles.filterTextActive,
                ]}>
                {f === 'all' ? 'Tümü' : f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={styles.list}>
        {dates.map(date => (
          <View key={date} style={styles.dateGroup}>
            <View style={styles.dateHeader}>
              <Text style={styles.dateText}>{formatDate(date)}</Text>
              <Text style={styles.dateCount}>
                {groupedByDate[date].reduce(
                  (sum, r) => sum + r.questionsCompleted,
                  0,
                )}{' '}
                soru
              </Text>
            </View>

            {groupedByDate[date].map(record => (
              <View key={record.id} style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <View style={styles.subjectRow}>
                    <View
                      style={[
                        styles.examBadge,
                        record.examType === 'TYT'
                          ? styles.tytBadge
                          : styles.aytBadge,
                      ]}>
                      <Text style={styles.examBadgeText}>{record.examType}</Text>
                    </View>
                    <Text style={styles.subjectName}>{record.subjectName}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(record.id, record.subjectName)}>
                    <Text style={styles.deleteButtonText}>🗑️</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.statsRow}>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>Soru</Text>
                    <Text style={styles.statValue}>
                      {record.questionsCompleted}
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>D</Text>
                    <Text style={[styles.statValue, styles.correctText]}>
                      {record.correctAnswers}
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>Y</Text>
                    <Text style={[styles.statValue, styles.wrongText]}>
                      {record.wrongAnswers}
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>B</Text>
                    <Text style={[styles.statValue, styles.emptyText]}>
                      {record.emptyAnswers}
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>%</Text>
                    <Text style={[styles.statValue, styles.accuracyText]}>
                      {calculateAccuracy(
                        record.correctAnswers,
                        record.questionsCompleted,
                      )}
                    </Text>
                  </View>
                  <View style={styles.stat}>
                    <Text style={styles.statLabel}>⏱️</Text>
                    <Text style={styles.statValue}>
                      {formatDuration(record.studyDuration)}
                    </Text>
                  </View>
                </View>

                {record.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesText}>💭 {record.notes}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}

        {filteredRecords.length === 0 && records.length > 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>
              Bu filtreye uygun kayıt bulunamadı.
            </Text>
          </View>
        )}

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
    backgroundColor: '#667eea',
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  filterButtonActive: {
    backgroundColor: '#fff',
  },
  filterText: {
    color: '#fff',
    fontWeight: '600',
  },
  filterTextActive: {
    color: '#667eea',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  dateGroup: {
    marginBottom: 20,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  dateCount: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '600',
  },
  recordCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  examBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tytBadge: {
    backgroundColor: '#e3f2fd',
  },
  aytBadge: {
    backgroundColor: '#f3e5f5',
  },
  examBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deleteButton: {
    padding: 4,
  },
  deleteButtonText: {
    fontSize: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
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
  accuracyText: {
    color: '#667eea',
  },
  notesContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
  },
  notesText: {
    fontSize: 14,
    color: '#856404',
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    color: '#666',
    fontSize: 16,
  },
  bottomSpacer: {
    height: 30,
  },
});
