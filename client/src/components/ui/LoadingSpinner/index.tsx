import { CircularProgress } from '@mui/material';

type LoadingSpinnerProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
};

export const LoadingSpinner = ({ size = 'md' }: LoadingSpinnerProps) => {
  const sizeMap: Record<string, number> = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  return <CircularProgress size={sizeMap[size]} />;
};
