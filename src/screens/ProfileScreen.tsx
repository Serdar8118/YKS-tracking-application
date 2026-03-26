import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {UserProfile} from '../types';

interface ProfileScreenProps {
  userProfile: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onBack: () => void;
}

export function ProfileScreen({
  userProfile,
  onUpdateProfile,
  onBack,
}: ProfileScreenProps) {
  const [name, setName] = useState(userProfile.name);
  const [targetExam, setTargetExam] = useState(userProfile.targetExam);
  const [examDate, setExamDate] = useState(userProfile.examDate || '');
  const [dailyGoal, setDailyGoal] = useState(userProfile.dailyGoal.toString());

  const examOptions: UserProfile['targetExam'][] = [
    'TYT',
    'AYT-Sayısal',
    'AYT-Eşit Ağırlık',
    'AYT-Sözel',
  ];

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Hata', 'Lütfen adınızı girin');
      return;
    }

    const goal = parseInt(dailyGoal, 10);
    if (isNaN(goal) || goal < 1) {
      Alert.alert('Hata', 'Günlük hedef en az 1 soru olmalıdır');
      return;
    }

    onUpdateProfile({
      name: name.trim(),
      targetExam,
      examDate: examDate || undefined,
      dailyGoal: goal,
    });

    Alert.alert('Başarılı', 'Profil bilgileriniz güncellendi!');
    onBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>⚙️ Profil Ayarları</Text>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 İstatistikleriniz</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {userProfile.totalQuestionsCompleted.toLocaleString('tr-TR')}
            </Text>
            <Text style={styles.statLabel}>Toplam Soru</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>🔥 {userProfile.currentStreak}</Text>
            <Text style={styles.statLabel}>Mevcut Seri</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>⭐ {userProfile.longestStreak}</Text>
            <Text style={styles.statLabel}>En Uzun Seri</Text>
          </View>
        </View>
      </View>

      {/* Name Input */}
      <View style={styles.section}>
        <Text style={styles.label}>İsim</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="İsminizi girin"
          placeholderTextColor="#999"
        />
      </View>

      {/* Target Exam Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Hedef Sınav</Text>
        <View style={styles.examGrid}>
          {examOptions.map(exam => (
            <TouchableOpacity
              key={exam}
              style={[
                styles.examButton,
                targetExam === exam && styles.examButtonActive,
              ]}
              onPress={() => setTargetExam(exam)}>
              <Text
                style={[
                  styles.examButtonText,
                  targetExam === exam && styles.examButtonTextActive,
                ]}>
                {exam}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Exam Date */}
      <View style={styles.section}>
        <Text style={styles.label}>Sınav Tarihi (YYYY-MM-DD)</Text>
        <TextInput
          style={styles.input}
          value={examDate}
          onChangeText={setExamDate}
          placeholder="2025-06-15"
          placeholderTextColor="#999"
        />
        <Text style={styles.hint}>
          Geri sayım için sınav tarihini belirleyin
        </Text>
      </View>

      {/* Daily Goal */}
      <View style={styles.section}>
        <Text style={styles.label}>Günlük Hedef (Soru Sayısı)</Text>
        <TextInput
          style={styles.input}
          value={dailyGoal}
          onChangeText={setDailyGoal}
          keyboardType="numeric"
          placeholder="100"
          placeholderTextColor="#999"
        />
        <Text style={styles.hint}>Her gün kaç soru çözmeyi hedefliyorsunuz?</Text>
      </View>

      {/* Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>💾 Kaydet</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statsCard: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  hint: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  examGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  examButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  examButtonActive: {
    borderColor: '#667eea',
    backgroundColor: '#667eea',
  },
  examButtonText: {
    fontSize: 14,
    color: '#333',
  },
  examButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 16,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#667eea',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});
