import React, { useState, useEffect, useCallback, Component, ReactNode } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './src/constants/theme';
import { LanguageProvider } from './src/i18n/LanguageContext';
import { CalendarHeader } from './src/components/CalendarHeader';
import { TrackingGrid } from './src/components/TrackingGrid';
import { LanguageToggle } from './src/components/LanguageToggle';
import { DayData } from './src/types';
import { PlatformKey, ColumnKey } from './src/constants/data';
import { loadDayData, saveDayData } from './src/storage/dayStorage';

class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Erro ao carregar a app</Text>
          <Text style={styles.errorText}>{this.state.error.message}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const Screen = Platform.OS === 'web' ? View : SafeAreaView;

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
    <Screen style={styles.container} {...(Platform.OS === 'web' ? {} : { edges: ['top'] as const })}>
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
    </Screen>
  );
}

export default function App() {
  const content = (
    <LanguageProvider>
      <MainApp />
    </LanguageProvider>
  );

  if (Platform.OS === 'web') {
    return <ErrorBoundary>{content}</ErrorBoundary>;
  }

  return (
    <SafeAreaProvider>
      <ErrorBoundary>{content}</ErrorBoundary>
    </SafeAreaProvider>
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
  errorBox: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
});
