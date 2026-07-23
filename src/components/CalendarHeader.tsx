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
}

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

export function CalendarHeader({ selectedDate, onSelectDate }: CalendarHeaderProps) {
  const { strings } = useLanguage();
  const [viewMonth, setViewMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );
  const [daysWithData, setDaysWithData] = useState<Set<number>>(new Set());

  useEffect(() => {
    getDaysWithData(viewMonth.getFullYear(), viewMonth.getMonth()).then(setDaysWithData);
  }, [viewMonth, selectedDate]);

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

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{strings.appTitle}</Text>
      </View>

      <View style={styles.dateDisplay}>
        <Text style={styles.dayNumber}>{selectedDate.getDate()}</Text>
        <View style={styles.dateInfo}>
          <Text style={styles.monthYear}>
            {strings.monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
          </Text>
          {isToday(selectedDate) && (
            <View style={styles.todayBadge}>
              <Text style={styles.todayText}>{strings.today}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.calendar}>
        <View style={styles.monthNav}>
          <TouchableOpacity onPress={prevMonth} style={styles.navBtn}>
            <Text style={styles.navText}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.monthLabel}>
            {monthName} {year}
          </Text>
          <TouchableOpacity onPress={nextMonth} style={styles.navBtn}>
            <Text style={styles.navText}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekRow}>
          {strings.weekDays.map((day) => (
            <Text key={day} style={styles.weekDay}>
              {day}
            </Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {cells.map((day, index) => {
            if (day === null) {
              return <View key={`empty-${index}`} style={styles.dayCell} />;
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
        </View>

        <TouchableOpacity onPress={goToToday} style={styles.todayBtn}>
          <Text style={styles.todayBtnText}>{strings.today}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.header,
    borderBottomLeftRadius: borderRadius.lg,
    borderBottomRightRadius: borderRadius.lg,
    paddingBottom: spacing.lg,
  },
  headerRow: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  dateDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  dayNumber: {
    fontSize: 48,
    fontWeight: '300',
    color: colors.primary,
    lineHeight: 52,
  },
  dateInfo: {
    flex: 1,
  },
  monthYear: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  todayBadge: {
    backgroundColor: colors.today,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
    marginTop: spacing.xs,
  },
  todayText: {
    fontSize: 12,
    color: colors.check,
    fontWeight: '600',
  },
  calendar: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  navBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navText: {
    fontSize: 24,
    color: colors.textLight,
  },
  monthLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
  weekRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
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
    fontSize: 14,
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
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  todayBtn: {
    alignSelf: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
  todayBtnText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
});
