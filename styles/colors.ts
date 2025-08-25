export const colors = {
  // Primary brand colors - sophisticated blue palette
  primary: '#2563EB', 
  primaryLight: '#3B82F6', 
  primaryDark: '#1D4ED8',
  primarySoft: '#EFF6FF',
  
  // Backgrounds - clean and modern
  background: '#FAFBFC',
  cardBackground: '#FFFFFF',
  secondaryBackground: '#F8FAFC',
  surfaceElevated: '#FFFFFF',
  
  // Text hierarchy - improved contrast
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textTertiary: '#64748B',
  textQuaternary: '#94A3B8',
  textDisabled: '#CBD5E1',
  textInverse: '#FFFFFF',
  
  // Borders and dividers - subtle and refined
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  divider: '#E8EEF7',
  
  // Status colors - vibrant but professional
  success: '#059669',
  successLight: '#ECFDF5',
  warning: '#D97706',
  warningLight: '#FFFBEB',
  error: '#DC2626',
  errorLight: '#FEF2F2',
  info: '#0284C7',
  infoLight: '#F0F9FF',
  
  // Shadows - more sophisticated
  shadow: 'rgba(15, 23, 42, 0.08)',
  shadowMedium: 'rgba(15, 23, 42, 0.12)',
  shadowDark: 'rgba(15, 23, 42, 0.16)',
  
  // Scanner specific colors
  scannerOverlay: 'rgba(0, 0, 0, 0.7)',
  scannerFrame: '#FFFFFF',
  cropHandle: '#2563EB',
};

export const spacing = { 
  xs: 4, 
  sm: 8, 
  md: 12, 
  lg: 16, 
  xl: 20,
  xxl: 24, 
  giant: 32,
  massive: 40,
  screen: 16
};

export const typography = {
  // Display text
  display: { 
    fontSize: 32, 
    fontWeight: '700' as const, 
    fontFamily: 'System',
    lineHeight: 40,
    letterSpacing: -0.5
  },
  
  // Headlines
  title: { 
    fontSize: 28, 
    fontWeight: '700' as const, 
    fontFamily: 'System',
    lineHeight: 36,
    letterSpacing: -0.4
  },
  h1: { 
    fontSize: 24, 
    fontWeight: '600' as const, 
    fontFamily: 'System',
    lineHeight: 32,
    letterSpacing: -0.3
  },
  h2: { 
    fontSize: 20, 
    fontWeight: '600' as const, 
    fontFamily: 'System',
    lineHeight: 28,
    letterSpacing: -0.2
  },
  h3: { 
    fontSize: 18, 
    fontWeight: '600' as const, 
    fontFamily: 'System',
    lineHeight: 26,
    letterSpacing: -0.1
  },
  
  // Body text
  body: { 
    fontSize: 16, 
    fontWeight: '400' as const, 
    fontFamily: 'System',
    lineHeight: 24
  },
  bodyMedium: { 
    fontSize: 16, 
    fontWeight: '500' as const, 
    fontFamily: 'System',
    lineHeight: 24
  },
  bodySemibold: { 
    fontSize: 16, 
    fontWeight: '600' as const, 
    fontFamily: 'System',
    lineHeight: 24
  },
  
  // Supporting text
  caption: { 
    fontSize: 14, 
    fontWeight: '400' as const, 
    fontFamily: 'System',
    lineHeight: 20
  },
  captionMedium: { 
    fontSize: 14, 
    fontWeight: '500' as const, 
    fontFamily: 'System',
    lineHeight: 20
  },
  small: { 
    fontSize: 12, 
    fontWeight: '400' as const, 
    fontFamily: 'System',
    lineHeight: 16
  },
  smallMedium: { 
    fontSize: 12, 
    fontWeight: '500' as const, 
    fontFamily: 'System',
    lineHeight: 16
  },
  
  // UI elements
  button: { 
    fontSize: 16, 
    fontWeight: '600' as const, 
    fontFamily: 'System',
    lineHeight: 20
  },
  label: { 
    fontSize: 14, 
    fontWeight: '500' as const, 
    fontFamily: 'System',
    lineHeight: 18,
    letterSpacing: 0.1
  }
};

export const shadows = {
  none: {},
  small: { 
    shadowColor: colors.shadow, 
    shadowOffset: { width: 0, height: 1 }, 
    shadowOpacity: 1, 
    shadowRadius: 2, 
    elevation: 1 
  },
  medium: { 
    shadowColor: colors.shadowMedium, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 1, 
    shadowRadius: 8, 
    elevation: 3 
  },
  large: { 
    shadowColor: colors.shadowDark, 
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 1, 
    shadowRadius: 16, 
    elevation: 6 
  },
  floating: { 
    shadowColor: colors.shadowDark, 
    shadowOffset: { width: 0, height: 12 }, 
    shadowOpacity: 1, 
    shadowRadius: 24, 
    elevation: 8 
  }
};

export const borderRadius = { 
  none: 0,
  xs: 2,
  sm: 4, 
  md: 8, 
  lg: 12, 
  xl: 16,
  xxl: 20,
  full: 999 
};

export default { colors, spacing, typography, shadows, borderRadius };
