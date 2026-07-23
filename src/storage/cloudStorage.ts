import { getSupabase } from '../lib/supabase';
import { DayData, TaskGrid, NotesGrid } from '../types';
import {
  formatDateKey,
  createEmptyDayData,
} from './dayStorage';

function mergeDayData(date: Date, parsed: Partial<DayData>): DayData {
  const empty = createEmptyDayData(date);
  const tasks = { ...empty.tasks } as TaskGrid;
  const notes = { ...empty.notes } as NotesGrid;

  if (parsed.tasks) {
    for (const platform of Object.keys(empty.tasks) as (keyof TaskGrid)[]) {
      tasks[platform] = { ...empty.tasks[platform], ...parsed.tasks[platform] };
    }
  }
  if (parsed.notes) {
    Object.assign(notes, parsed.notes);
  }

  return { date: empty.date, tasks, notes };
}

export async function loadDayData(date: Date, userId: string): Promise<DayData> {
  const supabase = getSupabase();
  if (!supabase) return createEmptyDayData(date);

  const dateKey = formatDateKey(date);
  const { data, error } = await supabase
    .from('day_records')
    .select('tasks, notes')
    .eq('user_id', userId)
    .eq('date', dateKey)
    .maybeSingle();

  if (error || !data) return createEmptyDayData(date);
  return mergeDayData(date, { tasks: data.tasks, notes: data.notes });
}

export async function saveDayData(data: DayData, userId: string): Promise<void> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Supabase not configured');

  const { error } = await supabase.from('day_records').upsert(
    {
      user_id: userId,
      date: data.date,
      tasks: data.tasks,
      notes: data.notes,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,date' }
  );

  if (error) throw error;
}

export async function getDaysWithData(
  year: number,
  month: number,
  userId: string
): Promise<Set<number>> {
  const supabase = getSupabase();
  if (!supabase) return new Set();

  const monthStr = String(month + 1).padStart(2, '0');
  const lastDay = new Date(year, month + 1, 0).getDate();
  const start = `${year}-${monthStr}-01`;
  const end = `${year}-${monthStr}-${String(lastDay).padStart(2, '0')}`;

  const { data, error } = await supabase
    .from('day_records')
    .select('date')
    .eq('user_id', userId)
    .gte('date', start)
    .lte('date', end);

  if (error || !data) return new Set();

  const days = new Set<number>();
  for (const row of data) {
    const day = parseInt(String(row.date).split('-')[2], 10);
    if (!isNaN(day)) days.add(day);
  }
  return days;
}
