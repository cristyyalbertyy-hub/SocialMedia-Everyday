import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './src/constants/theme';
import { LanguageProvider } from './src/i18n/LanguageContext';
import { CalendarHeader } from './src/components/CalendarHeader';
import { TrackingGrid } from './src/components/TrackingGrid';
import { LanguageToggle } from './src/components/LanguageToggle';
import { DayData } from './src/types';
import { PlatformKey, ColumnKey } from './src/constants/data';
import { loadDayData, saveDayData, createEmptyDayData } from './src/storage/dayStorage';

function MainApp() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayData, setDayData] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    loadDayData(selectedDate).then((data) => {
      setDayData(data);
      setLoading(false);
    });
  }, [selectedDate]);

  const persist = useCallback(async (updated: DayData) => {
    setDayData(updated);
    await saveDayData(updated);
  }, []);

  const handleToggleTask = (platform: PlatformKey, column: ColumnKey) => {
    if (!dayData) return;
    const updated: DayData = {
      ...dayData,
      tasks: {
        ...dayData.tasks,
        [platform]: {
          ...dayData.tasks[platform],
          [column]: !dayData.tasks[platform][column],
        },
      },
    };
    persist(updated);
  };

  const handleUpdateNotes = (platform: PlatformKey, notes: string) => {
    if (!dayData) return;
    const updated: DayData = {
      ...dayData,
      notes: {
        ...dayData.notes,
        [platform]: notes,
      },
    };
    persist(updated);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.langBar}>
        <LanguageToggle compact />
      </View>
      <CalendarHeader
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
      {loading || !dayData ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <TrackingGrid
          data={dayData}
          onToggleTask={handleToggleTask}
          onUpdateNotes={handleUpdateNotes}
        />
      )}
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  langBar: {
    position: 'absolute',
    top: 8,
    right: 16,
    zIndex: 10,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
