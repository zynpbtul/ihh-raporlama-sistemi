/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { supabase } from '../supabaseClient'; // Supabase bağlantısını içe aktarıyoruz
import { UserRole } from '../types';

interface LoginProps {
  onLoginSuccess: (role: UserRole, province?: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [role, setRole] = useState<UserRole>('il');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('Ankara');
  const [loading, setLoading] = useState(false); // Giriş süreci için loading durumu

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Supabase Auth ile giriş denemesi
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        alert("Giriş başarısız: " + error.message);
      } else if (data.user) {
        // Giriş başarılıysa App.tsx'i tetikliyoruz
        onLoginSuccess(role, role === 'il' ? selectedProvince : undefined);
      }
    } catch (err) {
      alert("Beklenmedik bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-emerald-600/20 rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-ihh-green to-ihh-olive h-1.5 w-full" />
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-ihh-green to-ihh-olive text-white flex items-center justify-center font-extrabold text-2xl rounded-full mx-auto mb-3 shadow-md border-2 border-white">
              İHH
            </div>
            <h1 className="text-xl font-black tracking-tight text-ihh-green uppercase">
              GENÇ İHH
            </h1>
            <p className="text-xs text-ihh-olive font-bold mt-1">
              Haftalık Faaliyet Raporlama Portalı
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Kullanıcı Rolü
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  id="role-btn-il"
                  onClick={() => setRole('il')}
                  className={`py-2 px-3 text-xs font-extrabold border rounded text-center transition-all ${
                    role === 'il'
                      ? 'border-ihh-green bg-ihh-green/10 text-ihh-green shadow-sm scale-[1.02]'
                      : 'border-ihh-gray-border bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  İl Sorumlusu
                </button>
                <button
                  type="button"
                  id="role-btn-gm"
                  onClick={() => setRole('genel_merkez')}
                  className={`py-2 px-3 text-xs font-extrabold border rounded text-center transition-all ${
                    role === 'genel_merkez'
                      ? 'border-ihh-olive bg-ihh-olive/10 text-ihh-olive shadow-sm scale-[1.02]'
                      : 'border-ihh-gray-border bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Genel Merkez
                </button>
              </div>
            </div>

            {role === 'il' && (
              <div>
                <label htmlFor="province-select" className="block text-xs font-semibold text-gray-700 mb-1">
                  Sorumlu Olduğunuz İl
                </label>
                <select
                  id="province-select"
                  value={selectedProvince}
                  onChange={(e) => setSelectedProvince(e.target.value)}
                  className="w-full text-xs p-2 border border-ihh-gray-border bg-white rounded focus:outline-none focus:border-ihh-green focus:ring-1 focus:ring-ihh-green"
                >
                  <option value="Ankara">Ankara</option>
                  <option value="İstanbul">İstanbul</option>
                  <option value="İzmir">İzmir</option>
                  <option value="Konya">Konya</option>
                  <option value="Antalya">Bursa</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="email-input" className="block text-xs font-semibold text-gray-700 mb-1">
                E-posta
              </label>
              <input
                id="email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@ihh.org.tr"
                className="w-full text-xs p-2 border border-ihh-gray-border bg-white rounded focus:outline-none focus:border-ihh-green focus:ring-1 focus:ring-ihh-green"
              />
            </div>

            <div>
              <label htmlFor="password-input" className="block text-xs font-semibold text-gray-700 mb-1">
                Şifre
              </label>
              <input
                id="password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs p-2 border border-ihh-gray-border bg-white rounded focus:outline-none focus:border-ihh-green focus:ring-1 focus:ring-ihh-green"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              id="login-submit-btn"
              className="w-full py-2.5 bg-gradient-to-r from-ihh-green to-ihh-olive text-white text-xs font-bold uppercase tracking-wider rounded-md hover:opacity-90 active:scale-[0.99] transition-all focus:outline-none shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {loading ? 'Giriş Yapılıyor...' : 'Sisteme Giriş Yap'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-ihh-gray-border text-center text-[10px] text-gray-400">
            GENÇ İHH © {new Date().getFullYear()} • Teşkilat Raporlama Portalı
          </div>
        </div>
      </div>
    </div>
  );
}