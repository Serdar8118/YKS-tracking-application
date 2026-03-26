// YKS Sınav Türleri ve Dersler

// TYT (Temel Yeterlilik Testi) Dersleri
export interface TYTSubject {
  id: string;
  name: string;
  questionCount: number;
  category: 'turkish' | 'social' | 'math' | 'science';
}

// AYT (Alan Yeterlilik Testi) Dersleri - Sayısal
export interface AYTSayisalSubject {
  id: string;
  name: string;
  questionCount: number;
  category: 'math' | 'physics' | 'chemistry' | 'biology';
}

// AYT (Alan Yeterlilik Testi) Dersleri - Eşit Ağırlık
export interface AYTEsitAgirlikSubject {
  id: string;
  name: string;
  questionCount: number;
  category: 'turkish' | 'math' | 'history' | 'geography';
}

// AYT (Alan Yeterlilik Testi) Dersleri - Sözel
export interface AYTSozelSubject {
  id: string;
  name: string;
  questionCount: number;
  category: 'turkish' | 'history' | 'geography' | 'philosophy';
}

// Çalışma Kaydı
export interface StudyRecord {
  id: string;
  date: string;
  subjectId: string;
  subjectName: string;
  examType: 'TYT' | 'AYT';
  questionsCompleted: number;
  correctAnswers: number;
  wrongAnswers: number;
  emptyAnswers: number;
  studyDuration: number; // dakika
  notes?: string;
}

// Günlük Hedef
export interface DailyGoal {
  id: string;
  date: string;
  targetQuestions: number;
  completedQuestions: number;
  targetStudyHours: number;
  completedStudyHours: number;
  isCompleted: boolean;
}

// Haftalık İstatistik
export interface WeeklyStats {
  weekStart: string;
  totalQuestions: number;
  totalCorrect: number;
  totalWrong: number;
  totalEmpty: number;
  totalStudyHours: number;
  subjectBreakdown: {
    [subjectId: string]: {
      questions: number;
      correct: number;
      wrong: number;
    };
  };
}

// Kullanıcı Profili
export interface UserProfile {
  name: string;
  targetExam: 'TYT' | 'AYT-Sayısal' | 'AYT-Eşit Ağırlık' | 'AYT-Sözel';
  examDate?: string;
  dailyGoal: number; // hedef soru sayısı
  currentStreak: number; // art arda çalışılan gün sayısı
  longestStreak: number;
  totalQuestionsCompleted: number;
}

// TYT Dersleri Sabitleri
export const TYT_SUBJECTS: TYTSubject[] = [
  {id: 'tyt-turkce', name: 'Türkçe', questionCount: 40, category: 'turkish'},
  {
    id: 'tyt-sosyal',
    name: 'Sosyal Bilimler',
    questionCount: 20,
    category: 'social',
  },
  {
    id: 'tyt-matematik',
    name: 'Temel Matematik',
    questionCount: 40,
    category: 'math',
  },
  {id: 'tyt-fen', name: 'Fen Bilimleri', questionCount: 20, category: 'science'},
];

// AYT Sayısal Dersleri
export const AYT_SAYISAL_SUBJECTS: AYTSayisalSubject[] = [
  {id: 'ayt-matematik', name: 'Matematik', questionCount: 40, category: 'math'},
  {id: 'ayt-fizik', name: 'Fizik', questionCount: 14, category: 'physics'},
  {id: 'ayt-kimya', name: 'Kimya', questionCount: 13, category: 'chemistry'},
  {id: 'ayt-biyoloji', name: 'Biyoloji', questionCount: 13, category: 'biology'},
];

// AYT Eşit Ağırlık Dersleri
export const AYT_ESIT_AGIRLIK_SUBJECTS: AYTEsitAgirlikSubject[] = [
  {
    id: 'ayt-edebiyat',
    name: 'Türk Dili ve Edebiyatı',
    questionCount: 24,
    category: 'turkish',
  },
  {id: 'ayt-tarih1', name: 'Tarih-1', questionCount: 10, category: 'history'},
  {
    id: 'ayt-cografya1',
    name: 'Coğrafya-1',
    questionCount: 6,
    category: 'geography',
  },
  {
    id: 'ayt-matematik-ea',
    name: 'Matematik',
    questionCount: 40,
    category: 'math',
  },
];

// AYT Sözel Dersleri
export const AYT_SOZEL_SUBJECTS: AYTSozelSubject[] = [
  {
    id: 'ayt-edebiyat-s',
    name: 'Türk Dili ve Edebiyatı',
    questionCount: 24,
    category: 'turkish',
  },
  {id: 'ayt-tarih1-s', name: 'Tarih-1', questionCount: 10, category: 'history'},
  {
    id: 'ayt-cografya1-s',
    name: 'Coğrafya-1',
    questionCount: 6,
    category: 'geography',
  },
  {id: 'ayt-tarih2', name: 'Tarih-2', questionCount: 11, category: 'history'},
  {
    id: 'ayt-cografya2',
    name: 'Coğrafya-2',
    questionCount: 11,
    category: 'geography',
  },
  {
    id: 'ayt-felsefe',
    name: 'Felsefe Grubu',
    questionCount: 12,
    category: 'philosophy',
  },
  {id: 'ayt-din', name: 'Din Kültürü', questionCount: 6, category: 'philosophy'},
];

// Motivasyon Mesajları
export const MOTIVATION_MESSAGES = [
  'Her soru seni hedefe bir adım daha yaklaştırıyor! 🎯',
  'Bugün harcadığın her dakika, yarınki başarının temelidir! 💪',
  'Düzenli çalışma başarının anahtarıdır! 🔑',
  'Küçük adımlar büyük sonuçlar doğurur! 🚀',
  'Sen yapabilirsin! Hedefe odaklan! 🌟',
  'Başarı, her gün küçük çabalarının toplamıdır! ✨',
  'Vazgeçme, her deneme seni güçlendirir! 💪',
  'Hayallerin gerçek olması için çalış! 🎓',
  'Bugün zorlanıyorsan, yarın güçleniyorsundur! 🌈',
  'Disiplin, motivasyon tükendiğinde seni ayakta tutan şeydir! 🏆',
];

// Kullanıcı Hesabı (Giriş/Kayıt için)
export interface UserAccount {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  points: number;
  level: number;
  achievements: string[];
}

// Haftalık Çalışma Planı
export interface WeeklySchedule {
  id: string;
  userId: string;
  weekStart: string;
  days: DaySchedule[];
  preferences: SchedulePreferences;
  createdAt: string;
}

// Günlük Çalışma Planı
export interface DaySchedule {
  date: string;
  dayName: string;
  sessions: StudySession[];
  totalHours: number;
  isRestDay: boolean;
}

// Çalışma Oturumu
export interface StudySession {
  id: string;
  subjectId: string;
  subjectName: string;
  startTime: string;
  duration: number; // dakika
  questionTarget: number;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

// Çalışma Programı Tercihleri
export interface SchedulePreferences {
  dailyStudyHours: number;
  restDays: number[]; // 0=Pazar, 1=Pazartesi...
  weakSubjects: string[];
  strongSubjects: string[];
  preferredStudyTime: 'morning' | 'afternoon' | 'evening' | 'night';
  focusAreas: string[];
}

// Başarı/Ödül
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsReward: number;
  requirement: AchievementRequirement;
  unlockedAt?: string;
}

// Başarı Gereksinimleri
export interface AchievementRequirement {
  type: 'questions' | 'streak' | 'accuracy' | 'time' | 'level';
  value: number;
}

// Liderlik Tablosu Girişi
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  points: number;
  level: number;
  streak: number;
  totalQuestions: number;
  isCurrentUser?: boolean;
}

// Başarılar Listesi
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-study',
    title: 'İlk Adım',
    description: 'İlk çalışma kaydını oluştur',
    icon: '🎯',
    pointsReward: 10,
    requirement: {type: 'questions', value: 1},
  },
  {
    id: 'hundred-questions',
    title: 'Yüz Soru',
    description: '100 soru çöz',
    icon: '💯',
    pointsReward: 50,
    requirement: {type: 'questions', value: 100},
  },
  {
    id: 'thousand-questions',
    title: 'Bin Soru',
    description: '1000 soru çöz',
    icon: '🏆',
    pointsReward: 200,
    requirement: {type: 'questions', value: 1000},
  },
  {
    id: 'five-thousand-questions',
    title: 'Beş Bin Soru',
    description: '5000 soru çöz',
    icon: '👑',
    pointsReward: 500,
    requirement: {type: 'questions', value: 5000},
  },
  {
    id: 'streak-3',
    title: 'Üç Gün Serisi',
    description: '3 gün üst üste çalış',
    icon: '🔥',
    pointsReward: 30,
    requirement: {type: 'streak', value: 3},
  },
  {
    id: 'streak-7',
    title: 'Haftalık Seri',
    description: '7 gün üst üste çalış',
    icon: '⚡',
    pointsReward: 100,
    requirement: {type: 'streak', value: 7},
  },
  {
    id: 'streak-30',
    title: 'Aylık Seri',
    description: '30 gün üst üste çalış',
    icon: '🌟',
    pointsReward: 500,
    requirement: {type: 'streak', value: 30},
  },
  {
    id: 'accuracy-80',
    title: 'Keskin Nişancı',
    description: '%80 doğruluk oranına ulaş',
    icon: '🎯',
    pointsReward: 100,
    requirement: {type: 'accuracy', value: 80},
  },
  {
    id: 'accuracy-90',
    title: 'Usta',
    description: '%90 doğruluk oranına ulaş',
    icon: '💎',
    pointsReward: 250,
    requirement: {type: 'accuracy', value: 90},
  },
  {
    id: 'study-10h',
    title: '10 Saat Çalışma',
    description: 'Toplam 10 saat çalış',
    icon: '⏰',
    pointsReward: 50,
    requirement: {type: 'time', value: 600},
  },
  {
    id: 'study-50h',
    title: '50 Saat Çalışma',
    description: 'Toplam 50 saat çalış',
    icon: '📚',
    pointsReward: 200,
    requirement: {type: 'time', value: 3000},
  },
  {
    id: 'level-5',
    title: 'Seviye 5',
    description: 'Seviye 5\'e ulaş',
    icon: '⭐',
    pointsReward: 100,
    requirement: {type: 'level', value: 5},
  },
  {
    id: 'level-10',
    title: 'Seviye 10',
    description: 'Seviye 10\'a ulaş',
    icon: '🌙',
    pointsReward: 300,
    requirement: {type: 'level', value: 10},
  },
];

// Seviye Hesaplama
export function calculateLevel(points: number): number {
  // Her seviye için gereken puan: seviye * 100
  let level = 1;
  let requiredPoints = 100;
  let totalRequired = 0;

  while (points >= totalRequired + requiredPoints) {
    totalRequired += requiredPoints;
    level++;
    requiredPoints = level * 100;
  }

  return level;
}

// Sonraki seviye için gereken puan
export function pointsToNextLevel(points: number): {current: number; required: number} {
  const level = calculateLevel(points);
  let totalRequired = 0;
  for (let i = 1; i < level; i++) {
    totalRequired += i * 100;
  }
  const requiredForNext = level * 100;
  const currentProgress = points - totalRequired;

  return {current: currentProgress, required: requiredForNext};
}
