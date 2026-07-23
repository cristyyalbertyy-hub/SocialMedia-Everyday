export const PLATFORMS = [
  'instagram',
  'threads',
  'facebook',
  'reddit',
  'x',
  'tiktok',
  'youtube',
] as const;

export const COLUMNS = [
  'reelsPostMain',
  'histories',
  'likes',
  'follows',
  'comments',
] as const;

export type PlatformKey = (typeof PLATFORMS)[number];
export type ColumnKey = (typeof COLUMNS)[number];
