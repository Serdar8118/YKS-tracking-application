# YKS Tracking Application 📚

YKS (Yükseköğretim Kurumları Sınavı) sınavına hazırlık sürecinizi takip etmenizi sağlayan Android mobil uygulaması.

## 🎯 Özellikler

### Sınav Takibi
- **TYT (Temel Yeterlilik Testi)** dersleri takibi
  - Türkçe (40 soru)
  - Sosyal Bilimler (20 soru)
  - Temel Matematik (40 soru)
  - Fen Bilimleri (20 soru)

- **AYT (Alan Yeterlilik Testi)** dersleri takibi
  - Sayısal (Matematik, Fizik, Kimya, Biyoloji)
  - Eşit Ağırlık (Edebiyat, Tarih, Coğrafya, Matematik)
  - Sözel (Edebiyat, Tarih, Coğrafya, Felsefe, Din Kültürü)

### Çalışma Planı Takibi
- �� Günlük çalışma kaydı ekleme
- ✅ Doğru/Yanlış/Boş sayısı takibi
- ⏱️ Çalışma süresi takibi
- 💭 Çalışma notları ekleme

### Motivasyon Özellikleri
- 🎯 Günlük hedef belirleme ve ilerleme takibi
- 🔥 Günlük çalışma serisi (streak) takibi
- 📊 Haftalık ve toplam istatistikler
- ⏰ Sınav geri sayımı
- 💪 Motivasyon mesajları

### İstatistikler
- Günlük özet (doğru, yanlış, boş, başarı oranı)
- Haftalık istatistikler
- Ders bazlı performans analizi
- Toplam çözülen soru sayısı

## 📱 Ekranlar

1. **Ana Sayfa (Dashboard)**: Günlük hedef, istatistikler ve hızlı özet
2. **Çalışma Ekle**: Yeni çalışma kaydı oluşturma
3. **Geçmiş**: Tüm çalışma kayıtlarını görüntüleme ve filtreleme
4. **Profil**: Kullanıcı ayarları ve hedef belirleme

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
- **React Hooks**: State yönetimi

## 📁 Proje Yapısı

```
YKS-tracking-application/
├── android/              # Android native kodu
├── ios/                  # iOS native kodu (kullanılmıyor)
├── src/
│   ├── components/       # Yeniden kullanılabilir bileşenler
│   ├── hooks/           # Custom React hooks
│   │   └── useStudyTracker.ts
│   ├── screens/         # Uygulama ekranları
│   │   ├── DashboardScreen.tsx
│   │   ├── AddStudyScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   └── ProfileScreen.tsx
│   ├── types/           # TypeScript tip tanımları
│   │   └── index.ts
│   └── utils/           # Yardımcı fonksiyonlar
├── App.tsx              # Ana uygulama bileşeni
├── package.json
└── README.md
```

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
