import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Animated,
} from 'react-native';
import {
  WeeklySchedule,
  SchedulePreferences,
  TYT_SUBJECTS,
  AYT_SAYISAL_SUBJECTS,
} from '../types';

interface AIScheduleScreenProps {
  currentSchedule: WeeklySchedule | null;
  isGenerating: boolean;
  examType: 'TYT' | 'AYT-Sayısal' | 'AYT-Eşit Ağırlık' | 'AYT-Sözel';
  userId: string;
  onGenerateSchedule: (
    userId: string,
    examType: 'TYT' | 'AYT-Sayısal' | 'AYT-Eşit Ağırlık' | 'AYT-Sözel',
    preferences: SchedulePreferences,
  ) => Promise<WeeklySchedule>;
  onMarkCompleted: (dayIndex: number, sessionId: string) => void;
  onBack: () => void;
}

export function AIScheduleScreen({
  currentSchedule,
  isGenerating,
  examType,
  userId,
  onGenerateSchedule,
  onMarkCompleted,
  onBack,
}: AIScheduleScreenProps) {
  const [showPreferences, setShowPreferences] = useState(!currentSchedule);
  const [selectedDay, setSelectedDay] = useState(0);
  const [preferences, setPreferences] = useState<SchedulePreferences>({
    dailyStudyHours: 6,
    restDays: [0], // Sunday
    weakSubjects: [],
    strongSubjects: [],
    preferredStudyTime: 'afternoon',
    focusAreas: [],
  });

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    if (isGenerating) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isGenerating, pulseAnim]);

  const subjects = examType === 'TYT' ? TYT_SUBJECTS : [...TYT_SUBJECTS, ...AYT_SAYISAL_SUBJECTS];

  const handleGenerate = async () => {
    try {
      await onGenerateSchedule(userId, examType, preferences);
      setShowPreferences(false);
    } catch {
      Alert.alert('Hata', 'Program oluşturulurken bir hata oluştu');
    }
  };

  const toggleWeakSubject = (subjectId: string) => {
    setPreferences(prev => {
      const isWeak = prev.weakSubjects.includes(subjectId);
      return {
        ...prev,
        weakSubjects: isWeak
          ? prev.weakSubjects.filter(id => id !== subjectId)
          : [...prev.weakSubjects, subjectId],
        strongSubjects: prev.strongSubjects.filter(id => id !== subjectId),
      };
    });
  };

  const toggleStrongSubject = (subjectId: string) => {
    setPreferences(prev => {
      const isStrong = prev.strongSubjects.includes(subjectId);
      return {
        ...prev,
        strongSubjects: isStrong
          ? prev.strongSubjects.filter(id => id !== subjectId)
          : [...prev.strongSubjects, subjectId],
        weakSubjects: prev.weakSubjects.filter(id => id !== subjectId),
      };
    });
  };

  const toggleRestDay = (day: number) => {
    setPreferences(prev => {
      const isRest = prev.restDays.includes(day);
      return {
        ...prev,
        restDays: isRest
          ? prev.restDays.filter(d => d !== day)
          : [...prev.restDays, day],
      };
    });
  };

  if (showPreferences) {
    return (
      <ScrollView style={styles.container}>
        <Animated.View
          style={[
            styles.content,
            {opacity: fadeAnim, transform: [{translateY: slideAnim}]},
          ]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backText}>← Geri</Text>
            </TouchableOpacity>
            <Text style={styles.title}>🤖 AI Program Oluştur</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📅 Günlük Çalışma Süresi</Text>
            <View style={styles.hoursRow}>
              {[4, 5, 6, 7, 8].map(hours => (
                <TouchableOpacity
                  key={hours}
                  style={[
                    styles.hourButton,
                    preferences.dailyStudyHours === hours && styles.hourButtonActive,
                  ]}
                  onPress={() =>
                    setPreferences(p => ({...p, dailyStudyHours: hours}))
                  }>
                  <Text
                    style={[
                      styles.hourText,
                      preferences.dailyStudyHours === hours && styles.hourTextActive,
                    ]}>
                    {hours}s
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>⏰ Tercih Edilen Zaman</Text>
            <View style={styles.timeRow}>
              {[
                {key: 'morning', label: 'Sabah', icon: '🌅'},
                {key: 'afternoon', label: 'Öğleden Sonra', icon: '☀️'},
                {key: 'evening', label: 'Akşam', icon: '🌆'},
                {key: 'night', label: 'Gece', icon: '🌙'},
              ].map(time => (
                <TouchableOpacity
                  key={time.key}
                  style={[
                    styles.timeButton,
                    preferences.preferredStudyTime === time.key &&
                      styles.timeButtonActive,
                  ]}
                  onPress={() =>
                    setPreferences(p => ({
                      ...p,
                      preferredStudyTime: time.key as SchedulePreferences['preferredStudyTime'],
                    }))
                  }>
                  <Text style={styles.timeIcon}>{time.icon}</Text>
                  <Text
                    style={[
                      styles.timeText,
                      preferences.preferredStudyTime === time.key &&
                        styles.timeTextActive,
                    ]}>
                    {time.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>😴 Dinlenme Günleri</Text>
            <View style={styles.daysRow}>
              {['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'].map((day, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayButton,
                    preferences.restDays.includes(index) && styles.dayButtonActive,
                  ]}
                  onPress={() => toggleRestDay(index)}>
                  <Text
                    style={[
                      styles.dayText,
                      preferences.restDays.includes(index) && styles.dayTextActive,
                    ]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📚 Zayıf Derslerim (Öncelikli)</Text>
            <View style={styles.subjectsGrid}>
              {subjects.map(subject => (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.subjectChip,
                    preferences.weakSubjects.includes(subject.id) &&
                      styles.subjectChipWeak,
                  ]}
                  onPress={() => toggleWeakSubject(subject.id)}>
                  <Text
                    style={[
                      styles.subjectChipText,
                      preferences.weakSubjects.includes(subject.id) &&
                        styles.subjectChipTextActive,
                    ]}>
                    {subject.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>💪 Güçlü Derslerim</Text>
            <View style={styles.subjectsGrid}>
              {subjects.map(subject => (
                <TouchableOpacity
                  key={subject.id}
                  style={[
                    styles.subjectChip,
                    preferences.strongSubjects.includes(subject.id) &&
                      styles.subjectChipStrong,
                  ]}
                  onPress={() => toggleStrongSubject(subject.id)}>
                  <Text
                    style={[
                      styles.subjectChipText,
                      preferences.strongSubjects.includes(subject.id) &&
                        styles.subjectChipTextActive,
                    ]}>
                    {subject.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Animated.View style={{transform: [{scale: pulseAnim}]}}>
            <TouchableOpacity
              style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]}
              onPress={handleGenerate}
              disabled={isGenerating}>
              <Text style={styles.generateButtonText}>
                {isGenerating ? '🤖 Program Oluşturuluyor...' : '✨ Program Oluştur'}
              </Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.bottomSpacer} />
        </Animated.View>
      </ScrollView>
    );
  }

  // Show schedule
  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.content, styles.flexOne, {opacity: fadeAnim}]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Geri</Text>
          </TouchableOpacity>
          <Text style={styles.title}>📅 Haftalık Program</Text>
        </View>

        {/* Day Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.dayTabs}>
          {currentSchedule?.days.map((day, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dayTab,
                selectedDay === index && styles.dayTabActive,
                day.isRestDay && styles.dayTabRest,
              ]}
              onPress={() => setSelectedDay(index)}>
              <Text
                style={[
                  styles.dayTabName,
                  selectedDay === index && styles.dayTabNameActive,
                ]}>
                {day.dayName.slice(0, 3)}
              </Text>
              <Text style={styles.dayTabDate}>
                {day.date.split('-')[2]}
              </Text>
              {day.isRestDay && <Text style={styles.restBadge}>😴</Text>}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Selected Day Schedule */}
        <ScrollView style={styles.scheduleList}>
          {currentSchedule?.days[selectedDay]?.isRestDay ? (
            <View style={styles.restDay}>
              <Text style={styles.restDayIcon}>😴</Text>
              <Text style={styles.restDayText}>Dinlenme Günü</Text>
              <Text style={styles.restDaySubtext}>
                Bugün kendine zaman ayır ve dinlen!
              </Text>
            </View>
          ) : (
            currentSchedule?.days[selectedDay]?.sessions.map(session => (
              <Animated.View
                key={session.id}
                style={[
                  styles.sessionCard,
                  session.completed && styles.sessionCardCompleted,
                ]}>
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionTime}>
                    <Text style={styles.sessionTimeText}>{session.startTime}</Text>
                    <Text style={styles.sessionDuration}>{session.duration} dk</Text>
                  </View>
                  <View
                    style={[
                      styles.priorityBadge,
                      session.priority === 'high' && styles.priorityHigh,
                      session.priority === 'medium' && styles.priorityMedium,
                      session.priority === 'low' && styles.priorityLow,
                    ]}>
                    <Text style={styles.priorityText}>
                      {session.priority === 'high'
                        ? '🔴'
                        : session.priority === 'medium'
                        ? '🟡'
                        : '🟢'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.sessionSubject}>{session.subjectName}</Text>
                <Text style={styles.sessionTarget}>
                  🎯 Hedef: {session.questionTarget} soru
                </Text>

                <TouchableOpacity
                  style={[
                    styles.completeButton,
                    session.completed && styles.completeButtonDone,
                  ]}
                  onPress={() => onMarkCompleted(selectedDay, session.id)}
                  disabled={session.completed}>
                  <Text style={styles.completeButtonText}>
                    {session.completed ? '✅ Tamamlandı' : 'Tamamla'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </ScrollView>

        {/* New Schedule Button */}
        <TouchableOpacity
          style={styles.newScheduleButton}
          onPress={() => setShowPreferences(true)}>
          <Text style={styles.newScheduleButtonText}>🔄 Yeni Program Oluştur</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 16,
  },
  flexOne: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 40,
  },
  backButton: {
    marginRight: 16,
  },
  backText: {
    fontSize: 16,
    color: '#667eea',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  hourButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hourButtonActive: {
    borderColor: '#667eea',
    backgroundColor: '#667eea',
  },
  hourText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  hourTextActive: {
    color: '#fff',
  },
  timeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeButton: {
    flex: 1,
    minWidth: 70,
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  timeButtonActive: {
    borderColor: '#667eea',
    backgroundColor: '#667eea',
  },
  timeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  timeText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  timeTextActive: {
    color: '#fff',
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e9ecef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonActive: {
    borderColor: '#ff6b6b',
    backgroundColor: '#ff6b6b',
  },
  dayText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
  dayTextActive: {
    color: '#fff',
  },
  subjectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  subjectChipWeak: {
    borderColor: '#ff6b6b',
    backgroundColor: '#ff6b6b',
  },
  subjectChipStrong: {
    borderColor: '#28a745',
    backgroundColor: '#28a745',
  },
  subjectChipText: {
    fontSize: 12,
    color: '#666',
  },
  subjectChipTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  generateButton: {
    backgroundColor: '#667eea',
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    marginTop: 8,
  },
  generateButtonDisabled: {
    opacity: 0.7,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
  dayTabs: {
    marginBottom: 16,
  },
  dayTab: {
    width: 60,
    height: 70,
    marginRight: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  dayTabActive: {
    backgroundColor: '#667eea',
  },
  dayTabRest: {
    backgroundColor: '#f8f9fa',
  },
  dayTabName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  dayTabNameActive: {
    color: '#fff',
  },
  dayTabDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  restBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    fontSize: 16,
  },
  scheduleList: {
    flex: 1,
  },
  restDay: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  restDayIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  restDayText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  restDaySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  sessionCard: {
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
  sessionCardCompleted: {
    backgroundColor: '#d4edda',
    opacity: 0.8,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sessionTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sessionTimeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  sessionDuration: {
    fontSize: 14,
    color: '#888',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityHigh: {
    backgroundColor: '#ffebee',
  },
  priorityMedium: {
    backgroundColor: '#fff8e1',
  },
  priorityLow: {
    backgroundColor: '#e8f5e9',
  },
  priorityText: {
    fontSize: 12,
  },
  sessionSubject: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sessionTarget: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  completeButton: {
    backgroundColor: '#667eea',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  completeButtonDone: {
    backgroundColor: '#28a745',
  },
  completeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  newScheduleButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#667eea',
    borderStyle: 'dashed',
  },
  newScheduleButtonText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
});
