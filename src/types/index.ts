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
