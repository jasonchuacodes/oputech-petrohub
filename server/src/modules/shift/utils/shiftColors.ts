export const SHIFT_COLOR_PALETTE = [
  '#E8F5E9', // Light green
  '#FFF4E5', // Light orange
  '#F3E5F5', // Light purple
  '#FFF9C4', // Light yellow
  '#E5F3FF', // Light blue
];

export const getNextShiftColor = (shiftIndex: number): string => {
  return SHIFT_COLOR_PALETTE[shiftIndex % SHIFT_COLOR_PALETTE.length];
};
