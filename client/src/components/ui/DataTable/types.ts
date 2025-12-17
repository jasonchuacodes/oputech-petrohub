import type { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc';

export type DataTableColumn<T> = {
  id: string;
  heading: string;
  align?: 'left' | 'center' | 'right';
  orderable?: boolean;
  cell: (item: T) => ReactNode;
  width?: number | string;
  link?: boolean;
};

export type DataTableCollection<T> = {
  items: T[];
  itemToValue: (item: T) => string | number;
  itemToString: (item: T) => string;
};

export type DataTableProps<T> = {
  id: string;
  collection: DataTableCollection<T>;
  columns: DataTableColumn<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
};

export type SortConfig = {
  key: string;
  direction: SortDirection;
} | null;
