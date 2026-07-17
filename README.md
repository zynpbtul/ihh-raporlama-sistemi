# 📄 RE-PORT: Üniversite Raporlama ve Karne Sistemi

Genç İHH’nın 5 farklı ildeki toplam 25 üniversiteden gelen haftalık faaliyet ve katılım verilerini tek bir merkezde toplayan, ilişkisel ve hiyerarşik (drill-down) analiz imkânı sunan web tabanlı bulut entegrasyonlu raporlama platformu.

---

## 📌 1. Proje Özeti & Problem Tanımı
- **Mevcut Durum:** Üniversite birimlerinden gelen faaliyet verilerinin bağımsız ve dağınık Excel/Airtable şablonları üzerinden manuel olarak konsolide edilmeye çalışılması[cite: 1, 4].
- **Kritik Sorun:** Bölge ve okul bazlı lokasyon verileri ile katılımcı detaylarının (Hacı Bayram Veli Üni. vs. Yıldırım Beyazıt Üni. gibi mikro kırılımlar) üst raporlama süreçlerinde kaybolması[cite: 3]. Genel merkezin verileri haftalık, aylık, dönemlik veya yıllık bazda dinamik izleyememesi ve anlık kurumsal karne çıktıları üretememesi.
- **Kullanıcı Sıkıntısı:** Saha temsilcilerinin mevcut soru-cevap formatındaki hantal form yapıları nedeniyle veri giriş süreçlerinde boğulması ve motivasyon kaybı[cite: 1, 4, 6].
- **Çözüm:** Supabase (PostgreSQL) bulut altyapısı üzerinde kurulan ilişkisel veritabanı, il temsilcileri için tasarlanmış sadece 4 soruluk minimalist bir veri giriş arayüzü ve genel merkez için dinamik zaman filtreli, drill-down analitik dashboard platformu.

---

## 🛠️ 2. Kullanılan Teknolojiler & Mimari
- **Frontend & UI:** React.js, Vite, Tailwind CSS, Shadcn UI
- **Database & Backend Services:** Supabase (Bulut PostgreSQL ilişkisel veritabanı altyapısı ve otomatik API katmanı)
- **Raporlama Motoru:** jsPDF (İstemci/Tarayıcı tarafında sunucu yükü oluşturmadan tek tıkla PDF karne çıktısı üretimi)
- **Geliştirme Araçları:** Google AI Studio (Akıllı kod asistanı olarak kod üretim hızlandırıcısı rolünde kullanılmıştır)

---

## 🔑 3. MVP Kapsamı & İşlevsel Kurallar
- **Veri Sınırları:** Sistem tam olarak 5 il ve her ile bağlı tam olarak 5 üniversite (Toplam 25 kurum) ilişkisel verisiyle sınırlandırılmıştır.
- **Rol Tabanlı Erişim & Simüle Auth:** Giriş yapan kurumsal Gmail adresleri string analizine tabi tutulur[cite: 1]. `[sehir].ilbaskani@gmail.com` (Örn: `ankara.ilbaskani@gmail.com`) formatındaki girişlerde sistem şehri otomatik algılar, kullanıcıyı İl Temsilcisi arayüzüne yönlendirir ve formu sadece o ilin 5 üniversitesiyle kısıtlar[cite: 1]. `merkez@gmail.com` adresi ise tüm illeri gören Genel Merkez Dashboard'unu açar[cite: 1].
- **İl Temsilcisi Giriş Formu (4 Net Soru):**
  1. Üniversite komisyon toplantısını kaç lokasyonda yaptı? (Sayısal)[cite: 1]
  2. Bu lokasyonlara kaçar kişi katıldı? (Girdi Formatı: `"12,15,8"` gibi virgülle ayrılmış string)[cite: 1]
  3. Haftalık dersler kaç lokasyonda yapıldı? (Sayısal)[cite: 1]
  4. Bu lokasyonlara kaçar kişi katıldı? (Girdi Formatı: `"20,25"` gibi virgülle ayrılmış string)[cite: 1]
- **Genel Merkez Analitik Paneli:**
  - Giriş yapıldığı an veritabanındaki en son güncel haftanın (hafta numarası belirterek) rapor tablosunu getirir[cite: 1].
  - **Dinamik Zaman Filtreleri:** Üst menüde yer alan *Aylık*, *Dönemlik (Eylül-Ocak)*, *Dönemlik (Ocak-Mayıs)* ve *Yıllık* butonlarıyla verileri SQL düzeyinde anlık gruplar[cite: 1].
  - **Drill-down Yapısı:** İlk aşamada 5 ilin genel toplamlarını gösterir. Bir ile tıklandığında alt satırda o ile ait 5 üniversitenin lokasyon ve katılım detayları akordeon şeklinde açılır[cite: 1, 5].

---

## 🗄️ 4. Veritabanı Şeması (Database Schema)
Supabase (PostgreSQL) üzerinde koşan veri tabanı mimarisi ilişkisel bütünlük kurallarına göre modellenmiştir:

```sql
-- 1. Şehirler Tablosu (5 İl)
CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- 2. Üniversiteler Tablosu (Her il için 5 Üniversite)
CREATE TABLE universities (
    id SERIAL PRIMARY KEY,
    city_id INT REFERENCES cities(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL
);

-- 3. Üniversite Faaliyet Rapor Tablosu
CREATE TABLE university_reports (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(100) NOT NULL,
    university_id INT REFERENCES universities(id) ON DELETE CASCADE,
    week_number INT NOT NULL,          -- Rapor haftası
    month_number INT NOT NULL,         -- Aylık filtre için (1-12)
    academic_term VARCHAR(20) NOT NULL,-- 'Eyl-Oca' veya 'Oca-May'
    year INT NOT NULL,
    
    meeting_locations_count INT DEFAULT 0,
    meeting_attendance_data TEXT DEFAULT '', -- Örn: '12,15,8'
    
    class_locations_count INT DEFAULT 0,
    class_attendance_data TEXT DEFAULT '',   -- Örn: '20,25'
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

5. Yerel Kurulum Adımları
Prototipi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları sırasıyla uygulayın:

#Projeyi klonlayın:

git clone [https://github.com/RabiaOKUTAN1/RE-PORT.git](https://github.com/RabiaOKUTAN1/RE-PORT.git)
cd RE-PORT

#Bağımlılıkları yükleyin:

npm install

#Supabase ortam değişkenlerini tanımlayın:

Kök dizinde .env dosyası oluşturun ve .env.example dosyasındaki alanları kendi Supabase API anahtarlarınızla doldurun[cite: 1]:

Kod snippet'i
VITE_SUPABASE_URL=Sizin_Supabase_Url_Adresiniz
VITE_SUPABASE_ANON_KEY=Sizin_Supabase_Anon_Key_Degeriniz

#Uygulamayı ayağa kaldırın:

npm run dev

👥 6. Takım Üyeleri ve Görev Dağılımı
👤 1. Üye (Tasarım & Frontend Sorumlusu): UI/UX tasarımı, 4 soruluk form bileşeni, drill-down özellikli analitik dashboard tabloları ve responsive frontend kodlaması[cite: 1, 5, 6].

👤 2. Üye (Veritabanı Mimarı): Supabase bulut veritabanı yapılandırması, SQL şeması kurulumu, 5 il x 5 üniversite seed verilerinin yüklenmesi ve veri akış yönetimi[cite: 1].

👤 3. Üye (DevOps & Sunum Sorumlusu): GitHub repo yönetimi, teknik dökümantasyon, kurumsal sunum dosyası, demo senaryoları ve yedek video süreçlerinin yönetimi[cite: 1, 7].


🔗 7. Proje Bağlantıları (Deliverables)
Canlı Demo URL: [Canlı link hazır olduğunda buraya eklenecektir]

[cite: 1]

Yedek Demo Videosu: [Rehber uyarınca olası internet kesintisi riskine karşı hazırlanan demo video linki]

[cite: 1, 7]


---

### 🟢 Bir Sonraki Aşama
Bu dökümanı repoya ekledikten sonra, **2. Üye (Veritabanı)** yukarıdaki SQL kodunu Supabase'e bas
