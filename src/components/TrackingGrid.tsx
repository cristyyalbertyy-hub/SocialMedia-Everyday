import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../constants/theme';
import { useLanguage } from '../i18n/LanguageContext';
import { PLATFORMS, COLUMNS, PlatformKey, ColumnKey } from '../constants/data';
import { DayData } from '../types';
import { CheckCell } from './CheckCell';
import { NotesPanel } from './NotesPanel';

interface TrackingGridProps {
  data: DayData;
  onToggleTask: (platform: PlatformKey, column: ColumnKey) => void;
  onUpdateNotes: (platform: PlatformKey, notes: string) => void;
}

export function TrackingGrid({ data, onToggleTask, onUpdateNotes }: TrackingGridProps) {
  const { strings } = useLanguage();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.sectionTitle}>{strings.dayView}</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={styles.headerRow}>
            <View style={styles.platformHeader} />
            {COLUMNS.map((col) => (
              <View key={col} style={styles.colHeader}>
                <Text style={styles.colHeaderText} numberOfLines={2}>
                  {strings.columns[col]}
                </Text>
              </View>
            ))}
          </View>

          {PLATFORMS.map((platform) => (
            <View key={platform}>
              <View style={styles.row}>
                <View style={styles.platformCell}>
                  <Text style={styles.platformName}>
                    {strings.platforms[platform]}
                  </Text>
                </View>
                {COLUMNS.map((col) => (
                  <View key={col} style={styles.cellWrapper}>
                    <CheckCell
                      checked={data.tasks[platform][col]}
                      onToggle={() => onToggleTask(platform, col)}
                    />
                  </View>
                ))}
              </View>
              <NotesPanel
                platform={platform}
                value={data.notes[platform]}
                onChange={(text) => onUpdateNotes(platform, text)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
}

const COL_WIDTH = 72;
const PLATFORM_WIDTH = 100;

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
  },
  platformHeader: {
    width: PLATFORM_WIDTH,
  },
  colHeader: {
    width: COL_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  colHeaderText: {
    fontSize: 11,
    color: colors.textLight,
    fontWeight: '600',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  platformCell: {
    width: PLATFORM_WIDTH,
    paddingRight: spacing.sm,
  },
  platformName: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  cellWrapper: {
    width: COL_WIDTH,
    alignItems: 'center',
  },
});
