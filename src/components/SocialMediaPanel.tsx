import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../constants/theme';
import { useLanguage } from '../i18n/LanguageContext';
import { COLUMNS, PlatformKey, ColumnKey } from '../constants/data';
import { CheckCell } from './CheckCell';
import { NotesPanel } from './NotesPanel';

interface SocialMediaPanelProps {
  platform: PlatformKey;
  tasks: Record<ColumnKey, boolean>;
  notes: string;
  onToggleTask: (column: ColumnKey) => void;
  onUpdateNotes: (notes: string) => void;
}

const platformAccent: Record<PlatformKey, string> = {
  instagram: '#E8D5E4',
  threads: '#DDE3EA',
  facebook: '#D4DFF5',
  reddit: '#F5DDD4',
  x: '#E0E0E0',
  tiktok: '#E8E0F0',
  youtube: '#F5E0E0',
};

export function SocialMediaPanel({
  platform,
  tasks,
  notes,
  onToggleTask,
  onUpdateNotes,
}: SocialMediaPanelProps) {
  const { strings } = useLanguage();

  return (
    <View style={[styles.panel, { borderLeftColor: platformAccent[platform] }]}>
      <Text style={styles.platformName}>{strings.platforms[platform]}</Text>

      <View style={styles.actionsRow}>
        {COLUMNS.map((col) => (
          <View key={col} style={styles.actionItem}>
            <Text style={styles.actionLabel} numberOfLines={2}>
              {strings.columns[col]}
            </Text>
            <CheckCell
              checked={tasks[col]}
              onToggle={() => onToggleTask(col)}
              compact
            />
          </View>
        ))}
      </View>

      <NotesPanel value={notes} onChange={onUpdateNotes} />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 4,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  platformName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  actionItem: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.xs,
    paddingHorizontal: 2,
  },
  actionLabel: {
    fontSize: 9,
    color: colors.textLight,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs,
    minHeight: 24,
    lineHeight: 11,
  },
});
