import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';
import { useLanguage } from '../i18n/LanguageContext';
import { PLATFORMS, PlatformKey, ColumnKey } from '../constants/data';
import { DayData } from '../types';
import { SocialMediaPanel } from './SocialMediaPanel';

interface TrackingGridProps {
  data: DayData;
  onToggleTask: (platform: PlatformKey, column: ColumnKey) => void;
  onUpdateNotes: (platform: PlatformKey, notes: string) => void;
}

export function TrackingGrid({ data, onToggleTask, onUpdateNotes }: TrackingGridProps) {
  const { strings } = useLanguage();

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{strings.dayView}</Text>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
});
