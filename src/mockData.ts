/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ActivityRecord } from './types';

export const PROVINCES = [
  'Ankara',
  'İstanbul',
  'İzmir',
  'Konya',
  'Antalya',
];

export const PERIODS = [
  'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
  'Dönem İki (Şubat, Mart, Nisan, Mayıs)',
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
  // --- ANKARA ---
  // Meetings
  {
    id: uuid(),
    province: 'Ankara',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'Ankara Üniversitesi',
    attendanceCount: 12,
    date: '2026-07-10'
  },
  {
    id: uuid(),
    province: 'Ankara',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'Hacettepe Üniversitesi',
    attendanceCount: 8,
    date: '2026-07-11'
  },
  {
    id: uuid(),
    province: 'Ankara',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'ODTÜ',
    attendanceCount: 15,
    date: '2026-07-12'
  },
  // Lessons
  {
    id: uuid(),
    province: 'Ankara',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'lesson',
    universityName: 'Ankara Üniversitesi',
    attendanceCount: 20,
    date: '2026-07-13'
  },
  {
    id: uuid(),
    province: 'Ankara',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'lesson',
    universityName: 'Gazi Üniversitesi',
    attendanceCount: 14,
    date: '2026-07-14'
  },
  {
    id: uuid(),
    province: 'Ankara',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'lesson',
    universityName: 'Hacettepe Üniversitesi',
    attendanceCount: 10,
    date: '2026-07-15'
  },

  // --- İSTANBUL ---
  // Meetings
  {
    id: uuid(),
    province: 'İstanbul',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'İstanbul Üniversitesi',
    attendanceCount: 22,
    date: '2026-07-09'
  },
  {
    id: uuid(),
    province: 'İstanbul',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'Marmara Üniversitesi',
    attendanceCount: 18,
    date: '2026-07-10'
  },
  {
    id: uuid(),
    province: 'İstanbul',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'Boğaziçi Üniversitesi',
    attendanceCount: 11,
    date: '2026-07-11'
  },
  {
    id: uuid(),
    province: 'İstanbul',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'YTÜ',
    attendanceCount: 14,
    date: '2026-07-12'
  },
  // Lessons
  {
    id: uuid(),
    province: 'İstanbul',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'lesson',
    universityName: 'İstanbul Üniversitesi',
    attendanceCount: 35,
    date: '2026-07-13'
  },
  {
    id: uuid(),
    province: 'İstanbul',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'lesson',
    universityName: 'Marmara Üniversitesi',
    attendanceCount: 25,
    date: '2026-07-14'
  },
  {
    id: uuid(),
    province: 'İstanbul',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'lesson',
    universityName: 'YTÜ',
    attendanceCount: 19,
    date: '2026-07-15'
  },

  // --- İZMİR ---
  // Meetings
  {
    id: uuid(),
    province: 'İzmir',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'Ege Üniversitesi',
    attendanceCount: 9,
    date: '2026-07-10'
  },
  {
    id: uuid(),
    province: 'İzmir',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'Dokuz Eylül Üniversitesi',
    attendanceCount: 7,
    date: '2026-07-11'
  },
  // Lessons
  {
    id: uuid(),
    province: 'İzmir',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'lesson',
    universityName: 'Ege Üniversitesi',
    attendanceCount: 15,
    date: '2026-07-12'
  },
  {
    id: uuid(),
    province: 'İzmir',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'lesson',
    universityName: 'Dokuz Eylül Üniversitesi',
    attendanceCount: 12,
    date: '2026-07-13'
  },

  // --- KONYA ---
  // Meetings
  {
    id: uuid(),
    province: 'Konya',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'Selçuk Üniversitesi',
    attendanceCount: 15,
    date: '2026-07-09'
  },
  {
    id: uuid(),
    province: 'Konya',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'meeting',
    universityName: 'Necmettin Erbakan Üni.',
    attendanceCount: 10,
    date: '2026-07-10'
  },
  // Lessons
  {
    id: uuid(),
    province: 'Konya',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'lesson',
    universityName: 'Selçuk Üniversitesi',
    attendanceCount: 22,
    date: '2026-07-11'
  },
  {
    id: uuid(),
    province: 'Konya',
    period: 'Dönem Bir (Eylül, Ekim, Kasım, Aralık, Ocak)',
    week: '1. Hafta',
    activityType: 'lesson',
    universityName: 'Necmettin Erbakan Üni.',
    attendanceCount: 18,
    date: '2026-07-12'
  },
  // Lessons

];
