export const formatNumber = (
  value: number | string,
  decimals: number = 2,
  digits?: number
): string => {
  const num = Number(value);

  if (Number.isNaN(num)) return '0.00';

  return num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    ...(digits != null && { minimumIntegerDigits: digits }),
  });
};

export const formatCurrency = (
  value: number,
  symbol: string = '₱',
  decimals: number = 2
): string => {
  return `${symbol}${formatNumber(value, decimals)}`;
};
