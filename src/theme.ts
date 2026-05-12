// Paleta verde del brief Santurbán + acentos semánticos.
// Estos tokens se usan en línea (style={...}) porque la app no usa Tailwind
// ni CSS modules; el dark mode sigue manejándose con CSS vars en GlobalStyles.

export const COLORS = {
  PRIMARY: '#1B5E20',
  PRIMARY_DARK: '#2E7D32',
  PRIMARY_LIGHT: '#C8E6C9',

  WARN_BG: '#fef3dc',
  WARN_FG: '#854f0b',

  DANGER_BG: '#fcebeb',
  DANGER_FG: '#a32d2d',

  INFO_BG: '#e8f2fc',
  INFO_FG: '#185fa5',

  OK_BG: '#e9f7f1',
  OK_FG: '#0f6e56',

  ACCENT_ORANGE: '#d85a30',
} as const;

// Tamaños táctiles del brief (manos con guantes / pantallas mojadas).
export const TOUCH = {
  CTA_MIN: 52, // px — botones principales
  NAV_MIN: 56, // px — bottom nav
  PILL_MIN: 36, // px — pills de filtro
  FONT_ACTION: 16, // px — texto de acción
  FONT_SECONDARY: 12, // px — metadata
} as const;
