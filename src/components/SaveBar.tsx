import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, spacing, borderRadius } from '../constants/theme';
import { useLanguage } from '../i18n/LanguageContext';

export type SaveStatus = 'idle' | 'saving' | 'saved';

interface SaveBarProps {
  dateLabel: string;
  status: SaveStatus;
  onSave: () => void;
}

export function SaveBar({ dateLabel, status, onSave }: SaveBarProps) {
  const { strings } = useLanguage();

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.dateLabel}>{strings.savedForDay}: {dateLabel}</Text>
        <Text style={styles.hint}>{strings.autoSaveHint}</Text>
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
      <TouchableOpacity
        style={[styles.saveBtn, status === 'saving' && styles.saveBtnDisabled]}
        onPress={onSave}
        disabled={status === 'saving'}
        activeOpacity={0.8}
      >
        <Text style={styles.saveBtnText}>{strings.save}</Text>
      </TouchableOpacity>
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
    gap: spacing.md,
  },
  info: {
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
  saveBtn: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
});
