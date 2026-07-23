import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius } from '../constants/theme';
import { useLanguage } from '../i18n/LanguageContext';

export type SaveStatus = 'idle' | 'saving' | 'saved';

interface SaveBarProps {
  dateLabel: string;
  status: SaveStatus;
  cloudSync?: boolean;
}

export function SaveBar({ dateLabel, status, cloudSync }: SaveBarProps) {
  const { strings } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.dateLabel}>{strings.savedForDay}: {dateLabel}</Text>
      <Text style={styles.hint}>
        {cloudSync ? strings.cloudSyncHint : strings.autoSaveHint}
      </Text>
      {status === 'saved' && (
        <Text style={styles.savedText}>✓ {strings.saved}</Text>
      )}
      {status === 'saving' && (
        <View style={styles.savingRow}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.savingText}>{strings.saving}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.xs,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  hint: {
    fontSize: 12,
    color: colors.textLight,
  },
  savedText: {
    fontSize: 13,
    color: colors.check,
    fontWeight: '600',
  },
  savingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  savingText: {
    fontSize: 12,
    color: colors.textLight,
  },
});
