/**
 * BIQ V5.1 design tokens — ported from BS-6159 standardization
 * Source: App_Themes/Theme1/CSSDefault/_defaultSettings.scss (legacy project)
 *
 * Keep this file as the single source of truth. CSS variables in cssVars.css
 * and Mantine theme in mantineTheme.ts both derive from these values.
 */
export const tokens = {
  color: {
    primary: '#435d7d',
    primaryDark: '#304e72',
    primaryLight: '#6f86ae',
    primaryFocus: '#80bdff',
    success: '#258f59',
    danger: '#bd2130',
    warning: '#f7be38',
    grayDarker: '#6a6a6a',
    grayColor: '#d6dee8',
    whiteDarker: '#f0f0f0',
    whiteColor: '#ffffff',
    blackColor: '#1a1a1a',
    tableSubheaderBg: '#f5f5f5',
    tableRowEven: '#f7f7f7',
    tableRowSelectedBg: '#435d7d',
    tableRowSelectedText: '#ffffff',
    tableRowFocus: '#eaf2fb',
    btnConfirmBg: '#435d7d',
    btnConfirmText: '#ffffff',
    btnCancelBg: '#ffffff',
    btnCancelText: '#435d7d',
    popupHeaderBg: '#435d7d',
    popupHeaderText: '#ffffff',
    popupBodyBg: '#f4f7fb',
  },
  font: {
    sizeBase: '0.875rem',
    sizeTitle: '1.5rem',
    sizeSmall: '0.75rem',
    family: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    weightNormal: 400,
    weightMedium: 500,
    weightBold: 600,
    weightBolder: 700,
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
  },
  radius: {
    base: '4px',
    button: '4px',
  },
  shadow: {
    effect1: '0 2px 4px rgba(0,0,0,0.16)',
    card: '0 4px 12px rgba(0,0,0,0.08)',
    bottomOnly: '0 2px 4px -1px rgba(0,0,0,0.1)',
  },
  layout: {
    filterWidth: '20%',
    filterMinWidth: '18rem',
    pageBodyPadding: '0.5rem 1rem',
    pageBodyGap: '1rem',
  },
} as const;

export type Tokens = typeof tokens;
