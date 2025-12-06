# YKS Tracking Application 📚

YKS (Yükseköğretim Kurumları Sınavı) sınavına hazırlık sürecinizi takip etmenizi sağlayan Android mobil uygulaması.

## 🎯 Özellikler

### 🔐 Kullanıcı Hesap Sistemi
- Kayıt ve giriş yapma
- Kullanıcı profili yönetimi
- Güvenli oturum yönetimi

### 🤖 AI Çalışma Programı
- Yapay zeka destekli haftalık çalışma programı oluşturma
- Kişiselleştirilmiş ders planlaması
- Zayıf ve güçlü derslere göre önceliklendirme
- Tercih edilen çalışma saatlerine göre program
- Dinlenme günleri belirleme
- Program ilerleme takibi

### 📊 Sınav Takibi
- **TYT (Temel Yeterlilik Testi)** dersleri takibi
  - Türkçe (40 soru)
  - Sosyal Bilimler (20 soru)
  - Temel Matematik (40 soru)
  - Fen Bilimleri (20 soru)

- **AYT (Alan Yeterlilik Testi)** dersleri takibi
  - Sayısal (Matematik, Fizik, Kimya, Biyoloji)
  - Eşit Ağırlık (Edebiyat, Tarih, Coğrafya, Matematik)
  - Sözel (Edebiyat, Tarih, Coğrafya, Felsefe, Din Kültürü)

### 🏆 Liderlik Tablosu & Puan Sistemi
- Kullanıcılar arası sıralama
- Puan kazanma sistemi (soru çözme, doğru cevap bonusu)
- Seviye atlama sistemi
- Global liderlik tablosu

### 🏅 Başarılar & Rozetler
- 13 farklı başarı rozeti
- Soru çözme başarıları
- Seri (streak) başarıları
- Doğruluk oranı başarıları
- Çalışma süresi başarıları
- Seviye başarıları
- Rozet puanı ödülleri

### 📝 Çalışma Planı Takibi
- 📝 Günlük çalışma kaydı ekleme
- ✅ Doğru/Yanlış/Boş sayısı takibi
- ⏱️ Çalışma süresi takibi
- 💭 Çalışma notları ekleme

### �� Motivasyon Özellikleri
- 🎯 Günlük hedef belirleme ve ilerleme takibi
- 🔥 Günlük çalışma serisi (streak) takibi
- 📊 Haftalık ve toplam istatistikler
- ⏰ Sınav geri sayımı
- 💪 Motivasyon mesajları

### ✨ Animasyonlar
- Akıcı geçiş animasyonları
- Etkileşimli buton animasyonları
- Liste animasyonları
- İlerleme çubuğu animasyonları
- Giriş ekranı animasyonları

## 📱 Ekranlar

1. **Giriş/Kayıt**: Kullanıcı hesap yönetimi
2. **Ana Sayfa (Dashboard)**: Günlük hedef, istatistikler ve hızlı özet
3. **AI Program**: Yapay zeka destekli haftalık çalışma programı
4. **Çalışma Ekle**: Yeni çalışma kaydı oluşturma
5. **Geçmiş**: Tüm çalışma kayıtlarını görüntüleme ve filtreleme
6. **Liderlik Tablosu**: Kullanıcı sıralaması
7. **Başarılar**: Rozetler ve ilerleme
8. **Profil**: Kullanıcı ayarları ve hedef belirleme

## 🚀 Kurulum

### Gereksinimler
- Node.js (v20 veya üzeri)
- React Native CLI
- Android Studio (Android geliştirme için)
- JDK 17

### Adımlar

1. Repoyu klonlayın:
```bash
git clone https://github.com/Serdar8118/YKS-tracking-application.git
cd YKS-tracking-application
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Android için çalıştırın:
```bash
npx react-native run-android
```

## 🛠️ Teknolojiler

- **React Native**: Mobil uygulama geliştirme
- **TypeScript**: Tip güvenli kod yazımı
- **AsyncStorage**: Yerel veri saklama
- **React Native Reanimated**: Akıcı animasyonlar
- **React Hooks**: State yönetimi

## 📁 Proje Yapısı

```
YKS-tracking-application/
├── android/              # Android native kodu
├── ios/                  # iOS native kodu (kullanılmıyor)
├── src/
│   ├── hooks/           # Custom React hooks
│   │   ├── useStudyTracker.ts    # Çalışma takibi
│   │   ├── useAuth.ts            # Kimlik doğrulama
│   │   └── useAISchedule.ts      # AI program oluşturucu
│   ├── screens/         # Uygulama ekranları
│   │   ├── AuthScreen.tsx        # Giriş/Kayıt
│   │   ├── DashboardScreen.tsx   # Ana sayfa
│   │   ├── AIScheduleScreen.tsx  # AI program
│   │   ├── AddStudyScreen.tsx    # Çalışma ekle
│   │   ├── HistoryScreen.tsx     # Geçmiş
│   │   ├── LeaderboardScreen.tsx # Liderlik tablosu
│   │   ├── AchievementsScreen.tsx # Başarılar
│   │   └── ProfileScreen.tsx     # Profil
│   └── types/           # TypeScript tip tanımları
│       └── index.ts
├── App.tsx              # Ana uygulama bileşeni
├── package.json
└── README.md
```

## 🎮 Puan Sistemi

| Aksiyon | Puan |
|---------|------|
| Soru çözme | +1 puan/soru |
| Doğru cevap | +0.5 bonus puan |
| Günlük seri | +10 puan/gün |
| Başarı rozeti | +10-500 puan |

## 📄 Lisans

Bu proje Apache License 2.0 altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakınız.

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/yeni-ozellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik eklendi'`)
4. Branch'inizi push edin (`git push origin feature/yeni-ozellik`)
5. Pull Request oluşturun

## 📞 İletişim

Sorularınız veya önerileriniz için issue açabilirsiniz.

---

**Başarılar! 🎓**
