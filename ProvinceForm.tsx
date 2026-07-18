/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import ProvinceForm, { PROVINCE_UNIVERSITIES } from './components/ProvinceForm';
import HqReport from './components/HqReport';
import { UserRole, ActivityRecord } from './types';
import { INITIAL_RECORDS, PROVINCES } from './mockData';
import { fetchProvincesAndUniversities, saveReportToSupabase, fetchAllActivityRecords } from './supabaseClient';

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [records, setRecords] = useState<ActivityRecord[]>(INITIAL_RECORDS);
  const [provinces, setProvinces] = useState<string[]>(PROVINCES);
  const [provinceUniversities, setProvinceUniversities] = useState<Record<string, string[]>>(PROVINCE_UNIVERSITIES);

  // Load database data on mount
  useEffect(() => {
    async function loadData() {
      // 1. Fetch dynamic city/university list
      const provData = await fetchProvincesAndUniversities();
      if (provData) {
        if (provData.provinces && provData.provinces.length > 0) {
          setProvinces(provData.provinces);
        }
        if (provData.universities && Object.keys(provData.universities).length > 0) {
          setProvinceUniversities(provData.universities);
        }
      }

      // 2. Fetch all reports from Supabase
      const dbRecords = await fetchAllActivityRecords();
      if (dbRecords && dbRecords.length > 0) {
        setRecords(dbRecords);
      }
    }
    loadData();
  }, []);

  const handleLoginSuccess = (selectedRole: UserRole, selectedProvince?: string) => {
    setRole(selectedRole);
    if (selectedRole === 'il' && selectedProvince) {
      setProvince(selectedProvince);
    } else {
      setProvince(null);
    }
  };

  const handleLogout = () => {
    setRole(null);
    setProvince(null);
  };

  const handleSaveRecords = async (newRecords: ActivityRecord[]) => {
    if (newRecords.length === 0) return;

    const sample = newRecords[0];

    // Optimistically update local state for instantaneous feedback
    setRecords((prev) => {
      const filtered = prev.filter(
        (r) => !(r.province === sample.province && r.period === sample.period && r.week === sample.week)
      );
      return [...filtered, ...newRecords];
    });

    // Save to Supabase
    await saveReportToSupabase(
      sample.province,
      sample.period,
      sample.week,
      newRecords
    );

    // Re-fetch database records to ensure synchronization with other users
    const dbRecords = await fetchAllActivityRecords();
    if (dbRecords && dbRecords.length > 0) {
      setRecords(dbRecords);
    }
  };

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-between relative overflow-hidden">
      {/* Dynamic Background Glows matching IHH Brand Colors (Green & Olive Gold) */}
      <div className="absolute top-[-10%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] rounded-full bg-ihh-green/8 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-15%] left-[-10%] w-[60vw] h-[60vw] max-w-[600px] rounded-full bg-ihh-olive/12 blur-[130px] pointer-events-none z-0" />
      <div className="absolute top-[35%] left-[20%] w-[40vw] h-[40vw] max-w-[400px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none z-0" />

      {/* Main Header */}
      <header className="bg-gradient-to-r from-ihh-green to-ihh-olive text-white py-4 px-6 shadow-md border-b border-[#0A3F25] relative z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white text-ihh-green font-extrabold text-base px-3 py-1 rounded shadow-sm">
              İHH
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white uppercase">
                GENÇ İHH
              </h1>
              <p className="text-[10px] text-emerald-100 font-bold">
                Üniversite Teşkilat Raporlama Sistemi
              </p>
            </div>
          </div>

          {role && (
            <div className="flex items-center gap-4">
              <span className="text-xs text-emerald-50 font-medium">
                Aktif Rol: <strong className="text-white">{role === 'il' ? `İl Sorumlusu (${province})` : 'Genel Merkez'}</strong>
              </span>
              <button
                onClick={handleLogout}
                id="logout-header-btn"
                className="text-[11px] font-bold text-amber-300 hover:text-amber-200 transition-colors cursor-pointer bg-white/10 px-2.5 py-1 rounded border border-white/20"
              >
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow py-8 px-4 relative z-10">
        {!role ? (
          <Login onLoginSuccess={handleLoginSuccess} provinces={provinces} />
        ) : role === 'il' && province ? (
          <ProvinceForm
            province={province}
            onSaveRecords={handleSaveRecords}
            onLogout={handleLogout}
            provinceUniversities={provinceUniversities}
          />
        ) : (
          <HqReport records={records} onLogout={handleLogout} provinces={provinces} />
        )}
      </main>

      {/* Corporate Footer */}
      <footer className="bg-white border-t border-ihh-gray-border py-3 px-6 text-center text-[10px] text-gray-400 relative z-10">
        <div className="max-w-5xl mx-auto">
          Genç İHH Üniversite Teşkilatları Raporlama Portalı • Tüm hakları saklıdır.
        </div>
      </footer>
    </div>
  );
}
