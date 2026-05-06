import theme from '~/theme';

type ShiftColorName = 'success' | 'info' | 'warning' | 'error';

interface ShiftColorConfig {
  main: string;
  light: string;
  background: string;
  surface: string;
}

const COLOR_MAP: Record<ShiftColorName, ShiftColorConfig> = {
  success: {
    main: theme.palette.success.main,
    light: theme.palette.success.light,
    background: theme.palette.success.background || theme.palette.success.light,
    surface: theme.palette.success.surface || theme.palette.success.light,
  },
  info: {
    main: theme.palette.info.main,
    light: theme.palette.info.light,
    background: theme.palette.info.background || theme.palette.info.light,
    surface: theme.palette.info.surface || theme.palette.info.light,
  },
  warning: {
    main: theme.palette.warning.main,
    light: theme.palette.warning.light,
    background: theme.palette.warning.background || theme.palette.warning.light,
    surface: theme.palette.warning.surface || theme.palette.warning.light,
  },
  error: {
    main: theme.palette.error.main,
    light: theme.palette.error.light,
    background: theme.palette.error.background || theme.palette.error.light,
    surface: theme.palette.error.surface || theme.palette.error.light,
  },
};

export const getShiftColorConfig = (colorName?: string): ShiftColorConfig => {
  if (!colorName || !(colorName in COLOR_MAP)) {
    return COLOR_MAP.info; // Default to info
  }
  return COLOR_MAP[colorName as ShiftColorName];
};
