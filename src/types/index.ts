import { ColumnKey, PlatformKey } from '../constants/data';

export type TaskGrid = Record<PlatformKey, Record<ColumnKey, boolean>>;
export type NotesGrid = Record<PlatformKey, string>;

export interface DayData {
  date: string;
  tasks: TaskGrid;
  notes: NotesGrid;
}

export type Language = 'pt' | 'en';
