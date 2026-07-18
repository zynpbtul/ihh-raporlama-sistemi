/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WEEKS, PROVINCES, PERIODS } from '../mockData';
import { ActivityRecord, ActivityEntry } from '../types';

export const PROVINCE_UNIVERSITIES: Record<string, string[]> = {
  'Ankara': [
    'Ankara Üniversitesi',
    'Orta Doğu Teknik Üniversitesi (ODTÜ)',
    'Hacettepe Üniversitesi',
    'Gazi Üniversitesi',
    'Bilkent Üniversitesi'
  ],
  'İstanbul': [
    'İstanbul Üniversitesi',
    'Boğaziçi Üniversitesi',
    'İstanbul Teknik Üniversitesi',
    'Marmara Üniversitesi',
    'Yıldız Teknik Üniversitesi'
  ],
  'Konya': [
    'Selçuk Üniversitesi',
    'Necmettin Erbakan Üniversitesi',
    'Konya Teknik Üniversitesi',
    'KTO Karatay Üniversitesi',
    'Konya Gıda ve Tarım Üniversitesi'
  ],
  'İzmir': [
    'Ege Üniversitesi',
    'Dokuz Eylül Üniversitesi',
    'İzmir Yüksek Teknoloji Enstitüsü (İYTE)',
    'Yaşar Üniversitesi',
    'İzmir Ekonomi Üniversitesi'
  ],
  'Antalya': [
    'Akdeniz Üniversitesi',
    'Alanya Alaaddin Keykubat Üniversitesi',
    'Antalya Bilim Üniversitesi',
    'Alanya Üniversitesi',
    'Antalya Belek Üniversitesi'
  ]
};

interface ProvinceFormProps {
  province: string;
  onSaveRecords: (records: ActivityRecord[]) => void;
  onLogout: () => void;
  provinceUniversities?: Record<string, string[]>;
}

export default function ProvinceForm({ province, onSaveRecords, onLogout, provinceUniversities }: ProvinceFormProps) {
  const resolvedUnivs = provinceUniversities || PROVINCE_UNIVERSITIES;
  const [selectedWeek, setSelectedWeek] = useState('1. Hafta');
  const [selectedPeriod, setSelectedPeriod] = useState('1. Dönem (Eylül-Ocak)');
  
  // Dynamic entry states
  const [meetingLocationCount, setMeetingLocationCount] = useState<number>(1);
  const [meetingEntries, setMeetingEntries] = useState<ActivityEntry[]>([
    { id: 'm-1', universityName: '', attendanceCount: 0 }
  ]);

  const [lessonLocationCount, setLessonLocationCount] = useState<number>(1);
  const [lessonEntries, setLessonEntries] = useState<ActivityEntry[]>([
    { id: 'l-1', universityName: '', attendanceCount: 0 }
  ]);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Update meeting entry fields when location count changes
  useEffect(() => {
    setMeetingEntries((prev) => {
      const currentCount = prev.length;
      if (meetingLocationCount > currentCount) {
        // Add more
        const additional = Array.from({ length: meetingLocationCount - currentCount }).map((_, i) => ({
          id: `m-${currentCount + i + 1}-${Date.now()}`,
          universityName: '',
          attendanceCount: 0,
        }));
        return [...prev, ...additional];
      } else if (meetingLocationCount < currentCount) {
        // Truncate
        return prev.slice(0, meetingLocationCount);
      }
      return prev;
    });
  }, [meetingLocationCount]);

  // Update lesson entry fields when location count changes
  useEffect(() => {
    setLessonEntries((prev) => {
      const currentCount = prev.length;
      if (lessonLocationCount > currentCount) {
        // Add more
        const additional = Array.from({ length: lessonLocationCount - currentCount }).map((_, i) => ({
          id: `l-${currentCount + i + 1}-${Date.now()}`,
          universityName: '',
          attendanceCount: 0,
        }));
        return [...prev, ...additional];
      } else if (lessonLocationCount < currentCount) {
        // Truncate
        return prev.slice(0, lessonLocationCount);
      }
      return prev;
    });
  }, [lessonLocationCount]);

  const handleMeetingChange = (index: number, field: keyof ActivityEntry, value: string | number) => {
    setMeetingEntries((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value,
      };
      return copy;
    });
  };

  const handleLessonChange = (index: number, field: keyof ActivityEntry, value: string | number) => {
    setLessonEntries((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        [field]: value,
      };
      return copy;
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    const formattedRecords: ActivityRecord[] = [];
    const todayStr = new Date().toISOString().split('T')[0];

    // Meetings
    meetingEntries.forEach((entry) => {
      if (entry.universityName.trim()) {
        formattedRecords.push({
          id: `rec-m-${Math.random().toString(36).substring(2, 9)}`,
          province,
          period: selectedPeriod,
          week: selectedWeek,
          activityType: 'meeting',
          universityName: entry.universityName.trim(),
          attendanceCount: Number(entry.attendanceCount) || 0,
          date: todayStr,
        });
      }
    });

    // Lessons
    lessonEntries.forEach((entry) => {
      if (entry.universityName.trim()) {
        formattedRecords.push({
          id: `rec-l-${Math.random().toString(36).substring(2, 9)}`,
          province,
          period: selectedPeriod,
          week: selectedWeek,
          activityType: 'lesson',
          universityName: entry.universityName.trim(),
          attendanceCount: Number(entry.attendanceCount) || 0,
          date: todayStr,
        });
      }
    });

    onSaveRecords(formattedRecords);
    
    // Show quick elegant alert within page
    setSuccessMessage('Güncel hafta başarıyla kaydedildi!');
    setTimeout(() => {
      setSuccessMessage(null);
    }, 4000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Top Bar Info */}
      <div className="flex items-center justify-between border-b border-emerald-600/20 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-ihh-green text-white px-2.5 py-0.5 rounded-full font-bold shadow-xs">
            İl Teşkilatı
          </span>
          <span className="text-sm font-extrabold text-ihh-green uppercase tracking-wide">{province} İLİ</span>
        </div>
        <button
          onClick={onLogout}
          id="logout-btn-form"
          className="text-xs font-semibold text-red-600 border border-red-200 bg-white/60 px-3 py-1 hover:bg-red-50 rounded shadow-xs transition-colors"
        >
          Oturumu Kapat
        </button>
      </div>

      <div className="bg-white border border-emerald-600/10 rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-ihh-green to-ihh-olive h-1.5 w-full" />
        <div className="p-6">
          <h2 className="text-lg font-extrabold text-ihh-green border-b border-emerald-100 pb-2 mb-4 uppercase tracking-wide">
            Faaliyet Giriş Formu
          </h2>

          {/* Success Banner */}
          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded font-medium shadow-xs">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* FORM 1: Üniversite Komisyon Toplantısı */}
          <div className="border border-emerald-600/20 bg-emerald-50/10 rounded-lg p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-emerald-100 pb-2 mb-4">
              <h3 className="text-xs font-extrabold text-ihh-green uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-ihh-green inline-block"></span>
                1. Üniversite Komisyon Toplantısı
              </h3>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <label htmlFor="meeting-locations" className="text-xs text-gray-600">Kaç lokasyonda yapıldı?</label>
                <select
                  id="meeting-locations"
                  value={meetingLocationCount}
                  onChange={(e) => setMeetingLocationCount(Number(e.target.value))}
                  className="p-1.5 border border-emerald-600/20 text-xs bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-ihh-green w-16 shadow-2xs"
                >
                  {Array.from({ length: 11 }).map((_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {meetingLocationCount === 0 ? (
              <p className="text-xs text-gray-400 italic py-2">Faaliyet yapılmadı.</p>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-gray-500 pb-1 border-b border-gray-100 hidden sm:grid">
                  <div className="col-span-1">No</div>
                  <div className="col-span-8">Üniversite Adı</div>
                  <div className="col-span-3 text-right">Katılım Sayısı</div>
                </div>

                {meetingEntries.map((entry, index) => {
                  const uniOptions = resolvedUnivs[province] || [];
                  const isPredefined = uniOptions.includes(entry.universityName);
                  const isOtherSelected = entry.universityName === 'Diğer';
                  const showCustomInput = isOtherSelected || (entry.universityName !== '' && !isPredefined);

                  return (
                    <div key={entry.id} className="grid grid-cols-12 gap-3 items-start border-b border-gray-50 pb-3 sm:pb-0 sm:border-0">
                      <div className="col-span-12 sm:col-span-1 text-xs text-gray-500 font-medium pt-2">
                        #{index + 1}
                      </div>
                      <div className="col-span-12 sm:col-span-8 flex flex-col gap-1.5">
                        <select
                          id={`meeting-uni-select-${index}`}
                          required
                          value={isPredefined ? entry.universityName : (entry.universityName ? 'Diğer' : '')}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'Diğer') {
                              handleMeetingChange(index, 'universityName', 'Diğer');
                            } else {
                              handleMeetingChange(index, 'universityName', val);
                            }
                          }}
                          className="w-full text-xs p-2 border border-emerald-600/10 rounded-md bg-white focus:outline-none focus:border-ihh-green focus:ring-1 focus:ring-ihh-green shadow-2xs transition-all"
                        >
                          <option value="">-- Üniversite Seçiniz --</option>
                          {uniOptions.map((uni) => (
                            <option key={uni} value={uni}>
                              {uni}
                            </option>
                          ))}
                          <option value="Diğer">Diğer (Listede Yok - Elle Yaz)</option>
                        </select>

                        {showCustomInput && (
                          <input
                            id={`meeting-uni-custom-${index}`}
                            type="text"
                            required
                            placeholder="Üniversite adını buraya yazınız..."
                            value={entry.universityName === 'Diğer' ? '' : entry.universityName}
                            onChange={(e) => handleMeetingChange(index, 'universityName', e.target.value)}
                            className="w-full text-xs p-2 border border-emerald-600/20 rounded-md bg-white focus:outline-none focus:border-ihh-green focus:ring-1 focus:ring-ihh-green shadow-2xs transition-all"
                          />
                        )}
                      </div>
                      <div className="col-span-12 sm:col-span-3 pt-0 sm:pt-0">
                        <input
                          id={`meeting-att-${index}`}
                          type="number"
                          min="0"
                          required
                          placeholder="Katılım"
                          value={entry.attendanceCount || ''}
                          onChange={(e) => handleMeetingChange(index, 'attendanceCount', Number(e.target.value))}
                          className="w-full text-xs p-2 border border-emerald-600/10 rounded-md bg-white focus:outline-none focus:border-ihh-green focus:ring-1 focus:ring-ihh-green text-right shadow-2xs transition-all"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* FORM 2: Haftalık Ders */}
          <div className="border border-ihh-olive/20 bg-ihh-olive-light/20 rounded-lg p-5 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-ihh-olive/20 pb-2 mb-4">
              <h3 className="text-xs font-extrabold text-ihh-olive uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-ihh-olive inline-block"></span>
                2. Haftalık Ders
              </h3>
              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <label htmlFor="lesson-locations" className="text-xs text-gray-600">Kaç lokasyonda yapıldı?</label>
                <select
                  id="lesson-locations"
                  value={lessonLocationCount}
                  onChange={(e) => setLessonLocationCount(Number(e.target.value))}
                  className="p-1.5 border border-emerald-600/20 text-xs bg-white rounded-md focus:outline-none focus:ring-1 focus:ring-ihh-olive w-16 shadow-2xs"
                >
                  {Array.from({ length: 11 }).map((_, i) => (
                    <option key={i} value={i}>
                      {i}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {lessonLocationCount === 0 ? (
              <p className="text-xs text-gray-400 italic py-2">Faaliyet yapılmadı.</p>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-3 text-xs font-semibold text-gray-500 pb-1 border-b border-gray-100 hidden sm:grid">
                  <div className="col-span-1">No</div>
                  <div className="col-span-8">Üniversite Adı</div>
                  <div className="col-span-3 text-right">Katılım Sayısı</div>
                </div>

                {lessonEntries.map((entry, index) => {
                  const uniOptions = resolvedUnivs[province] || [];
                  const isPredefined = uniOptions.includes(entry.universityName);
                  const isOtherSelected = entry.universityName === 'Diğer';
                  const showCustomInput = isOtherSelected || (entry.universityName !== '' && !isPredefined);

                  return (
                    <div key={entry.id} className="grid grid-cols-12 gap-3 items-start border-b border-gray-50 pb-3 sm:pb-0 sm:border-0">
                      <div className="col-span-12 sm:col-span-1 text-xs text-gray-500 font-medium pt-2">
                        #{index + 1}
                      </div>
                      <div className="col-span-12 sm:col-span-8 flex flex-col gap-1.5">
                        <select
                          id={`lesson-uni-select-${index}`}
                          required
                          value={isPredefined ? entry.universityName : (entry.universityName ? 'Diğer' : '')}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (val === 'Diğer') {
                              handleLessonChange(index, 'universityName', 'Diğer');
                            } else {
                              handleLessonChange(index, 'universityName', val);
                            }
                          }}
                          className="w-full text-xs p-2 border border-emerald-600/10 rounded-md bg-white focus:outline-none focus:border-ihh-olive focus:ring-1 focus:ring-ihh-olive shadow-2xs transition-all"
                        >
                          <option value="">-- Üniversite Seçiniz --</option>
                          {uniOptions.map((uni) => (
                            <option key={uni} value={uni}>
                              {uni}
                            </option>
                          ))}
                          <option value="Diğer">Diğer (Listede Yok - Elle Yaz)</option>
                        </select>

                        {showCustomInput && (
                          <input
                            id={`lesson-uni-custom-${index}`}
                            type="text"
                            required
                            placeholder="Üniversite adını buraya yazınız..."
                            value={entry.universityName === 'Diğer' ? '' : entry.universityName}
                            onChange={(e) => handleLessonChange(index, 'universityName', e.target.value)}
                            className="w-full text-xs p-2 border border-emerald-600/20 rounded-md bg-white focus:outline-none focus:border-ihh-olive focus:ring-1 focus:ring-ihh-olive shadow-2xs transition-all"
                          />
                        )}
                      </div>
                      <div className="col-span-12 sm:col-span-3 pt-0 sm:pt-0">
                        <input
                          id={`lesson-att-${index}`}
                          type="number"
                          min="0"
                          required
                          placeholder="Katılım"
                          value={entry.attendanceCount || ''}
                          onChange={(e) => handleLessonChange(index, 'attendanceCount', Number(e.target.value))}
                          className="w-full text-xs p-2 border border-emerald-600/10 rounded-md bg-white focus:outline-none focus:border-ihh-olive focus:ring-1 focus:ring-ihh-olive text-right shadow-2xs transition-all"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SAVE BUTTON ONLY */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              id="save-report-btn"
              className="px-8 py-2.5 bg-gradient-to-r from-ihh-green to-ihh-olive text-white text-xs font-bold uppercase tracking-wider rounded-md hover:opacity-95 active:scale-[0.99] transition-all focus:outline-none shadow-md hover:shadow-lg"
            >
              Verileri Sisteme Kaydet
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
