import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius } from '../constants/theme';
import { useLanguage } from '../i18n/LanguageContext';

interface LanguageToggleProps {
  compact?: boolean;
}

export function LanguageToggle({ compact }: LanguageToggleProps) {
  const { language, setLanguage, strings } = useLanguage();

  return (
    <View style={[styles.container, compact && styles.compact]}>
      {!compact && <Text style={styles.label}>{strings.language}</Text>}
      <View style={styles.toggle}>
        <TouchableOpacity
          style={[styles.btn, language === 'pt' && styles.btnActive]}
          onPress={() => setLanguage('pt')}
        >
          <Text style={[styles.btnText, language === 'pt' && styles.btnTextActive]}>
            PT
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.btn, language === 'en' && styles.btnActive]}
          onPress={() => setLanguage('en')}
        >
          <Text style={[styles.btnText, language === 'en' && styles.btnTextActive]}>
            EN
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  compact: {
    gap: 0,
  },
  label: {
    fontSize: 13,
    color: colors.textLight,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceAlt,
    borderRadius: borderRadius.sm,
    padding: 2,
  },
  btn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm - 2,
  },
  btnActive: {
    backgroundColor: colors.primary,
  },
  btnText: {
    fontSize: 13,
    color: colors.textLight,
    fontWeight: '500',
  },
  btnTextActive: {
    color: colors.white,
  },
});
