/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { UserRole } from '../types';
import { PROVINCES } from '../mockData';
import { authenticateUser } from '../supabaseClient';

interface LoginProps {
  onLoginSuccess: (role: UserRole, province?: string) => void;
  provinces?: string[];
}

export default function Login({ onLoginSuccess, provinces }: LoginProps) {
  const resolvedProvinces = provinces || PROVINCES;
  const [role, setRole] = useState<UserRole>('il');
  const [email, setEmail] = useState('ornek@gmail.com');
  const [isSuggestion, setIsSuggestion] = useState(true);
  const [password, setPassword] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('Ankara');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const finalEmail = isSuggestion ? '' : email;
    const result = await authenticateUser(finalEmail || email, password, role);
    setLoading(false);

    if (result.success) {
      // If the database row specifically has a designated province, use it, otherwise fall back to dropdown
      const resolvedProvince = result.province || selectedProvince;
      onLoginSuccess(role, role === 'il' ? resolvedProvince : undefined);
    } else {
      setError(result.error || 'E-posta, şifre veya rol hatalı.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white border border-emerald-600/20 rounded-lg overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-ihh-green to-ihh-olive h-1.5 w-full" />
        <div className="p-6">
          <div className="text-center mb-6">
            {/* Simple non-flashy logo style */}
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
                  {resolvedProvinces.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
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
                onFocus={() => {
                  if (isSuggestion) {
                    setEmail('');
                    setIsSuggestion(false);
                  }
                }}
                onBlur={() => {
                  if (!email.trim()) {
                    setEmail('ornek@gmail.com');
                    setIsSuggestion(true);
                  }
                }}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsSuggestion(false);
                }}
                placeholder="user@ihh.org.tr"
                className={`w-full text-xs p-2 border border-ihh-gray-border bg-white rounded focus:outline-none focus:border-ihh-green focus:ring-1 focus:ring-ihh-green transition-colors ${
                  isSuggestion ? 'text-gray-400/60 font-normal italic' : 'text-gray-900 font-medium'
                }`}
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

            {error && (
              <div className="p-2.5 text-xs text-red-600 bg-red-50 border border-red-200 rounded font-medium text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              id="login-submit-btn"
              disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-ihh-green to-ihh-olive text-white text-xs font-bold uppercase tracking-wider rounded-md hover:opacity-90 active:scale-[0.99] transition-all focus:outline-none shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Giriş Yapılıyor...</span>
                </>
              ) : (
                'Sisteme Giriş Yap'
              )}
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
