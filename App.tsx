import React, { useState, useEffect, useCallback, useRef, Component, ReactNode } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Platform,
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { colors } from './src/constants/theme';
import { LanguageProvider } from './src/i18n/LanguageContext';
import { CalendarHeader } from './src/components/CalendarHeader';
import { TrackingGrid } from './src/components/TrackingGrid';
import { LanguageToggle } from './src/components/LanguageToggle';
import { SaveStatus } from './src/components/SaveBar';
import { useLanguage } from './src/i18n/LanguageContext';
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
  const { strings } = useLanguage();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dayData, setDayData] = useState<DayData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [dataVersion, setDataVersion] = useState(0);
  const savedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const notesTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      document.body.style.overflow = 'auto';
      document.documentElement.style.height = '100%';
      document.body.style.height = '100%';
    }
  }, []);

  useEffect(() => {
    return () => {
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
      if (notesTimerRef.current) clearTimeout(notesTimerRef.current);
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    setSaveStatus('idle');
    loadDayData(selectedDate).then((data) => {
      setDayData(data);
      setLoading(false);
    });
  }, [selectedDate]);

  const markSaved = useCallback(() => {
    setDataVersion((v) => v + 1);
    setSaveStatus('saved');
    if (savedTimerRef.current) clearTimeout(savedTimerRef.current);
    savedTimerRef.current = setTimeout(() => setSaveStatus('idle'), 2500);
  }, []);

  const persist = useCallback(
    async (updated: DayData) => {
      setDayData(updated);
      setSaveStatus('saving');
      try {
        await saveDayData(updated);
        markSaved();
      } catch {
        setSaveStatus('idle');
      }
    },
    [markSaved]
  );

  const handleManualSave = useCallback(async () => {
    if (!dayData) return;
    setSaveStatus('saving');
    try {
      await saveDayData(dayData);
      markSaved();
    } catch {
      setSaveStatus('idle');
    }
  }, [dayData, markSaved]);

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
    setDayData(updated);
    if (notesTimerRef.current) clearTimeout(notesTimerRef.current);
    notesTimerRef.current = setTimeout(() => persist(updated), 600);
  };

  return (
    <Screen
      style={styles.container}
      {...(Platform.OS === 'web' ? {} : { edges: ['top'] as const })}
    >
      <StatusBar style="dark" />
      <View style={styles.langBar}>
        <LanguageToggle compact />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
        keyboardShouldPersistTaps="handled"
      >
        <CalendarHeader
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          dataVersion={dataVersion}
        />

        <Text style={styles.scrollHint}>{strings.scrollHint}</Text>

        {loading || !dayData ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <TrackingGrid
            data={dayData}
            selectedDate={selectedDate}
            saveStatus={saveStatus}
            onToggleTask={handleToggleTask}
            onUpdateNotes={handleUpdateNotes}
            onSave={handleManualSave}
          />
        )}
      </ScrollView>
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
    ...(Platform.OS === 'web'
      ? ({ height: '100vh', maxHeight: '100vh' } as object)
      : {}),
  },
  langBar: {
    position: 'absolute',
    top: 8,
    right: 16,
    zIndex: 10,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
  scrollHint: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textMuted,
    paddingVertical: 8,
  },
  loading: {
    paddingVertical: 48,
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
