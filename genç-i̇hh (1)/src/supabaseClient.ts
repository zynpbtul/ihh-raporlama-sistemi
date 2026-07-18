/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { ActivityRecord } from './types';

const supabaseUrl = 'https://xmmrmkswiebhcowdznsl.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtbXJta3N3aWViaGNvd2R6bnNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyODQ5MzMsImV4cCI6MjA5OTg2MDkzM30.LAsDz0J4kcOwtHK0fYGyNB9QiQauAPxG0Aqx9h7Zqws';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper interface for table structures
export interface SupabaseProvinceInfo {
  provinces: string[];
  universities: Record<string, string[]>;
}

/**
 * 1. DİNAMİK GİRİŞ KONTROLÜ (kullanicilar tablosu)
 * E-posta, şifre ve rolün doğruluğunu kontrol eder.
 * Veritabanında tablo yoksa ya da boşsa güvenli şekilde geri dönüş yapar.
 */
export async function authenticateUser(email: string, password: string, role: string): Promise<{ success: boolean; province?: string; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('kullanicilar')
      .select('*');

    if (error) {
      console.warn('kullanicilar tablosu sorgulanırken hata alındı, varsayılan giriş kullanılacak:', error.message);
      return { success: true }; // Geriye dönük uyumluluk için tablo yoksa girişe izin ver
    }

    if (!data || data.length === 0) {
      return { success: true }; // Boşsa da demo modunda girişe izin ver
    }

    // Doğru kullanıcıyı ara (kolon isimleri 'email'/'e_posta', 'sifre'/'parola' ve 'rol'/'role' olabilir)
    const user = data.find((u: any) => {
      const uEmail = (u.email || u.e_posta || '').toLowerCase();
      const uPassword = u.sifre || u.parola || u.password || '';
      const uRole = u.rol || u.role || '';

      return uEmail === email.toLowerCase() && uPassword === password && uRole === role;
    });

    if (user) {
      return {
        success: true,
        province: user.sehir || user.il || user.sehir_adi || undefined
      };
    }

    return {
      success: false,
      error: 'E-posta, şifre veya rol hatalı.'
    };
  } catch (err: any) {
    console.error('Kullanıcı doğrulama hatası:', err);
    return { success: true }; // Herhangi bir hata durumunda demo modunda devam edebilsin
  }
}

/**
 * 2. ŞEHİRLER VE ÜNİVERSİTELER LİSTESİNİ ÇEKME (sehirler ve universiteler tabloları)
 * Supabase üzerindeki sehirler ve universiteler tablolarından verileri çeker.
 * Herhangi bir hata durumunda null döner, böylece mockData.ts dosyasındaki yedek listeler kullanılır.
 */
export async function fetchProvincesAndUniversities(): Promise<SupabaseProvinceInfo | null> {
  try {
    // 1. Şehirleri çek
    const { data: citiesData, error: citiesError } = await supabase
      .from('sehirler')
      .select('*');
    
    if (citiesError) throw citiesError;

    // 2. Üniversiteleri çek
    const { data: univsData, error: univsError } = await supabase
      .from('universiteler')
      .select('*');

    if (univsError) throw univsError;

    if (!citiesData || citiesData.length === 0) return null;

    // Şehir adlarını listele
    const provinces = citiesData
      .map((c: any) => c.sehir_adi || c.sehir || c.ad || c.name || '')
      .filter(Boolean);

    // Üniversiteleri şehirlere göre grupla
    const universities: Record<string, string[]> = {};
    
    // Şehir id'si ile şehir adı eşleştirmesi oluştur
    const cityMap: Record<string | number, string> = {};
    citiesData.forEach((c: any) => {
      const name = c.sehir_adi || c.sehir || c.ad || c.name || '';
      if (c.id !== undefined && name) {
        cityMap[c.id] = name;
      }
    });

    (univsData || []).forEach((u: any) => {
      const uName = u.universite_adi || u.universite || u.ad || u.name || '';
      let cityName = u.sehir_adi || u.sehir || '';

      if (!cityName && u.sehir_id !== undefined) {
        cityName = cityMap[u.sehir_id] || '';
      }

      if (cityName && uName) {
        if (!universities[cityName]) {
          universities[cityName] = [];
        }
        if (!universities[cityName].includes(uName)) {
          universities[cityName].push(uName);
        }
      }
    });

    return {
      provinces: provinces.length > 0 ? provinces : [],
      universities
    };
  } catch (err) {
    console.error('Supabase şehir/üniversite verileri çekilemedi. Yedek veriler kullanılacak:', err);
    return null;
  }
}

/**
 * 3. RAPOR VE RAPOR DETAYLARINI KAYDETME (raporlar ve rapor_detaylari tabloları)
 * Belirli bir il, dönem ve hafta için tüm kayıtları kaydeder.
 * Önce 'raporlar' tablosuna ana rapor kaydı ekler/günceller,
 * ardından bu rapora bağlı tüm detayları 'rapor_detaylari' tablosuna kaydeder.
 */
export async function saveReportToSupabase(
  province: string,
  period: string,
  week: string,
  records: ActivityRecord[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    // Önce aynı il, dönem ve hafta için eski bir rapor var mı kontrol et
    const { data: existingReports, error: findError } = await supabase
      .from('raporlar')
      .select('id')
      .or(`sehir.eq."${province}",il.eq."${province}"`)
      .or(`donem.eq."${period}",dönem.eq."${period}"`)
      .eq('hafta', week);

    if (findError) {
      console.warn('Mevcut rapor aranırken hata oluştu:', findError.message);
    }

    let reportId: any = null;

    if (existingReports && existingReports.length > 0) {
      reportId = existingReports[0].id;
      // Eski detayları temizle
      const { error: deleteDetailsError } = await supabase
        .from('rapor_detaylari')
        .delete()
        .eq('rapor_id', reportId);
      
      if (deleteDetailsError) {
        console.warn('Eski rapor detayları silinemedi:', deleteDetailsError.message);
      }
    } else {
      // Yeni rapor oluştur
      const insertData: any = {};
      
      // Esnek kolon eşleşmeleri
      insertData.sehir = province;
      insertData.il = province;
      insertData.donem = period;
      insertData.dönem = period;
      insertData.hafta = week;
      insertData.tarih = todayStr;
      insertData.date = todayStr;

      // Tablonun hangi alanları desteklediğini tahmin etmek için güvenli ekleme dene
      const { data: newReport, error: insertError } = await supabase
        .from('raporlar')
        .insert([insertData])
        .select('id')
        .single();

      if (insertError) {
        // Eğer yukarısı hata verirse, sadece var olabilecek en standart kolonlarla dene
        const fallbackInsert = {
          sehir: province,
          donem: period,
          hafta: week,
          tarih: todayStr
        };
        const { data: fallbackReport, error: fallbackError } = await supabase
          .from('raporlar')
          .insert([fallbackInsert])
          .select('id')
          .single();

        if (fallbackError) {
          throw fallbackError;
        }
        reportId = fallbackReport?.id;
      } else {
        reportId = newReport?.id;
      }
    }

    if (!reportId) {
      throw new Error('Rapor ID oluşturulamadı.');
    }

    // Detayları 'rapor_detaylari' tablosuna ekle
    if (records.length > 0) {
      const detailsToInsert = records.map((rec) => {
        return {
          rapor_id: reportId,
          universite_adi: rec.universityName,
          katilim_sayisi: rec.attendanceCount,
          faaliyet_turu: rec.activityType, // 'meeting' veya 'lesson'
          tarih: todayStr
        };
      });

      const { error: detailsError } = await supabase
        .from('rapor_detaylari')
        .insert(detailsToInsert);

      if (detailsError) {
        // Kolon adı faaliyet_turu veya katilim_sayisi yerine ingilizce olabilir, fallback deneyelim
        const fallbackDetails = records.map((rec) => {
          return {
            rapor_id: reportId,
            universite: rec.universityName,
            katilim: rec.attendanceCount,
            tur: rec.activityType,
            date: todayStr
          };
        });

        const { error: fallbackDetailsError } = await supabase
          .from('rapor_detaylari')
          .insert(fallbackDetails);

        if (fallbackDetailsError) {
          throw detailsError; // İlk hatayı fırlat
        }
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error('Rapor Supabase kaydedilirken hata:', err);
    return { success: false, error: err.message };
  }
}

/**
 * 4. GENEL MERKEZ RAPOR EKRANI (raporlar ve rapor_detaylari birleşimi)
 * Veritabanındaki tüm raporları ve bunlara bağlı detayları çekerek birleştirir.
 */
export async function fetchAllActivityRecords(): Promise<ActivityRecord[] | null> {
  try {
    // 1. Tüm raporları çek
    const { data: reports, error: reportsError } = await supabase
      .from('raporlar')
      .select('*');

    if (reportsError) throw reportsError;

    // 2. Tüm rapor detaylarını çek
    const { data: details, error: detailsError } = await supabase
      .from('rapor_detaylari')
      .select('*');

    if (detailsError) throw detailsError;

    if (!reports || reports.length === 0) return [];

    // Detayları raporlar ile birleştir
    const formattedRecords: ActivityRecord[] = [];

    (details || []).forEach((det: any) => {
      // Raporu bul
      const rep = reports.find((r: any) => r.id === det.rapor_id);
      if (rep) {
        const province = rep.sehir || rep.il || '';
        const period = rep.donem || rep.dönem || '';
        const week = rep.hafta || '';
        const activityType = det.faaliyet_turu || det.tur || det.activityType || 'meeting';
        const universityName = det.universite_adi || det.universite || det.universityName || '';
        const attendanceCount = Number(det.katilim_sayisi || det.katilim || det.attendanceCount || 0);
        const date = det.tarih || det.date || rep.tarih || rep.date || '';

        formattedRecords.push({
          id: det.id?.toString() || `supabase-rec-${Math.random()}`,
          province,
          period,
          week,
          activityType,
          universityName,
          attendanceCount,
          date
        });
      }
    });

    return formattedRecords;
  } catch (err) {
    console.error('Supabase rapor kayıtları çekilemedi:', err);
    return null;
  }
}
