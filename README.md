# 📄 RE-PORT: Genç İHH Üniversite Teşkilat Raporlama ve Analiz Paneli

Genç İHH’nın farklı illerindeki üniversitelerden gelen haftalık faaliyet ve katılım verilerini tek bir merkezde toplayan, veri kayıplarını önleyen, dinamik, ilişkisel ve hiyerarşik (drill-down) analiz imkânı sunan web tabanlı raporlama platformudur.

---

## 📌 Proje Özeti & Problem Tanımı

### Mevcut Durum
* *Dağınık Yapı*: Üniversite birimlerinden gelen haftalık faaliyet verileri bağımsız, dağınık ve hantal Excel veya basit Airtable şablonları üzerinden toplanmaktadır.
* *Manuel Konsolidasyon*: Genel merkez, bu verileri bir araya getirmek ve anlamlı bir çıktı üretmek için yoğun bir manuel iş gücü harcamaktadır.

### Temel Problemler
* *Yetersiz Rapor Formatı*: Mevcut statik yapılar, saha çalışmalarının derinliğini ve kalitesini yansıtmakta yetersiz kalmaktadır.
* *Eksik Veri Akışı*: Okul bazlı mikro lokasyon verileri ile katılımcı detayları (Hacı Bayram Veli Üni. ve Yıldırım Beyazıt Üni. gibi detaylar) üst raporlama süreçlerinde kaybolmakta, genel merkezin hiyerarşik izleme yapmasını engellemektedir.
* *Kullanıcı Sıkıntısı*: Saha temsilcileri karmaşık, hantal form yapıları nedeniyle veri giriş süreçlerinde boğulmazsa ve sisteme olan motivasyonlarını kaybetmektedir.

### Çözüm (RE-PORT)
* Google AI Studio desteğiyle prototiplenen, kurumsal yeşil-gold temalı, modern *React.js + Vite + Tailwind CSS* frontend arayüzü ile bulut üzerinde koşan esnek ve ilişkisel *Supabase (PostgreSQL)* entegrasyonudur.
* İl sorumluları için veri girişini satır bazlı olarak kolaylaştıran dinamik bir form mimarisi ve Genel Merkez için zaman/metrik filtreli, hiyerarşik (drill-down) analitik dashboard platformudur.

---

## 🛠️ Kullanılan Teknolojiler

* *Frontend & UI*: React.js, Vite, Tailwind CSS
* *AI Tasarım & Kod Asistanı*: Google AI Studio (Bileşen yerleşimleri, dinamik form satır yapıları, grafik motorları ve sayfa geçişleri tamamen AI desteğiyle üretilmiştir)
* *Database & Backend Services*: Supabase (Bulut PostgreSQL ilişkisel veritabanı altyapısı)

### 🎯 Neden Sadece AI Değil de Supabase (Veritabanı)?
1. *Veri Kalıcılığı*: AI Studio statik kod üretir ancak veriyi saklayamaz. Saha sorumlusu "Sisteme Kaydet" butonuna bastığında verilerin kalıcı olarak işlenmesi için bulut veritabanı şarttır.
2. *Hiyerarşik Sorgu Yeteneği*: İl ve üniversitelerin ilişkisel olarak birbiriyle konuşması, zaman filtrelerinin SQL düzeyinde süzülebilmesi için ilişkisel DB mimarisi zorunludur. Sistem esnek bir mimariye sahiptir; veritabanına yeni şehir veya okul eklendikçe arayüz dinamik olarak beslenir.
3. *Rol Tabanlı Erişim*: Giriş ekranında seçilen role (İl Sorumlusu / Genel Merkez) ve şehre göre verilerin anlık filtrelenmesi veritabanındaki dinamik eşleşmelerle sağlanır.

---

## 🚀 Kurulum ve Çalıştırma Adımları

> ⚠️ *Hackathon Teslim Notu*: Projenin kaynak kodları, Hackathon Drive dosyası üzerinde versiyonlanarak mentörlere ve vaka sahiplerine "Zipli Kaynak Kod Paketi" olarak teslim edilmiştir. 

### Projenin Yerelde Çalıştırılması:
1. *Kaynak Kod Paketini Açın*: Mentör ortak drive klasöründen teslim ettiğimiz RE-PORT_Kaynak_Kod.zip dosyasını bilgisayarınıza indirin ve klasöre çıkartın[cite: 1].
2. *Bağımlılıkları Yükleyin*: Projenin ana dizininde terminali açarak gerekli node paketlerini yükleyin:
   npm install
   npm run dev
Proje yerelde http://localhost:5173 adresinde çalışmaya başlayacaktır.

## 🚀 MVP Kapsamı & Sistem Akışı

### 🔑 Rol Tabanlı Giriş
- Kullanıcı girişte *"İl Sorumlusu"* veya *"Genel Merkez"* rolünü seçer.  
- İl sorumlusu girişinde ilgili şehir seçildiğinde, faaliyet formunda sadece o ile ait üniversiteler veritabanından *dinamik olarak çekilir*.  

### 📝 İl Temsilcisi Dinamik Faaliyet Giriş Formu
- *Dinamik Satır Mimarisi*:  
  - Örn: Temsilci lokasyon sayısını *3* seçtiğinde, alt alta otomatik olarak *3 adet dinamik satır* üretilir.  
- *Hata Önleme*:  
  - Her satırda bağımsız bir "Üniversite Seçiniz" dropdown’u ve "Katılım Sayısı" girdi alanı bulunur.  
  - Eski hantal virgüllü metin girişleri tamamen kaldırılmıştır.  

### 📊 Genel Merkez Analitik & Grafik Paneli
- *Dinamik Zaman Filtreleri*: Dönem Seç ve Hafta Seç dropdown bileşenleri ile veriler bulut düzeyinde anlık süzülür.  
- *Metrik Kartları*: Aktif İller, Toplantı Noktaları, Toplantı Katılımı ve Ders Katılımı anlık hesaplanır.  
- *Hiyerarşik Drill-down Tablosu*:  
  - İlk aşamada illerin genel toplamlarını gösterir.  
  - İl ismine tıklandığında, alt satırda o ile ait üniversitelerin katılım detayları otomatik genişler.  
- *Grafiksel Analiz Paneli*:  
  - İller Arası Analiz (*Bar*)  
  - Faaliyet Türü Oranı (*Pasta*)  
  - Üniversite Detayları (*Buton*)  
  - Katılım sayıları grafiklere dinamik yansıtılır.  

---

## 👥 Takım Üyeleri ve Görev Dağılımı

👤 *1. Üye (Tasarım & Web Arayüz Sorumlusu)*  
- Google AI Studio ile arayüz geliştirme 
- Sayfa tasarımının uygulanması
- Sunum hazırlığı 

👤 *2. Üye (Veritabanı Mimarı,)*  
- Supabase bulut veritabanı yapılandırması  
- SQL şeması kurulumu  
- Veri akış yönetimi  

👤 *3. Üye (Süreç Analizi & Dökümantasyon )*  
- Süreç tasarımı
- AI prompt geliştirme  
- Teknik dökümantasyon

---

## 🔗 Proje Bağlantıları (Deliverables)

- *Canlı Demo URL*: (Hazır olduğunda buraya eklenecektir)  
- *Yedek Demo Videosu*: (İnternet kesintisi riskine karşı hazırlanan ekran kaydı)  
- *Teslim Edilen Kaynak Kod (Drive Linki)*: (Mentörle paylaşılan ortak drive klasörü)
