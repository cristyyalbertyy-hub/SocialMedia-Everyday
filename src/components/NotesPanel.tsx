import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../constants/theme';
import { useLanguage } from '../i18n/LanguageContext';

interface NotesPanelProps {
  value: string;
  onChange: (text: string) => void;
}

export function NotesPanel({ value, onChange }: NotesPanelProps) {
  const { strings } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{strings.notes}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={strings.notesPlaceholder}
        placeholderTextColor={colors.textMuted}
        multiline
        textAlignVertical="top"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.xs,
  },
  label: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: spacing.xs,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    minHeight: 48,
    fontSize: 14,
    color: colors.text,
  },
});
