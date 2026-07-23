import AsyncStorage from '@react-native-async-storage/async-storage';
import { PLATFORMS, COLUMNS } from '../constants/data';
import { DayData, TaskGrid, NotesGrid } from '../types';

const PREFIX = '@sme_day_';

export function formatDateKey(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function formatDateLabel(date: Date, monthNames: readonly string[]): string {
  return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}

export function createEmptyTasks(): TaskGrid {
  const tasks = {} as TaskGrid;
  for (const platform of PLATFORMS) {
    tasks[platform] = {} as TaskGrid[typeof platform];
    for (const col of COLUMNS) {
      tasks[platform][col] = false;
    }
  }
  return tasks;
}

export function createEmptyNotes(): NotesGrid {
  const notes = {} as NotesGrid;
  for (const platform of PLATFORMS) {
    notes[platform] = '';
  }
  return notes;
}

export function createEmptyDayData(date: Date): DayData {
  return {
    date: formatDateKey(date),
    tasks: createEmptyTasks(),
    notes: createEmptyNotes(),
  };
}

export async function loadDayData(date: Date): Promise<DayData> {
  const key = PREFIX + formatDateKey(date);
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return createEmptyDayData(date);

  try {
    const parsed = JSON.parse(raw) as DayData;
    const empty = createEmptyDayData(date);
    return {
      date: empty.date,
      tasks: { ...empty.tasks, ...parsed.tasks },
      notes: { ...empty.notes, ...parsed.notes },
    };
  } catch {
    return createEmptyDayData(date);
  }
}

export async function saveDayData(data: DayData): Promise<void> {
  const key = PREFIX + data.date;
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

export async function getDaysWithData(year: number, month: number): Promise<Set<number>> {
  const keys = await AsyncStorage.getAllKeys();
  const prefix = PREFIX + `${year}-${String(month + 1).padStart(2, '0')}-`;
  const days = new Set<number>();

  for (const key of keys) {
    if (key.startsWith(prefix)) {
      const day = parseInt(key.slice(prefix.length), 10);
      if (!isNaN(day)) days.add(day);
    }
  }
  return days;
}
