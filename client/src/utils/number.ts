export const formatNumber = (
  value: number | string,
  decimals: number = 2
): string => {
  const num = Number(value);

  if (Number.isNaN(num)) return '0.00';

  return num.toLocaleString('en-US', {
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
