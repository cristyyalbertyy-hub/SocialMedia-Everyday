import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, borderRadius } from '../constants/theme';

interface CheckCellProps {
  checked: boolean;
  onToggle: () => void;
  compact?: boolean;
}

export function CheckCell({ checked, onToggle, compact }: CheckCellProps) {
  return (
    <TouchableOpacity
      style={[styles.cell, compact && styles.cellCompact, checked && styles.cellChecked]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      {checked && <Text style={[styles.checkmark, compact && styles.checkmarkCompact]}>✓</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellCompact: {
    width: 30,
    height: 30,
  },
  cellChecked: {
    backgroundColor: colors.checkBg,
    borderColor: colors.check,
  },
  checkmark: {
    fontSize: 18,
    color: colors.check,
    fontWeight: '600',
  },
  checkmarkCompact: {
    fontSize: 15,
  },
});
