export const formatNumber = (value: number, decimals: number = 2): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatCurrency = (
  value: number,
  symbol: string = '₱',
  decimals: number = 2
): string => {
  return `${symbol} ${formatNumber(value, decimals)}`;
};
