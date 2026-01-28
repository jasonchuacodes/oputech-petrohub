import type { ReactNode } from 'react';
import type { Dayjs } from 'dayjs';
import type { DateRange } from '../DateRangePicker';

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

export type DataTableSearchProps = {
  enabled: boolean;
  placeholder: string;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

export type DataTableDateRangeProps = {
  enabled: boolean;
  label?: string;
  startValue?: Dayjs | null;
  endValue?: Dayjs | null;
  defaultStartValue?: Dayjs | null;
  defaultEndValue?: Dayjs | null;
  onRangeChange?: (range: DateRange) => void;
};

export type DataTableProps<T> = {
  id: string;
  collection: DataTableCollection<T>;
  columns: DataTableColumn<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  search?: DataTableSearchProps;
  dateRange?: DataTableDateRangeProps;
};

export type SortConfig = {
  key: string;
  direction: SortDirection;
} | null;
