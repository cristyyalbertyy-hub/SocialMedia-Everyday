import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { useLanguage } from '../i18n/LanguageContext';
import { PLATFORMS, PlatformKey, ColumnKey } from '../constants/data';
import { DayData } from '../types';
import { SocialMediaPanel } from './SocialMediaPanel';
import { SaveBar, SaveStatus } from './SaveBar';

interface TrackingGridProps {
  data: DayData;
  selectedDate: Date;
  saveStatus: SaveStatus;
  onToggleTask: (platform: PlatformKey, column: ColumnKey) => void;
  onUpdateNotes: (platform: PlatformKey, notes: string) => void;
  onSave: () => void;
}

export function TrackingGrid({
  data,
  selectedDate,
  saveStatus,
  onToggleTask,
  onUpdateNotes,
  onSave,
}: TrackingGridProps) {
  const { strings } = useLanguage();
  const dateLabel = `${selectedDate.getDate()} ${strings.monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>
        {strings.dayView} — {dateLabel}
      </Text>

      {PLATFORMS.map((platform) => (
        <SocialMediaPanel
          key={platform}
          platform={platform}
          tasks={data.tasks[platform]}
          notes={data.notes[platform]}
          onToggleTask={(col) => onToggleTask(platform, col)}
          onUpdateNotes={(text) => onUpdateNotes(platform, text)}
        />
      ))}

      <SaveBar dateLabel={dateLabel} status={saveStatus} onSave={onSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
});
