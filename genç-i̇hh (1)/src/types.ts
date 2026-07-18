/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'il' | 'genel_merkez';

export interface ActivityEntry {
  id: string;
  universityName: string;
  attendanceCount: number;
}

export interface ActivityRecord {
  id: string;
  province: string;
  period: string;
  week: string;
  activityType: 'meeting' | 'lesson'; // 'meeting' -> Üniversite Komisyon Toplantısı, 'lesson' -> Haftalık Ders
  universityName: string;
  attendanceCount: number;
  date: string; // YYYY-MM-DD
}

export interface ProvinceSummary {
  province: string;
  meetings: ActivityRecord[];
  lessons: ActivityRecord[];
}
