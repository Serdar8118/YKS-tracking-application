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
import {
  TYT_SUBJECTS,
  AYT_SAYISAL_SUBJECTS,
  AYT_ESIT_AGIRLIK_SUBJECTS,
  AYT_SOZEL_SUBJECTS,
  StudyRecord,
} from '../types';

interface AddStudyScreenProps {
  targetExam: string;
  onAddRecord: (record: Omit<StudyRecord, 'id'>) => void;
  onCancel: () => void;
}

export function AddStudyScreen({
  targetExam,
  onAddRecord,
  onCancel,
}: AddStudyScreenProps) {
  const [examType, setExamType] = useState<'TYT' | 'AYT'>('TYT');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [questionsCompleted, setQuestionsCompleted] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState('');
  const [wrongAnswers, setWrongAnswers] = useState('');
  const [studyDuration, setStudyDuration] = useState('');
  const [notes, setNotes] = useState('');

  const getSubjects = () => {
    if (examType === 'TYT') {
      return TYT_SUBJECTS;
    }

    switch (targetExam) {
      case 'AYT-Sayısal':
        return AYT_SAYISAL_SUBJECTS;
      case 'AYT-Eşit Ağırlık':
        return AYT_ESIT_AGIRLIK_SUBJECTS;
      case 'AYT-Sözel':
        return AYT_SOZEL_SUBJECTS;
      default:
        return [
          ...AYT_SAYISAL_SUBJECTS,
          ...AYT_ESIT_AGIRLIK_SUBJECTS,
          ...AYT_SOZEL_SUBJECTS,
        ];
    }
  };

  const subjects = getSubjects();
  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);

  const handleSubmit = () => {
    const total = parseInt(questionsCompleted, 10) || 0;
    const correct = parseInt(correctAnswers, 10) || 0;
    const wrong = parseInt(wrongAnswers, 10) || 0;
    const empty = total - correct - wrong;

    if (!selectedSubject) {
      Alert.alert('Hata', 'Lütfen bir ders seçin');
      return;
    }

    if (total <= 0) {
      Alert.alert('Hata', 'Soru sayısı 0\'dan büyük olmalıdır');
      return;
    }

    if (correct + wrong > total) {
      Alert.alert('Hata', 'Doğru ve yanlış sayısı toplam soru sayısını geçemez');
      return;
    }

    const record: Omit<StudyRecord, 'id'> = {
      date: new Date().toISOString().split('T')[0],
      subjectId: selectedSubject,
      subjectName: selectedSubjectData?.name || '',
      examType,
      questionsCompleted: total,
      correctAnswers: correct,
      wrongAnswers: wrong,
      emptyAnswers: empty,
      studyDuration: parseInt(studyDuration, 10) || 0,
      notes: notes.trim() || undefined,
    };

    onAddRecord(record);
    onCancel();
  };

  const emptyCount = Math.max(
    0,
    (parseInt(questionsCompleted, 10) || 0) -
      (parseInt(correctAnswers, 10) || 0) -
      (parseInt(wrongAnswers, 10) || 0),
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Geri</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📝 Yeni Çalışma</Text>
      </View>

      {/* Exam Type Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Sınav Türü</Text>
        <View style={styles.examTypeRow}>
          <TouchableOpacity
            style={[
              styles.examTypeButton,
              examType === 'TYT' && styles.examTypeButtonActive,
            ]}
            onPress={() => {
              setExamType('TYT');
              setSelectedSubject('');
            }}>
            <Text
              style={[
                styles.examTypeText,
                examType === 'TYT' && styles.examTypeTextActive,
              ]}>
              TYT
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.examTypeButton,
              examType === 'AYT' && styles.examTypeButtonActive,
            ]}
            onPress={() => {
              setExamType('AYT');
              setSelectedSubject('');
            }}>
            <Text
              style={[
                styles.examTypeText,
                examType === 'AYT' && styles.examTypeTextActive,
              ]}>
              AYT
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Subject Selection */}
      <View style={styles.section}>
        <Text style={styles.label}>Ders Seçin</Text>
        <View style={styles.subjectGrid}>
          {subjects.map(subject => (
            <TouchableOpacity
              key={subject.id}
              style={[
                styles.subjectButton,
                selectedSubject === subject.id && styles.subjectButtonActive,
              ]}
              onPress={() => setSelectedSubject(subject.id)}>
              <Text
                style={[
                  styles.subjectText,
                  selectedSubject === subject.id && styles.subjectTextActive,
                ]}>
                {subject.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Question Count */}
      <View style={styles.section}>
        <Text style={styles.label}>Toplam Soru Sayısı</Text>
        <TextInput
          style={styles.input}
          value={questionsCompleted}
          onChangeText={setQuestionsCompleted}
          keyboardType="numeric"
          placeholder="Çözdüğünüz soru sayısı"
          placeholderTextColor="#999"
        />
      </View>

      {/* Results */}
      <View style={styles.section}>
        <Text style={styles.label}>Sonuçlar</Text>
        <View style={styles.resultsRow}>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>✅ Doğru</Text>
            <TextInput
              style={[styles.input, styles.resultInput, styles.correctInput]}
              value={correctAnswers}
              onChangeText={setCorrectAnswers}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>❌ Yanlış</Text>
            <TextInput
              style={[styles.input, styles.resultInput, styles.wrongInput]}
              value={wrongAnswers}
              onChangeText={setWrongAnswers}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#999"
            />
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>⬜ Boş</Text>
            <View style={styles.emptyDisplay}>
              <Text style={styles.emptyText}>{emptyCount}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Study Duration */}
      <View style={styles.section}>
        <Text style={styles.label}>Çalışma Süresi (dakika)</Text>
        <TextInput
          style={styles.input}
          value={studyDuration}
          onChangeText={setStudyDuration}
          keyboardType="numeric"
          placeholder="Kaç dakika çalıştınız?"
          placeholderTextColor="#999"
        />
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.label}>Notlar (Opsiyonel)</Text>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Çalışma ile ilgili notlar..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>💾 Kaydet</Text>
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
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  examTypeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  examTypeButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e9ecef',
    alignItems: 'center',
  },
  examTypeButtonActive: {
    borderColor: '#667eea',
    backgroundColor: '#667eea',
  },
  examTypeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  examTypeTextActive: {
    color: '#fff',
  },
  subjectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  subjectButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  subjectButtonActive: {
    borderColor: '#667eea',
    backgroundColor: '#667eea',
  },
  subjectText: {
    fontSize: 14,
    color: '#333',
  },
  subjectTextActive: {
    color: '#fff',
    fontWeight: '600',
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
  resultsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  resultItem: {
    flex: 1,
  },
  resultLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  resultInput: {
    textAlign: 'center',
  },
  correctInput: {
    borderColor: '#28a745',
  },
  wrongInput: {
    borderColor: '#dc3545',
  },
  emptyDisplay: {
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#e9ecef',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6c757d',
  },
  notesInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 24,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#667eea',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
});
