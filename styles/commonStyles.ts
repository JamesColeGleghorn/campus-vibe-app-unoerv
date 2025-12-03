
import { StyleSheet, useColorScheme } from 'react-native';

export const useThemeColors = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    primary: '#4A90E2',
    secondary: '#357ABD',
    accent: '#50C878',
    background: isDark ? '#1A1A1A' : '#FFFFFF',
    backgroundAlt: isDark ? '#2A2A2A' : '#F8F9FA',
    text: isDark ? '#FFFFFF' : '#2C3E50',
    textSecondary: isDark ? '#B0B0B0' : '#7F8C8D',
    grey: isDark ? '#666666' : '#BDC3C7',
    card: isDark ? '#2A2A2A' : '#FFFFFF',
    border: isDark ? '#3A3A3A' : '#E1E8ED',
    warning: '#F39C12',
    danger: '#E74C3C',
    success: '#27AE60',
  };
};

export const colors = {
  primary: '#4A90E2',
  secondary: '#357ABD',
  accent: '#50C878',
  background: '#FFFFFF',
  backgroundAlt: '#F8F9FA',
  text: '#2C3E50',
  textSecondary: '#7F8C8D',
  grey: '#BDC3C7',
  card: '#FFFFFF',
  border: '#E1E8ED',
  warning: '#F39C12',
  danger: '#E74C3C',
  success: '#27AE60',
};

export const buttonStyles = StyleSheet.create({
  primary: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  secondary: {
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
  accent: {
    backgroundColor: colors.accent,
    alignSelf: 'center',
    width: '100%',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.text,
    lineHeight: 24,
  },
  textSecondary: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 20,
  },
  section: {
    marginBottom: 24,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    backgroundColor: colors.backgroundAlt,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
});
