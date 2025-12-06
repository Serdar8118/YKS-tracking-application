import {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StudyRecord, DailyGoal, UserProfile, WeeklyStats} from '../types';

const STORAGE_KEYS = {
  STUDY_RECORDS: 'yks-study-records',
  DAILY_GOALS: 'yks-daily-goals',
  USER_PROFILE: 'yks-user-profile',
};

// Varsayılan kullanıcı profili
const DEFAULT_PROFILE: UserProfile = {
  name: 'Öğrenci',
  targetExam: 'TYT',
  dailyGoal: 100,
  currentStreak: 0,
  longestStreak: 0,
  totalQuestionsCompleted: 0,
};

export function useStudyTracker() {
  const [studyRecords, setStudyRecords] = useState<StudyRecord[]>([]);
  const [dailyGoals, setDailyGoals] = useState<DailyGoal[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  // AsyncStorage'dan veri yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedRecords, savedGoals, savedProfile] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.STUDY_RECORDS),
          AsyncStorage.getItem(STORAGE_KEYS.DAILY_GOALS),
          AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE),
        ]);

        if (savedRecords) {
          setStudyRecords(JSON.parse(savedRecords));
        }
        if (savedGoals) {
          setDailyGoals(JSON.parse(savedGoals));
        }
        if (savedProfile) {
          setUserProfile(JSON.parse(savedProfile));
        }
      } catch (error) {
        console.error('Veri yüklenirken hata oluştu:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // AsyncStorage'a kaydet
  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(
        STORAGE_KEYS.STUDY_RECORDS,
        JSON.stringify(studyRecords),
      );
    }
  }, [studyRecords, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(
        STORAGE_KEYS.DAILY_GOALS,
        JSON.stringify(dailyGoals),
      );
    }
  }, [dailyGoals, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      AsyncStorage.setItem(
        STORAGE_KEYS.USER_PROFILE,
        JSON.stringify(userProfile),
      );
    }
  }, [userProfile, isLoading]);

  // Çalışma kaydı ekle
  const addStudyRecord = useCallback((record: Omit<StudyRecord, 'id'>) => {
    const newRecord: StudyRecord = {
      ...record,
      id: `record-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    setStudyRecords(prev => [...prev, newRecord]);

    // Toplam soru sayısını güncelle
    setUserProfile(prev => ({
      ...prev,
      totalQuestionsCompleted:
        prev.totalQuestionsCompleted + record.questionsCompleted,
    }));

    return newRecord;
  }, []);

  // Çalışma kaydı sil
  const deleteStudyRecord = useCallback((recordId: string) => {
    setStudyRecords(prev => {
      const recordToDelete = prev.find(r => r.id === recordId);
      if (recordToDelete) {
        setUserProfile(profile => ({
          ...profile,
          totalQuestionsCompleted: Math.max(
            0,
            profile.totalQuestionsCompleted - recordToDelete.questionsCompleted,
          ),
        }));
      }
      return prev.filter(r => r.id !== recordId);
    });
  }, []);

  // Günlük hedef güncelle
  const updateDailyGoal = useCallback((goal: Omit<DailyGoal, 'id'>) => {
    const today = new Date().toISOString().split('T')[0];

    setDailyGoals(prev => {
      const existingIndex = prev.findIndex(g => g.date === today);
      const newGoal: DailyGoal = {
        ...goal,
        id: `goal-${today}`,
        date: today,
      };

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newGoal;
        return updated;
      }
      return [...prev, newGoal];
    });
  }, []);

  // Kullanıcı profilini güncelle
  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUserProfile(prev => ({...prev, ...updates}));
  }, []);

  // Bugünün istatistiklerini hesapla
  const getTodayStats = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = studyRecords.filter(r => r.date === today);

    return {
      totalQuestions: todayRecords.reduce(
        (sum, r) => sum + r.questionsCompleted,
        0,
      ),
      totalCorrect: todayRecords.reduce((sum, r) => sum + r.correctAnswers, 0),
      totalWrong: todayRecords.reduce((sum, r) => sum + r.wrongAnswers, 0),
      totalEmpty: todayRecords.reduce((sum, r) => sum + r.emptyAnswers, 0),
      totalStudyTime: todayRecords.reduce((sum, r) => sum + r.studyDuration, 0),
      recordCount: todayRecords.length,
    };
  }, [studyRecords]);

  // Haftalık istatistikleri hesapla
  const getWeeklyStats = useCallback((): WeeklyStats => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekStartStr = weekStart.toISOString().split('T')[0];

    const weekRecords = studyRecords.filter(r => r.date >= weekStartStr);

    const subjectBreakdown: WeeklyStats['subjectBreakdown'] = {};
    weekRecords.forEach(record => {
      if (!subjectBreakdown[record.subjectId]) {
        subjectBreakdown[record.subjectId] = {questions: 0, correct: 0, wrong: 0};
      }
      subjectBreakdown[record.subjectId].questions += record.questionsCompleted;
      subjectBreakdown[record.subjectId].correct += record.correctAnswers;
      subjectBreakdown[record.subjectId].wrong += record.wrongAnswers;
    });

    return {
      weekStart: weekStartStr,
      totalQuestions: weekRecords.reduce(
        (sum, r) => sum + r.questionsCompleted,
        0,
      ),
      totalCorrect: weekRecords.reduce((sum, r) => sum + r.correctAnswers, 0),
      totalWrong: weekRecords.reduce((sum, r) => sum + r.wrongAnswers, 0),
      totalEmpty: weekRecords.reduce((sum, r) => sum + r.emptyAnswers, 0),
      totalStudyHours:
        weekRecords.reduce((sum, r) => sum + r.studyDuration, 0) / 60,
      subjectBreakdown,
    };
  }, [studyRecords]);

  // Ders bazlı istatistikleri al
  const getSubjectStats = useCallback(
    (subjectId: string) => {
      const subjectRecords = studyRecords.filter(r => r.subjectId === subjectId);

      return {
        totalQuestions: subjectRecords.reduce(
          (sum, r) => sum + r.questionsCompleted,
          0,
        ),
        totalCorrect: subjectRecords.reduce(
          (sum, r) => sum + r.correctAnswers,
          0,
        ),
        totalWrong: subjectRecords.reduce((sum, r) => sum + r.wrongAnswers, 0),
        accuracy:
          subjectRecords.length > 0
            ? (
                (subjectRecords.reduce((sum, r) => sum + r.correctAnswers, 0) /
                  subjectRecords.reduce(
                    (sum, r) => sum + r.questionsCompleted,
                    0,
                  )) *
                100
              ).toFixed(1)
            : '0',
        totalStudyTime: subjectRecords.reduce(
          (sum, r) => sum + r.studyDuration,
          0,
        ),
      };
    },
    [studyRecords],
  );

  // Streak hesapla
  const calculateStreak = useCallback(() => {
    const dates = [...new Set(studyRecords.map(r => r.date))].sort().reverse();

    if (dates.length === 0) {
      return 0;
    }

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split('T')[0];

    if (dates[0] !== today && dates[0] !== yesterday) {
      return 0;
    }

    let streak = 1;
    let currentDate = new Date(dates[0]);

    for (let i = 1; i < dates.length; i++) {
      const expectedDate = new Date(currentDate);
      expectedDate.setDate(expectedDate.getDate() - 1);
      const expectedDateStr = expectedDate.toISOString().split('T')[0];

      if (dates[i] === expectedDateStr) {
        streak++;
        currentDate = expectedDate;
      } else {
        break;
      }
    }

    return streak;
  }, [studyRecords]);

  // Streak güncelle
  useEffect(() => {
    if (!isLoading && studyRecords.length > 0) {
      const currentStreak = calculateStreak();
      setUserProfile(prev => ({
        ...prev,
        currentStreak,
        longestStreak: Math.max(prev.longestStreak, currentStreak),
      }));
    }
  }, [studyRecords, isLoading, calculateStreak]);

  return {
    studyRecords,
    dailyGoals,
    userProfile,
    isLoading,
    addStudyRecord,
    deleteStudyRecord,
    updateDailyGoal,
    updateUserProfile,
    getTodayStats,
    getWeeklyStats,
    getSubjectStats,
    calculateStreak,
  };
}
