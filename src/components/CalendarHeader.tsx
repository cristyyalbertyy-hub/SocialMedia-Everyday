import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors, spacing, borderRadius } from '../constants/theme';
import { useLanguage } from '../i18n/LanguageContext';
import { getDaysWithData } from '../storage/dayStorage';

interface CalendarHeaderProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  dataVersion?: number;
}

const DAY_CELL_HEIGHT = 30;

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function CalendarHeader({ selectedDate, onSelectDate, dataVersion = 0 }: CalendarHeaderProps) {
  const { strings } = useLanguage();
  const [viewMonth, setViewMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );
  const [daysWithData, setDaysWithData] = useState<Set<number>>(new Set());

  useEffect(() => {
    getDaysWithData(viewMonth.getFullYear(), viewMonth.getMonth()).then(setDaysWithData);
  }, [viewMonth, selectedDate, dataVersion]);

  useEffect(() => {
    setViewMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
  }, [selectedDate.getFullYear(), selectedDate.getMonth()]);

  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const monthName = strings.monthNames[month];

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => {
    setViewMonth(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewMonth(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    onSelectDate(today);
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const weeks: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const selectedLabel = `${selectedDate.getDate()} · ${strings.monthNames[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{strings.appTitle}</Text>
        <TouchableOpacity onPress={goToToday} style={styles.todayBtn}>
          <Text style={styles.todayBtnText}>{strings.today}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.calendar}>
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
            <Text style={styles.navText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.monthCenter}>
            <Text style={styles.monthLabel}>
              {monthName} {year}
            </Text>
            <Text style={styles.selectedDate}>{selectedLabel}</Text>
          </View>
          <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
            <Text style={styles.navText}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekHeaderRow}>
          {strings.weekDays.map((day) => (
            <Text key={day} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {weeks.map((week, weekIndex) => (
            <View key={`week-${weekIndex}`} style={styles.weekRow}>
              {week.map((day, dayIndex) => {
                if (day === null) {
                  return <View key={`empty-${weekIndex}-${dayIndex}`} style={styles.dayCell} />;
                }

                const date = new Date(year, month, day);
                const selected = isSameDay(date, selectedDate);
                const today = isToday(date);
                const hasData = daysWithData.has(day);

                return (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayCell,
                      today && styles.dayToday,
                      selected && styles.daySelected,
                    ]}
                    onPress={() => onSelectDate(date)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        today && styles.dayTextToday,
                        selected && styles.dayTextSelected,
                      ]}
                    >
                      {day}
                    </Text>
                    {hasData && !selected && <View style={styles.dot} />}
                  </TouchableOpacity>
                );
              })}
              {week.length < 7 &&
                Array.from({ length: 7 - week.length }).map((_, i) => (
                  <View key={`pad-${weekIndex}-${i}`} style={styles.dayCell} />
                ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.header,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  todayBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    backgroundColor: colors.today,
    borderRadius: borderRadius.sm,
  },
  todayBtnText: {
    fontSize: 12,
    color: colors.check,
    fontWeight: '600',
  },
  calendar: {
    marginHorizontal: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  navBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 20,
    color: colors.textLight,
  },
  monthCenter: {
    alignItems: 'center',
  },
  monthLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  selectedDate: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 2,
  },
  weekHeaderRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  weekRow: {
    flexDirection: 'row',
    height: DAY_CELL_HEIGHT,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '500',
  },
  daysGrid: {},
  dayCell: {
    flex: 1,
    height: DAY_CELL_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  dayToday: {
    backgroundColor: colors.today,
    borderRadius: borderRadius.sm,
  },
  daySelected: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  dayText: {
    fontSize: 12,
    color: colors.text,
  },
  dayTextToday: {
    fontWeight: '700',
    color: colors.check,
  },
  dayTextSelected: {
    color: colors.white,
    fontWeight: '700',
  },
  dot: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
});
