/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActivityRecord } from './types';

export const PROVINCES = [
  'İstanbul',
  'Ankara',
  'Konya',
  'İzmir',
  'Antalya'
];

export const PERIODS = [
  '1. Dönem (Eylül-Ocak)',
  '2. Dönem (Ocak-Mayıs)'
];

export const WEEKS = [
  '1. Hafta',
  '2. Hafta',
  '3. Hafta',
  '4. Hafta'
];

// Helper to generate IDs
const uuid = () => Math.random().toString(36).substring(2, 11);

export const INITIAL_RECORDS: ActivityRecord[] = [
  // --- İSTANBUL ---
  {
    id: uuid(),
    province: 'İstanbul',
    period: '1. Dönem (Eylül-Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'İstanbul Üniversitesi',
    attendanceCount: 22,
    date: '2026-07-09'
  },
  {
    id: uuid(),
    province: 'İstanbul',
    period: '1. Dönem (Eylül-Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'Boğaziçi Üniversitesi',
    attendanceCount: 15,
    date: '2026-07-10'
  },
  {
    id: uuid(),
    province: 'İstanbul',
    period: '1. Dönem (Eylül-Ocak)',
    week: '1. Hafta',
    activityType: 'lesson',
    universityName: 'İstanbul Teknik Üniversitesi',
    attendanceCount: 30,
    date: '2026-07-11'
  },
  {
    id: uuid(),
    province: 'İstanbul',
    period: '1. Dönem (Eylül-Ocak)',
    week: '1. Hafta',
    activityType: 'lesson',
    universityName: 'Marmara Üniversitesi',
    attendanceCount: 25,
    date: '2026-07-12'
  },

  // --- ANKARA ---
  {
    id: uuid(),
    province: 'Ankara',
    period: '1. Dönem (Eylül-Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'Ankara Üniversitesi',
    attendanceCount: 18,
    date: '2026-07-10'
  },
  {
    id: uuid(),
    province: 'Ankara',
    period: '1. Dönem (Eylül-Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'Orta Doğu Teknik Üniversitesi (ODTÜ)',
    attendanceCount: 12,
    date: '2026-07-11'
  },
  {
    id: uuid(),
    province: 'Ankara',
    period: '1. Dönem (Eylül-Ocak)',
    week: '1. Hafta',
    activityType: 'lesson',
    universityName: 'Hacettepe Üniversitesi',
    attendanceCount: 20,
    date: '2026-07-12'
  },
  {
    id: uuid(),
    province: 'Ankara',
    period: '1. Dönem (Eylül-Ocak)',
    week: '1. Hafta',
    activityType: 'lesson',
    universityName: 'Gazi Üniversitesi',
    attendanceCount: 16,
    date: '2026-07-13'
  },

  // --- KONYA ---
  {
    id: uuid(),
    province: 'Konya',
    period: '1. Dönem (Eylül-Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'Selçuk Üniversitesi',
    attendanceCount: 15,
    date: '2026-07-09'
  },
  {
    id: uuid(),
    province: 'Konya',
    period: '1. Dönem (Eylül-Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'Necmettin Erbakan Üniversitesi',
    attendanceCount: 11,
    date: '2026-07-10'
  },
  {
    id: uuid(),
    province: 'Konya',
    period: '1. Dönem (Eylül-Ocak)',
    week: '1. Hafta',
    activityType: 'lesson',
    universityName: 'Konya Teknik Üniversitesi',
    attendanceCount: 24,
    date: '2026-07-11'
  },

  // --- İZMİR ---
  {
    id: uuid(),
    province: 'İzmir',
    period: '1. Dönem (Eylül-Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'Ege Üniversitesi',
    attendanceCount: 14,
    date: '2026-07-10'
  },
  {
    id: uuid(),
    province: 'İzmir',
    period: '1. Dönem (Eylül-Ocak)',
    week: '1. Hafta',
    activityType: 'lesson',
    universityName: 'Dokuz Eylül Üniversitesi',
    attendanceCount: 19,
    date: '2026-07-11'
  },

  // --- ANTALYA ---
  {
    id: uuid(),
    province: 'Antalya',
    period: '1. Dönem (Eylül-Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'Akdeniz Üniversitesi',
    attendanceCount: 13,
    date: '2026-07-12'
  },
  {
    id: uuid(),
    province: 'Antalya',
    period: '1. Dönem (Eylül-Ocak)',
    week: '1. Hafta',
    activityType: 'lesson',
    universityName: 'Alanya Alaaddin Keykubat Üniversitesi',
    attendanceCount: 17,
    date: '2026-07-13'
  }
];
