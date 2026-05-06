export const SHIFT_COLOR_PALETTE = ['success', 'info', 'warning', 'error'] as const;

export type ShiftColorName = (typeof SHIFT_COLOR_PALETTE)[number];

export const getNextShiftColor = (shiftIndex: number): ShiftColorName => {
  return SHIFT_COLOR_PALETTE[shiftIndex % SHIFT_COLOR_PALETTE.length];
};
