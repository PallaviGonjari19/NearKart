import { StyleSheet } from 'react-native';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const radius = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 999,
};

export const colors = {
  white: '#ffffff',
  bg: '#f8fafc',
  surface: '#ffffff',
  surfaceAlt: '#f1f5f9',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  text: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  primary: '#059669',
  primaryDark: '#047857',
  primaryLight: '#d1fae5',
  primarySoft: '#ecfdf5',
  danger: '#ef4444',
  dangerSoft: '#fee2e2',
  warning: '#f59e0b',
  warningSoft: '#fef3c7',
  accent: '#2563eb',
  accentSoft: '#eff6ff',
  shadow: 'rgba(15, 23, 42, 0.06)',
};

export const typography = {
  hero: { fontFamily: 'Inter-Bold', fontSize: 26, lineHeight: 32, color: colors.text },
  h1: { fontFamily: 'Inter-Bold', fontSize: 22, lineHeight: 28, color: colors.text },
  h2: { fontFamily: 'Inter-SemiBold', fontSize: 18, lineHeight: 24, color: colors.text },
  h3: { fontFamily: 'Inter-SemiBold', fontSize: 16, lineHeight: 22, color: colors.text },
  body: { fontFamily: 'Inter-Regular', fontSize: 14, lineHeight: 21, color: colors.textSecondary },
  bodyMedium: { fontFamily: 'Inter-Medium', fontSize: 14, lineHeight: 21, color: colors.text },
  small: { fontFamily: 'Inter-Regular', fontSize: 12, lineHeight: 17, color: colors.textMuted },
  smallMedium: { fontFamily: 'Inter-Medium', fontSize: 12, lineHeight: 17, color: colors.textSecondary },
  caption: { fontFamily: 'Inter-Regular', fontSize: 11, lineHeight: 15, color: colors.textMuted },
};

export const shadows = {
  sm: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    ...typography.h2,
    marginBottom: spacing.sm,
    marginTop: spacing.xl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
});
