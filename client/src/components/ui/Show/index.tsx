import type { ReactNode } from 'react';

interface ShowProps {
  when: boolean;
  fallback?: ReactNode;
  children: ReactNode;
}

export const Show = ({ when, fallback, children }: ShowProps) => {
  if (when) return <>{children}</>;
  if (fallback) return <>{fallback}</>;
  return null;
};
