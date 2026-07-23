import { isSupabaseConfigured } from '../lib/supabase';
import { DayData } from '../types';
import * as local from './dayStorage';
import * as cloud from './cloudStorage';

export async function loadDayData(date: Date, userId: string | null): Promise<DayData> {
  if (userId && isSupabaseConfigured()) {
    return cloud.loadDayData(date, userId);
  }
  return local.loadDayData(date);
}

export async function saveDayData(data: DayData, userId: string | null): Promise<void> {
  if (userId && isSupabaseConfigured()) {
    await cloud.saveDayData(data, userId);
    return;
  }
  await local.saveDayData(data);
}

export async function getDaysWithData(
  year: number,
  month: number,
  userId: string | null
): Promise<Set<number>> {
  if (userId && isSupabaseConfigured()) {
    return cloud.getDaysWithData(year, month, userId);
  }
  return local.getDaysWithData(year, month);
}

export { formatDateKey, formatDateLabel, createEmptyDayData } from './dayStorage';
