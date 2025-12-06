import {useState, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  WeeklySchedule,
  DaySchedule,
  StudySession,
  SchedulePreferences,
  TYT_SUBJECTS,
  AYT_SAYISAL_SUBJECTS,
  AYT_ESIT_AGIRLIK_SUBJECTS,
  AYT_SOZEL_SUBJECTS,
} from '../types';

const STORAGE_KEY = 'yks-weekly-schedule';

// Generate unique ID
function generateUniqueId(prefix: string): string {
  const timestamp = Date.now();
  const randomPart = Math.random().toString(36).substring(2, 11);
  return `${prefix}-${timestamp}-${randomPart}`;
}

// Day names in Turkish
const DAY_NAMES = [
  'Pazar',
  'Pazartesi',
  'Salı',
  'Çarşamba',
  'Perşembe',
  'Cuma',
  'Cumartesi',
];

// Get subjects based on exam type
function getSubjectsForExam(
  examType: 'TYT' | 'AYT-Sayısal' | 'AYT-Eşit Ağırlık' | 'AYT-Sözel',
) {
  switch (examType) {
    case 'TYT':
      return TYT_SUBJECTS;
    case 'AYT-Sayısal':
      return [...TYT_SUBJECTS, ...AYT_SAYISAL_SUBJECTS];
    case 'AYT-Eşit Ağırlık':
      return [...TYT_SUBJECTS, ...AYT_ESIT_AGIRLIK_SUBJECTS];
    case 'AYT-Sözel':
      return [...TYT_SUBJECTS, ...AYT_SOZEL_SUBJECTS];
    default:
      return TYT_SUBJECTS;
  }
}

// Get study time based on preference
function getStudyTimeSlots(preference: SchedulePreferences['preferredStudyTime']) {
  switch (preference) {
    case 'morning':
      return ['08:00', '09:00', '10:00', '11:00'];
    case 'afternoon':
      return ['13:00', '14:00', '15:00', '16:00'];
    case 'evening':
      return ['17:00', '18:00', '19:00', '20:00'];
    case 'night':
      return ['20:00', '21:00', '22:00', '23:00'];
    default:
      return ['09:00', '10:00', '14:00', '15:00'];
  }
}

export function useAISchedule() {
  const [currentSchedule, setCurrentSchedule] = useState<WeeklySchedule | null>(
    null,
  );
  const [isGenerating, setIsGenerating] = useState(false);

  // Load saved schedule
  const loadSchedule = useCallback(async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved) {
        setCurrentSchedule(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Program yüklenirken hata:', error);
    }
  }, []);

  // Save schedule
  const saveSchedule = useCallback(async (schedule: WeeklySchedule) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(schedule));
      setCurrentSchedule(schedule);
    } catch (error) {
      console.error('Program kaydedilirken hata:', error);
    }
  }, []);

  // AI-powered schedule generation
  const generateSchedule = useCallback(
    async (
      userId: string,
      examType: 'TYT' | 'AYT-Sayısal' | 'AYT-Eşit Ağırlık' | 'AYT-Sözel',
      preferences: SchedulePreferences,
    ): Promise<WeeklySchedule> => {
      setIsGenerating(true);

      try {
        // Simulate AI processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const subjects = getSubjectsForExam(examType);
        const timeSlots = getStudyTimeSlots(preferences.preferredStudyTime);

        // Calculate week start date
        const today = new Date();
        const dayOfWeek = today.getDay();
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - dayOfWeek + 1); // Start from Monday
        weekStart.setHours(0, 0, 0, 0);

        const days: DaySchedule[] = [];

        // Calculate minutes per day
        const totalMinutesPerDay = preferences.dailyStudyHours * 60;
        const sessionsPerDay = Math.min(timeSlots.length, 4);
        const minutesPerSession = Math.floor(totalMinutesPerDay / sessionsPerDay);

        // Categorize subjects by priority
        const weakSubjectIds = new Set(preferences.weakSubjects);
        const strongSubjectIds = new Set(preferences.strongSubjects);

        // Sort subjects: weak first, then neutral, then strong
        const sortedSubjects = [...subjects].sort((a, b) => {
          const aWeak = weakSubjectIds.has(a.id) ? 0 : 1;
          const bWeak = weakSubjectIds.has(b.id) ? 0 : 1;
          if (aWeak !== bWeak) {
            return aWeak - bWeak;
          }
          const aStrong = strongSubjectIds.has(a.id) ? 1 : 0;
          const bStrong = strongSubjectIds.has(b.id) ? 1 : 0;
          return aStrong - bStrong;
        });

        // Generate schedule for each day
        for (let i = 0; i < 7; i++) {
          const dayDate = new Date(weekStart);
          dayDate.setDate(weekStart.getDate() + i);
          const dayOfWeekNum = dayDate.getDay();
          const isRestDay = preferences.restDays.includes(dayOfWeekNum);

          const daySchedule: DaySchedule = {
            date: dayDate.toISOString().split('T')[0],
            dayName: DAY_NAMES[dayOfWeekNum],
            sessions: [],
            totalHours: isRestDay ? 0 : preferences.dailyStudyHours,
            isRestDay,
          };

          if (!isRestDay) {
            // Create study sessions for the day
            const daySubjects = [...sortedSubjects];
            // Shuffle subjects slightly for variety
            for (let j = daySubjects.length - 1; j > 0; j--) {
              const k = Math.floor(Math.random() * (j + 1)) % daySubjects.length;
              [daySubjects[j], daySubjects[k]] = [daySubjects[k], daySubjects[j]];
            }

            // Prioritize weak subjects
            const weakFirst = daySubjects.sort((a, b) => {
              if (weakSubjectIds.has(a.id) && !weakSubjectIds.has(b.id)) {
                return -1;
              }
              if (!weakSubjectIds.has(a.id) && weakSubjectIds.has(b.id)) {
                return 1;
              }
              return 0;
            });

            for (let j = 0; j < sessionsPerDay; j++) {
              const subject = weakFirst[j % weakFirst.length];
              const isWeak = weakSubjectIds.has(subject.id);

              const session: StudySession = {
                id: generateUniqueId('session'),
                subjectId: subject.id,
                subjectName: subject.name,
                startTime: timeSlots[j],
                duration: minutesPerSession,
                questionTarget: Math.floor(
                  (minutesPerSession / 60) * (isWeak ? 20 : 30),
                ), // More questions for strong subjects
                priority: isWeak ? 'high' : strongSubjectIds.has(subject.id) ? 'low' : 'medium',
                completed: false,
              };

              daySchedule.sessions.push(session);
            }
          }

          days.push(daySchedule);
        }

        const schedule: WeeklySchedule = {
          id: generateUniqueId('schedule'),
          userId,
          weekStart: weekStart.toISOString().split('T')[0],
          days,
          preferences,
          createdAt: new Date().toISOString(),
        };

        await saveSchedule(schedule);
        return schedule;
      } finally {
        setIsGenerating(false);
      }
    },
    [saveSchedule],
  );

  // Mark session as completed
  const markSessionCompleted = useCallback(
    async (dayIndex: number, sessionId: string) => {
      if (!currentSchedule) {
        return;
      }

      const updatedSchedule = {...currentSchedule};
      const session = updatedSchedule.days[dayIndex].sessions.find(
        s => s.id === sessionId,
      );
      if (session) {
        session.completed = true;
        await saveSchedule(updatedSchedule);
      }
    },
    [currentSchedule, saveSchedule],
  );

  // Get today's schedule
  const getTodaySchedule = useCallback((): DaySchedule | null => {
    if (!currentSchedule) {
      return null;
    }

    const today = new Date().toISOString().split('T')[0];
    return currentSchedule.days.find(d => d.date === today) || null;
  }, [currentSchedule]);

  // Get schedule progress
  const getScheduleProgress = useCallback(() => {
    if (!currentSchedule) {
      return {completed: 0, total: 0, percentage: 0};
    }

    let completed = 0;
    let total = 0;

    currentSchedule.days.forEach(day => {
      day.sessions.forEach(session => {
        total++;
        if (session.completed) {
          completed++;
        }
      });
    });

    return {
      completed,
      total,
      percentage: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [currentSchedule]);

  return {
    currentSchedule,
    isGenerating,
    loadSchedule,
    generateSchedule,
    markSessionCompleted,
    getTodaySchedule,
    getScheduleProgress,
  };
}
