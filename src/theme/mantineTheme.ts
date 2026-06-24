import { createTheme, type MantineColorsTuple } from '@mantine/core';
import { tokens } from './tokens';

/**
 * Mantine theme override that pulls from BIQ design tokens.
 * Primary palette generated around #435d7d (BS-6159 --primary-color).
 */
const biq: MantineColorsTuple = [
  '#f0f4f8',
  '#dfe7ee',
  '#b0c4d8',
  '#8aa6c3',
  '#6f86ae',
  '#5a7298',
  '#4a6184',
  '#435d7d',
  '#37506e',
  '#304e72',
];

export const mantineTheme = createTheme({
  primaryColor: 'biq',
  primaryShade: { light: 7, dark: 9 },
  colors: { biq },
  fontFamily: tokens.font.family,
  fontSizes: {
    xs: tokens.font.sizeSmall,
    sm: tokens.font.sizeBase,
    md: '1rem',
    lg: '1.125rem',
    xl: tokens.font.sizeTitle,
  },
  defaultRadius: tokens.radius.base,
  headings: { fontFamily: tokens.font.family },
});
