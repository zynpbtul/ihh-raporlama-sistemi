import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Login from './components/Login';
import ProvinceForm from './components/ProvinceForm';
import HqReport from './components/HqReport';
import { UserRole, ActivityRecord } from './types';
import { INITIAL_RECORDS } from './mockData';

export default function App() {
  const [role, setRole] = useState<UserRole | null>(null);
  const [province, setProvince] = useState<string | null>(null);
  const [records, setRecords] = useState<ActivityRecord[]>(INITIAL_RECORDS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      const { data: userData } = await supabase
        .from('kullanicilar')
        .select('rol, il_adi')
        .eq('id', session.user.id)
        .single();

      if (userData) {
        // Veritabanından gelen 'il_baskani' değerini olduğu gibi set ediyoruz
        setRole(userData.rol as UserRole);
        setProvince(userData.il_adi);
      }
    }
    setLoading(false);
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setRole(null);
    setProvince(null);
    window.location.reload();
  };

  const handleLoginSuccess = () => {
    checkUser();
  };

  if (loading) return <div className="text-center mt-20">Yükleniyor...</div>;

  return (
    <div className="min-h-screen bg-transparent flex flex-col justify-between relative overflow-hidden">
      
      <header className="bg-gradient-to-r from-ihh-green to-ihh-olive text-white py-4 px-6 shadow-md relative z-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
            <h1 className="text-base font-extrabold tracking-tight uppercase">GENÇ İHH</h1>
            {role && (
            <button onClick={handleLogout} className="text-[11px] font-bold text-amber-300 hover:text-amber-200">Çıkış Yap</button>
            )}
        </div>
      </header>

      <main className="flex-grow py-8 px-4 relative z-10">
        {!role ? (
          <Login onLoginSuccess={handleLoginSuccess} />
        ) : role === 'il_baskani' ? ( // KOŞULU 'il_baskani' OLARAK GÜNCELLEDİK
          <ProvinceForm
            province={province || 'Ankara'}
            onSaveRecords={() => {}} 
            onLogout={handleLogout}
          />
        ) : (
          <HqReport records={records} onLogout={handleLogout} />
        )}
      </main>

      <footer className="bg-white border-t py-3 px-6 text-center text-[10px] text-gray-400 relative z-10">
        Genç İHH Üniversite Teşkilatları Raporlama Portalı
      </footer>
    </div>
  );
}