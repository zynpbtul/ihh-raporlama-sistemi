/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PERIODS, WEEKS, PROVINCES } from '../mockData';
import { ActivityRecord } from '../types';
import { MapPin, Building2, Users, BookOpen, BarChart3, PieChart as PieIcon, ChevronRight, Sparkles, RefreshCw, AlertCircle, TrendingUp } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface HqReportProps {
  records: ActivityRecord[];
  onLogout: () => void;
  provinces?: string[];
}

export default function HqReport({ records, onLogout, provinces }: HqReportProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('1. Dönem (Eylül-Ocak)');
  const [selectedWeek, setSelectedWeek] = useState('1. Hafta');

  // Interactive UI states
  const [focusedProvince, setFocusedProvince] = useState<string | null>(null);
  
  // Track which Level 1 details are expanded per province.
  // We can track this using: 'province-meeting' or 'province-lesson' keys.
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  // Track which Level 2 university details are expanded.
  // We can track this using 'province-activityType-universityName' keys.
  const [expandedUniversities, setExpandedUniversities] = useState<Record<string, boolean>>({});

  // Tab & Chart related states
  const [activeTab, setActiveTab] = useState<'table' | 'charts'>('table');
  const [chartType, setChartType] = useState<'provinces' | 'pie' | 'universities'>('provinces');
  const [chartMetric, setChartMetric] = useState<'attendance' | 'locations'>('attendance');
  const [chartProvince, setChartProvince] = useState<string>('');

  // Reset focus and expansion states when filters change
  const handleFilterChange = (type: 'period' | 'week', value: string) => {
    if (type === 'period') setSelectedPeriod(value);
    if (type === 'week') setSelectedWeek(value);
    setFocusedProvince(null);
    setExpandedDetails({});
    setExpandedUniversities({});
  };

  // Helper to filter records based on period and week
  const currentRecords = records.filter(
    (r) => r.period === selectedPeriod && r.week === selectedWeek
  );

  // Group records by Province for the main table
  const provincesInDb = provinces || PROVINCES;

  // Build the data array for each province
  const provinceSummaries = provincesInDb.map((prov) => {
    const provRecords = currentRecords.filter((r) => r.province === prov);
    const meetings = provRecords.filter((r) => r.activityType === 'meeting' && r.attendanceCount > 0);
    const lessons = provRecords.filter((r) => r.activityType === 'lesson' && r.attendanceCount > 0);

    return {
      province: prov,
      meetings,
      lessons,
      meetingLocationsCount: meetings.length,
      meetingTotalAttendance: meetings.reduce((sum, r) => sum + r.attendanceCount, 0),
      lessonLocationsCount: lessons.length,
      lessonTotalAttendance: lessons.reduce((sum, r) => sum + r.attendanceCount, 0),
    };
  }).filter((s) => s.meetingLocationsCount > 0 || s.lessonLocationsCount > 0);

  // Handle Province Name Click:
  // Isolate the table to show ONLY this province, and AUTO-EXPAND all its level-1 details (meetings and lessons).
  const handleProvinceClick = (province: string) => {
    if (focusedProvince === province) {
      // Toggle off
      setFocusedProvince(null);
      setExpandedDetails({});
    } else {
      // Focus on this province and expand both meetings and lessons
      setFocusedProvince(province);
      setExpandedDetails({
        [`${province}-meeting`]: true,
        [`${province}-lesson`]: true,
      });
    }
    // Collapse Level 2 on change
    setExpandedUniversities({});
  };

  const toggleDetail = (key: string) => {
    setExpandedDetails((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleUniversityDetail = (key: string) => {
    setExpandedUniversities((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Filter summaries if a province is isolated/focused
  const displayedSummaries = focusedProvince
    ? provinceSummaries.filter((s) => s.province === focusedProvince)
    : provinceSummaries;

  // Compute stats for selected period and week
  const activeProvincesCount = provinceSummaries.filter(
    (s) => s.meetings.length > 0 || s.lessons.length > 0
  ).length;

  const totalMeetingLocations = provinceSummaries.reduce(
    (sum, s) => sum + s.meetingLocationsCount, 0
  );

  const totalMeetingAttendance = provinceSummaries.reduce(
    (sum, s) => sum + s.meetingTotalAttendance, 0
  );

  const totalLessonAttendance = provinceSummaries.reduce(
    (sum, s) => sum + s.lessonTotalAttendance, 0
  );

  const totalLessonLocations = provinceSummaries.reduce(
    (sum, s) => sum + s.lessonLocationsCount, 0
  );

  // --- CHART DATA PREPARATIONS ---
  // 1. Chart Data: Provinces Comparison
  const chartProvincesData = provinceSummaries
    .filter((s) => s.meetingLocationsCount > 0 || s.lessonLocationsCount > 0)
    .map((s) => ({
      name: s.province,
      'Toplantı Katılımı': s.meetingTotalAttendance,
      'Ders Katılımı': s.lessonTotalAttendance,
      'Toplantı Lokasyonu': s.meetingLocationsCount,
      'Ders Lokasyonu': s.lessonLocationsCount,
      'Toplam Katılım': s.meetingTotalAttendance + s.lessonTotalAttendance,
      'Toplam Lokasyon': s.meetingLocationsCount + s.lessonLocationsCount,
    }));

  // 2. Chart Data: Activity Type Ratio
  const chartPieData = [
    { 
      name: 'Üniversite Komisyon Toplantısı', 
      value: chartMetric === 'attendance' ? totalMeetingAttendance : totalMeetingLocations, 
      color: '#006F3D' 
    },
    { 
      name: 'Haftalık Ders', 
      value: chartMetric === 'attendance' ? totalLessonAttendance : totalLessonLocations, 
      color: '#9F8A43' 
    },
  ].filter(d => d.value > 0);

  // List of active provinces for university dropdown
  const activeProvincesList = provinceSummaries
    .filter((s) => s.meetingLocationsCount > 0 || s.lessonLocationsCount > 0)
    .map((s) => s.province);

  const selectedChartProv = focusedProvince || chartProvince || activeProvincesList[0] || '';

  // 3. Chart Data: University Level Breakdown for selectedChartProv
  const universityRecords = currentRecords.filter((r) => r.province === selectedChartProv);
  const universitiesInProv = Array.from(new Set(universityRecords.map((r) => r.universityName)));
  
  const chartUniversityData = universitiesInProv.map((uni) => {
    const meetRec = universityRecords.find((r) => r.activityType === 'meeting' && r.universityName === uni);
    const lesRec = universityRecords.find((r) => r.activityType === 'lesson' && r.universityName === uni);
    return {
      name: uni,
      'Toplantı Katılımı': meetRec ? meetRec.attendanceCount : 0,
      'Ders Katılımı': lesRec ? lesRec.attendanceCount : 0,
      'Toplam Katılım': (meetRec ? meetRec.attendanceCount : 0) + (lesRec ? lesRec.attendanceCount : 0),
    };
  }).filter((u) => u['Toplam Katılım'] > 0);

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-emerald-600/20 pb-3 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-ihh-green text-white px-2.5 py-0.5 rounded-full font-bold shadow-xs">
            Genel Merkez
          </span>
          <span className="text-sm font-extrabold text-ihh-green uppercase tracking-wide">
            Teşkilat Paneli
          </span>
        </div>
        <button
          onClick={onLogout}
          id="logout-btn-hq"
          className="text-xs font-semibold text-red-600 border border-red-200 bg-white/60 px-3 py-1 hover:bg-red-50 rounded shadow-xs transition-colors"
        >
          Oturumu Kapat
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white border border-emerald-600/10 rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-ihh-green to-ihh-olive h-1.5 w-full" />
        <div className="p-6">
          
          {/* Filters and Search Info */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-emerald-100 pb-4">
            <div className="flex flex-wrap gap-4">
              <div>
                <label htmlFor="hq-period-select" className="block text-xs font-semibold text-gray-600 mb-1">
                  Dönem Seç
                </label>
                <select
                  id="hq-period-select"
                  value={selectedPeriod}
                  onChange={(e) => handleFilterChange('period', e.target.value)}
                  className="text-xs p-1.5 border border-ihh-gray-border bg-white rounded focus:outline-none focus:border-ihh-green focus:ring-1 focus:ring-ihh-green w-44"
                >
                  {PERIODS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="hq-week-select" className="block text-xs font-semibold text-gray-600 mb-1">
                  Hafta Seç
                </label>
                <select
                  id="hq-week-select"
                  value={selectedWeek}
                  onChange={(e) => handleFilterChange('week', e.target.value)}
                  className="text-xs p-1.5 border border-ihh-gray-border bg-white rounded focus:outline-none focus:border-ihh-green focus:ring-1 focus:ring-ihh-green w-32"
                >
                  {WEEKS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 rounded-lg max-w-sm shadow-2xs">
              💡 <strong className="text-emerald-950">Kullanıcı İpuçları:</strong>
              <ul className="list-disc ml-4 mt-1 space-y-1">
                <li>İl ismine tıklayarak <strong>yalnızca o ili odaklayıp</strong> detaylarını otomatik açabilirsiniz.</li>
                <li>Hücre sayılarının üzerine tıklayarak detayları <strong>aşağıya doğru</strong> genişletebilirsiniz.</li>
              </ul>
            </div>
          </div>

        {/* 4 Stat Cards - Styled beautifully with soft colors exactly as shown in screenshot */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Active Provinces Card */}
          <div className="bg-emerald-50/60 border border-emerald-200/60 border-l-4 border-l-emerald-600 rounded-r-lg p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                AKTİF İLLER
              </p>
              <p className="text-base font-extrabold text-gray-900 mt-0.5">
                {activeProvincesCount} <span className="text-gray-400 font-normal text-xs">/ 81</span>
              </p>
            </div>
          </div>

          {/* Meeting Locations Card */}
          <div className="bg-sky-50/60 border border-sky-200/60 border-l-4 border-l-sky-600 rounded-r-lg p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-sky-800 uppercase tracking-wider">
                TOPLANTI NOKTALARI
              </p>
              <p className="text-base font-extrabold text-gray-900 mt-0.5">
                {totalMeetingLocations} <span className="text-gray-500 font-medium text-xs">Lokasyon</span>
              </p>
            </div>
          </div>

          {/* Meeting Attendance Card */}
          <div className="bg-amber-50/60 border border-amber-200/60 border-l-4 border-l-amber-600 rounded-r-lg p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-amber-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-xs">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                TOPLANTI KATILIMI
              </p>
              <p className="text-base font-extrabold text-gray-900 mt-0.5">
                {totalMeetingAttendance} <span className="text-gray-500 font-medium text-xs">Kişi</span>
              </p>
            </div>
          </div>

          {/* Lesson Attendance Card */}
          <div className="bg-purple-50/60 border border-purple-200/60 border-l-4 border-l-purple-600 rounded-r-lg p-4 flex items-center gap-3.5 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center shrink-0 shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-purple-800 uppercase tracking-wider">
                DERS KATILIMI
              </p>
              <p className="text-base font-extrabold text-gray-900 mt-0.5">
                {totalLessonAttendance} <span className="text-gray-500 font-medium text-xs">Kişi ({totalLessonLocations} Lok.)</span>
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-emerald-100 mb-6 bg-emerald-50/10 p-1 rounded-t-lg">
          <button
            onClick={() => setActiveTab('table')}
            id="tab-btn-table"
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold rounded-t-md border-b-2 transition-all cursor-pointer ${
              activeTab === 'table'
                ? 'border-ihh-green text-ihh-green bg-white shadow-3xs'
                : 'border-transparent text-gray-500 hover:text-ihh-green/80 hover:bg-emerald-50/20'
            }`}
          >
            <Building2 className="w-4 h-4" />
            📋 Teşkilat Rapor Tablosu
          </button>
          <button
            onClick={() => {
              setActiveTab('charts');
              // Auto-select a province for uni-level chart if not set
              if (activeProvincesList.length > 0 && !chartProvince) {
                setChartProvince(activeProvincesList[0]);
              }
            }}
            id="tab-btn-charts"
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold rounded-t-md border-b-2 transition-all cursor-pointer ${
              activeTab === 'charts'
                ? 'border-ihh-green text-ihh-green bg-white shadow-3xs'
                : 'border-transparent text-gray-500 hover:text-ihh-green/80 hover:bg-emerald-50/20'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            📊 Grafiksel Analiz Paneli
          </button>
        </div>

        {activeTab === 'table' ? (
          <>
            {/* Filter State Banner */}
            {focusedProvince && (
          <div className="mb-4 py-2 px-3 bg-ihh-green/10 border border-ihh-green/30 text-ihh-green text-xs flex justify-between items-center rounded">
            <span>
              Şu an yalnızca <strong>{focusedProvince}</strong> ili raporu filtrelendi ve tüm detaylar otomatik olarak açıldı.
            </span>
            <button
              onClick={() => {
                setFocusedProvince(null);
                setExpandedDetails({});
                setExpandedUniversities({});
              }}
              id="clear-focus-btn"
              className="font-bold underline cursor-pointer text-xs hover:text-ihh-green-hover"
            >
              Filtreyi Temizle (Tüm İller)
            </button>
          </div>
        )}

        {/* Standard Report Table */}
        <div className="overflow-x-auto rounded-lg border border-emerald-600/15 shadow-2xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              {/* Double Header Level */}
              <tr className="bg-gradient-to-r from-ihh-green to-[#137D4A] text-white border-b border-[#0A3F25] font-extrabold uppercase tracking-wide">
                <th className="p-3 border-r border-[#0A3F25] text-center align-middle w-1/5" rowSpan={2}>İl</th>
                <th className="p-3 border-r border-[#0A3F25] text-center font-bold" colSpan={2}>Üniversite Komisyon Toplantısı</th>
                <th className="p-3 text-center font-bold" colSpan={2}>Haftalık Ders</th>
              </tr>
              <tr className="bg-[#EBF4EE] border-b border-emerald-600/20 text-ihh-green font-bold uppercase tracking-wider">
                <th className="p-2 text-center border-r border-emerald-600/20">Lokasyon Sayısı</th>
                <th className="p-2 text-center border-r border-emerald-600/20">Toplam Katılım</th>
                <th className="p-2 text-center border-r border-emerald-600/20">Lokasyon Sayısı</th>
                <th className="p-2 text-center">Toplam Katılım</th>
              </tr>
            </thead>
            <tbody>
              {displayedSummaries.map((summary) => {
                const isMeetingExpanded = expandedDetails[`${summary.province}-meeting`];
                const isLessonExpanded = expandedDetails[`${summary.province}-lesson`];
                const hasDetails = summary.meetings.length > 0 || summary.lessons.length > 0;

                return (
                  <React.Fragment key={summary.province}>
                    {/* Primary Row */}
                    <tr className={`border-b border-ihh-gray-border hover:bg-gray-50 transition-colors ${focusedProvince === summary.province ? 'bg-emerald-50/40 font-medium' : ''}`}>
                      
                      {/* Province Cell (Action Combined: filters list and opens detail) */}
                      <td className="p-2 border-r border-ihh-gray-border">
                        <button
                          type="button"
                          id={`focus-prov-${summary.province}`}
                          onClick={() => handleProvinceClick(summary.province)}
                          className="text-left font-bold text-ihh-green hover:underline focus:outline-none w-full"
                          title="Sadece bu ile odaklan ve tüm alt alanları otomatik aç"
                        >
                          {summary.province}
                          {focusedProvince === summary.province && (
                            <span className="ml-1 text-[10px] bg-ihh-green text-white px-1 py-0.2 rounded font-normal">Odaklandı</span>
                          )}
                        </button>
                      </td>

                      {/* Meeting Locations Count Cell */}
                      <td 
                        onClick={() => toggleDetail(`${summary.province}-meeting`)}
                        className={`p-2 text-center border-r border-ihh-gray-border cursor-pointer select-none font-medium hover:bg-ihh-green/5 ${
                          isMeetingExpanded ? 'bg-ihh-green/10 text-ihh-green font-semibold' : 'text-gray-800'
                        }`}
                        title="Toplantı detaylarını görmek için tıklayın"
                      >
                        {summary.meetingLocationsCount}
                      </td>

                      {/* Meeting Total Attendance Cell */}
                      <td 
                        onClick={() => toggleDetail(`${summary.province}-meeting`)}
                        className={`p-2 text-center border-r border-ihh-gray-border cursor-pointer select-none font-medium hover:bg-ihh-green/5 ${
                          isMeetingExpanded ? 'bg-ihh-green/10 text-ihh-green font-semibold' : 'text-gray-800'
                        }`}
                        title="Toplantı detaylarını görmek için tıklayın"
                      >
                        {summary.meetingTotalAttendance}
                      </td>

                      {/* Lesson Locations Count Cell */}
                      <td 
                        onClick={() => toggleDetail(`${summary.province}-lesson`)}
                        className={`p-2 text-center border-r border-ihh-gray-border cursor-pointer select-none font-medium hover:bg-ihh-olive/5 ${
                          isLessonExpanded ? 'bg-ihh-olive/10 text-ihh-olive font-semibold' : 'text-gray-800'
                        }`}
                        title="Ders detaylarını görmek için tıklayın"
                      >
                        {summary.lessonLocationsCount}
                      </td>

                      {/* Lesson Total Attendance Cell */}
                      <td 
                        onClick={() => toggleDetail(`${summary.province}-lesson`)}
                        className={`p-2 text-center cursor-pointer select-none font-medium hover:bg-ihh-olive/5 ${
                          isLessonExpanded ? 'bg-ihh-olive/10 text-ihh-olive font-semibold' : 'text-gray-800'
                        }`}
                        title="Ders detaylarını görmek için tıklayın"
                      >
                        {summary.lessonTotalAttendance}
                      </td>
                    </tr>

                    {/* LEVEL 1 DETAIL ROW (MEETINGS) */}
                    {isMeetingExpanded && (
                      <tr className="bg-gray-50/80 border-b border-ihh-gray-border">
                        <td colSpan={5} className="p-0">
                          <div className="px-4 py-2 border-l-4 border-ihh-green">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                                <span>{summary.province} - Toplantı Detayları</span>
                                <span className="bg-ihh-green/10 text-ihh-green px-2 py-0.5 rounded text-[10px] font-extrabold">
                                  Toplam Katılım: {summary.meetingTotalAttendance} Kişi
                                </span>
                              </span>
                              <span className="text-[10px] text-gray-400 italic">
                                (Üniversiteye tıklayarak 2. seviye faaliyet kayıtlarını inceleyebilirsiniz)
                              </span>
                            </div>

                            {summary.meetings.length === 0 ? (
                              <p className="p-2 text-xs text-gray-500 italic">Kayıtlı toplantı bulunmuyor.</p>
                            ) : (
                              <div className="border border-ihh-gray-border rounded bg-white overflow-hidden my-1">
                                <table className="w-full text-left text-xs">
                                  <thead>
                                    <tr className="bg-gray-100/70 text-gray-500 font-semibold border-b border-ihh-gray-border">
                                      <th className="p-1.5 pl-3">Üniversite Adı (Detay için tıkla)</th>
                                      <th className="p-1.5 text-right pr-6">Katılım Sayısı</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {summary.meetings.map((meeting) => {
                                      const uniKey = `${summary.province}-meeting-${meeting.universityName}`;
                                      const isUniExpanded = expandedUniversities[uniKey];

                                      return (
                                        <React.Fragment key={meeting.id}>
                                          <tr 
                                            onClick={() => toggleUniversityDetail(uniKey)}
                                            className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                          >
                                            <td className="p-2 pl-3 font-semibold text-gray-700 flex items-center gap-1">
                                              <span>{isUniExpanded ? '▼' : '▶'}</span> {meeting.universityName}
                                            </td>
                                            <td className="p-2 text-right pr-6 text-gray-900 font-medium">{meeting.attendanceCount}</td>
                                          </tr>

                                          {/* LEVEL 2 DETAIL ROW */}
                                          {isUniExpanded && (
                                            <tr className="bg-slate-50/60 text-[11px] text-gray-600">
                                              <td colSpan={2} className="p-2 pl-8 border-b border-gray-100">
                                                <div className="grid grid-cols-3 gap-2 py-1 px-2 border-l border-gray-300">
                                                  <div>
                                                    <span className="font-semibold text-gray-400 mr-1">Tarih:</span> 
                                                    {meeting.date}
                                                  </div>
                                                  <div>
                                                    <span className="font-semibold text-gray-400 mr-1">Faaliyet Türü:</span> 
                                                    Üniversite Komisyon Toplantısı
                                                  </div>
                                                  <div>
                                                    <span className="font-semibold text-gray-400 mr-1">Katılım Sayısı:</span> 
                                                    {meeting.attendanceCount} Kişi
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
                                          )}
                                        </React.Fragment>
                                      );
                                    })}
                                  </tbody>
                                  <tfoot>
                                    <tr className="bg-emerald-50/50 text-ihh-green font-bold border-t border-ihh-gray-border">
                                      <td className="p-2 pl-3">TOPLAM KATILIM (Toplantılar)</td>
                                      <td className="p-2 text-right pr-6 text-sm">{summary.meetingTotalAttendance} Kişi</td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}

                    {/* LEVEL 1 DETAIL ROW (LESSONS) */}
                    {isLessonExpanded && (
                      <tr className="bg-gray-50/80 border-b border-ihh-gray-border">
                        <td colSpan={5} className="p-0">
                          <div className="px-4 py-2 border-l-4 border-ihh-olive">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-2">
                                <span>{summary.province} - Ders Detayları</span>
                                <span className="bg-ihh-olive-light text-ihh-olive px-2 py-0.5 rounded text-[10px] font-extrabold">
                                  Toplam Katılım: {summary.lessonTotalAttendance} Kişi
                                </span>
                              </span>
                              <span className="text-[10px] text-gray-400 italic">
                                (Üniversiteye tıklayarak 2. seviye faaliyet kayıtlarını inceleyebilirsiniz)
                              </span>
                            </div>

                            {summary.lessons.length === 0 ? (
                              <p className="p-2 text-xs text-gray-500 italic">Kayıtlı ders bulunmuyor.</p>
                            ) : (
                              <div className="border border-ihh-gray-border rounded bg-white overflow-hidden my-1">
                                <table className="w-full text-left text-xs">
                                  <thead>
                                    <tr className="bg-gray-100/70 text-gray-500 font-semibold border-b border-ihh-gray-border">
                                      <th className="p-1.5 pl-3">Üniversite Adı (Detay için tıkla)</th>
                                      <th className="p-1.5 text-right pr-6">Katılım Sayısı</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {summary.lessons.map((lesson) => {
                                      const uniKey = `${summary.province}-lesson-${lesson.universityName}`;
                                      const isUniExpanded = expandedUniversities[uniKey];

                                      return (
                                        <React.Fragment key={lesson.id}>
                                          <tr 
                                            onClick={() => toggleUniversityDetail(uniKey)}
                                            className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                                          >
                                            <td className="p-2 pl-3 font-semibold text-gray-700 flex items-center gap-1">
                                              <span>{isUniExpanded ? '▼' : '▶'}</span> {lesson.universityName}
                                            </td>
                                            <td className="p-2 text-right pr-6 text-gray-900 font-medium">{lesson.attendanceCount}</td>
                                          </tr>

                                          {/* LEVEL 2 DETAIL ROW */}
                                          {isUniExpanded && (
                                            <tr className="bg-slate-50/60 text-[11px] text-gray-600">
                                              <td colSpan={2} className="p-2 pl-8 border-b border-gray-100">
                                                <div className="grid grid-cols-3 gap-2 py-1 px-2 border-l border-gray-300">
                                                  <div>
                                                    <span className="font-semibold text-gray-400 mr-1">Tarih:</span> 
                                                    {lesson.date}
                                                  </div>
                                                  <div>
                                                    <span className="font-semibold text-gray-400 mr-1">Faaliyet Türü:</span> 
                                                    Haftalık Ders
                                                  </div>
                                                  <div>
                                                    <span className="font-semibold text-gray-400 mr-1">Katılım Sayısı:</span> 
                                                    {lesson.attendanceCount} Kişi
                                                  </div>
                                                </div>
                                              </td>
                                            </tr>
                                          )}
                                        </React.Fragment>
                                      );
                                    })}
                                  </tbody>
                                  <tfoot>
                                    <tr className="bg-ihh-olive-light text-ihh-olive font-bold border-t border-ihh-gray-border">
                                      <td className="p-2 pl-3">TOPLAM KATILIM (Dersler)</td>
                                      <td className="p-2 text-right pr-6 text-sm">{summary.lessonTotalAttendance} Kişi</td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}

              {displayedSummaries.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-4 text-center text-gray-400 italic">
                    Seçilen dönem ve hafta için girilmiş bir faaliyet kaydı bulunmamaktadır.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
          </>
        ) : (
          <div className="bg-emerald-50/5 border border-emerald-600/10 rounded-lg p-5">
            {/* Toolbar / Filters for Charts */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-emerald-600/10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 mr-2 uppercase tracking-wide">Grafik Türü:</span>
                <button
                  type="button"
                  onClick={() => setChartType('provinces')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
                    chartType === 'provinces'
                      ? 'bg-ihh-green text-white shadow-xs'
                      : 'bg-white border border-emerald-600/10 text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  🏢 İller Arası Analiz
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('pie')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
                    chartType === 'pie'
                      ? 'bg-ihh-green text-white shadow-xs'
                      : 'bg-white border border-emerald-600/10 text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  🍰 Faaliyet Türü Oranı
                </button>
                <button
                  type="button"
                  onClick={() => setChartType('universities')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded transition-all cursor-pointer ${
                    chartType === 'universities'
                      ? 'bg-ihh-green text-white shadow-xs'
                      : 'bg-white border border-emerald-600/10 text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  🎓 Üniversite Detayları
                </button>
              </div>

              {/* Metric Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 mr-2 uppercase tracking-wide">Metrik:</span>
                <button
                  type="button"
                  onClick={() => setChartMetric('attendance')}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-all cursor-pointer ${
                    chartMetric === 'attendance'
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'bg-white border border-emerald-600/10 text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  👥 Katılım Sayısı
                </button>
                {chartType !== 'universities' && (
                  <button
                    type="button"
                    onClick={() => setChartMetric('locations')}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-all cursor-pointer ${
                      chartMetric === 'locations'
                        ? 'bg-emerald-800 text-white shadow-2xs'
                        : 'bg-white border border-emerald-600/10 text-emerald-800 hover:bg-emerald-50'
                    }`}
                  >
                    📍 Lokasyon Sayısı
                  </button>
                )}
              </div>
            </div>

            {/* University Level Specific Province Dropdown */}
            {chartType === 'universities' && (
              <div className="mb-6 p-4 bg-emerald-50/40 border border-emerald-600/5 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-ihh-green rounded-full animate-pulse" />
                  <span className="text-xs font-bold text-emerald-900">
                    Seçili İl Üniversite Analizi:
                  </span>
                  <span className="text-xs text-emerald-700 bg-white border border-emerald-100 px-2 py-0.5 rounded font-bold shadow-3xs">
                    {selectedChartProv || "Seçilmedi"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="chart-province-select" className="text-xs text-gray-500 font-medium">İl Değiştir:</label>
                  <select
                    id="chart-province-select"
                    value={selectedChartProv}
                    onChange={(e) => {
                      setChartProvince(e.target.value);
                      if (focusedProvince) {
                        setFocusedProvince(e.target.value);
                      }
                    }}
                    className="text-xs p-1.5 border border-emerald-600/20 bg-white text-emerald-950 font-bold rounded focus:outline-none focus:border-ihh-green"
                  >
                    {activeProvincesList.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                    {activeProvincesList.length === 0 && (
                      <option value="">Rapor Yok</option>
                    )}
                  </select>
                </div>
              </div>
            )}

            {/* CHART DISPLAY AREA */}
            {chartProvincesData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-white border border-emerald-600/10 rounded-xl shadow-2xs">
                <AlertCircle className="w-12 h-12 text-amber-500 mb-3 animate-bounce" />
                <h3 className="text-sm font-bold text-gray-800">Görselleştirilecek Veri Yok</h3>
                <p className="text-xs text-gray-500 max-w-sm mt-1">
                  Seçilen dönem ({selectedPeriod}) ve hafta ({selectedWeek}) için henüz herhangi bir il tarafından faaliyet raporu girilmemiş.
                </p>
                <p className="text-xs text-emerald-600 font-semibold mt-4">
                  İpuçları: İl değiştirerek veya dönem/hafta filtrelerini güncelleyerek grafiklerinizi canlandırabilirsiniz!
                </p>
              </div>
            ) : (
              <div className="bg-white border border-emerald-600/10 rounded-xl p-4 md:p-6 shadow-sm">
                
                {chartType === 'provinces' && (
                  <div>
                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        İller Arası Faaliyet Karşılaştırması ({chartMetric === 'attendance' ? 'Katılım Sayısı' : 'Lokasyon Sayısı'})
                      </h4>
                      <p className="text-[10.5px] text-gray-400 mt-0.5">
                        Bu grafik, rapor giren tüm aktif illerin faaliyet performanslarını ve katılım/lokasyon hacimlerini yan yana karşılaştırır.
                      </p>
                    </div>
                    
                    <div className="h-[320px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={chartProvincesData}
                          margin={{ top: 20, right: 10, left: -10, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis 
                            dataKey="name" 
                            tick={{ fontSize: 10, fill: '#374151', fontWeight: 600 }}
                            axisLine={{ stroke: '#e5e7eb' }}
                            tickLine={false}
                          />
                          <YAxis 
                            tick={{ fontSize: 10, fill: '#6b7280' }}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              borderRadius: '8px', 
                              border: '1px solid rgba(16, 185, 129, 0.2)', 
                              fontSize: '11px', 
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' 
                            }} 
                          />
                          <Legend 
                            verticalAlign="top" 
                            height={36} 
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontSize: '11px', fontWeight: 500 }}
                          />
                          {chartMetric === 'attendance' ? (
                            <>
                              <Bar dataKey="Toplantı Katılımı" fill="#006F3D" radius={[4, 4, 0, 0]} barSize={25} />
                              <Bar dataKey="Ders Katılımı" fill="#9F8A43" radius={[4, 4, 0, 0]} barSize={25} />
                            </>
                          ) : (
                            <>
                              <Bar dataKey="Toplantı Lokasyonu" fill="#10B981" radius={[4, 4, 0, 0]} barSize={25} />
                              <Bar dataKey="Ders Lokasyonu" fill="#EAB308" radius={[4, 4, 0, 0]} barSize={25} />
                            </>
                          )}
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {chartType === 'pie' && (
                  <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-6">
                    <div className="md:col-span-7 h-[300px] w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartPieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={4}
                            dataKey="value"
                          >
                            {chartPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              borderRadius: '8px', 
                              border: '1px solid rgba(16, 185, 129, 0.2)', 
                              fontSize: '11px' 
                            }} 
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="md:col-span-5 space-y-4">
                      <div>
                        <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                          <PieIcon className="w-4 h-4 text-emerald-600" />
                          Faaliyet Türleri Hacim Dağılımı
                        </h4>
                        <p className="text-[10.5px] text-gray-400 mt-0.5">
                          Tüm aktif illerdeki toplantı ve ders faaliyetlerinin toplam {chartMetric === 'attendance' ? 'katılımcı sayılarına' : 'lokasyon sayılarına'} göre oransal ağırlığı.
                        </p>
                      </div>

                      <div className="space-y-2 border-t border-gray-100 pt-3">
                        {chartPieData.map((item, index) => {
                          const total = chartPieData.reduce((acc, d) => acc + d.value, 0);
                          const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                          return (
                            <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-gray-50/50 border border-gray-100">
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                                <span className="text-xs font-bold text-gray-700">{item.name}</span>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-extrabold text-gray-900">{item.value} {chartMetric === 'attendance' ? 'Kişi' : 'Lok.'}</span>
                                <span className="text-[10px] text-gray-400 block font-semibold">%{pct} Pay</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {chartType === 'universities' && (
                  <div>
                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                        {selectedChartProv} İli Üniversiteler Bazında Katılım Analizi
                      </h4>
                      <p className="text-[10.5px] text-gray-400 mt-0.5">
                        {selectedChartProv} ilinde girilmiş olan tüm üniversite komisyonlarının toplantı ve ders faaliyet katılımları.
                      </p>
                    </div>

                    {chartUniversityData.length === 0 ? (
                      <p className="text-xs text-gray-400 italic text-center py-8">
                        Bu ile ait üniversitelerde henüz bir faaliyet kaydı girilmemiş.
                      </p>
                    ) : (
                      <div className="h-[320px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={chartUniversityData}
                            margin={{ top: 20, right: 10, left: -10, bottom: 20 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis 
                              dataKey="name" 
                              tick={{ fontSize: 9, fill: '#374151', fontWeight: 600 }}
                              axisLine={{ stroke: '#e5e7eb' }}
                              tickLine={false}
                            />
                            <YAxis 
                              tick={{ fontSize: 10, fill: '#6b7280' }}
                              axisLine={false}
                              tickLine={false}
                            />
                            <Tooltip 
                              contentStyle={{ 
                                borderRadius: '8px', 
                                border: '1px solid rgba(16, 185, 129, 0.2)', 
                                fontSize: '11px' 
                              }} 
                            />
                            <Legend 
                              verticalAlign="top" 
                              height={36} 
                              iconType="circle"
                              iconSize={8}
                              wrapperStyle={{ fontSize: '11px', fontWeight: 500 }}
                            />
                            <Bar dataKey="Toplantı Katılımı" fill="#006F3D" radius={[4, 4, 0, 0]} barSize={25} />
                            <Bar dataKey="Ders Katılımı" fill="#9F8A43" radius={[4, 4, 0, 0]} barSize={25} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Legend / Info footer */}
        <div className="mt-6 pt-4 border-t border-ihh-gray-border text-[11px] text-gray-500">
          <p>
            * Bu ekran Genel Merkez (GM) kullanıcılarının rapor takip etmesi amacıyla tasarlanmıştır. Veritabanı (Supabase) entegrasyonu tamamlandığında il kullanıcılarının girdiği veriler anlık olarak buraya yansır.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
}
