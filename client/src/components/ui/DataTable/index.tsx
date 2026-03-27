import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import {
  FilterAltOutlined,
  KeyboardArrowDownOutlined,
  FileDownloadOutlined,
} from '@mui/icons-material';
import { useMemo, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Button } from '../Button';
import { DateRangePicker } from '../DateRangePicker';
import { SearchInput } from '../../form';
import { LoadingSpinner } from '../LoadingSpinner';
import { NoData } from '../NoData';
import { Paper } from '../Paper';
import { Show } from '../Show';
import { DataTableContext } from './context';
import { useDateRange } from './hooks/useDateRange';
import { usePagination } from './hooks/usePagination';
import { useSearch } from './hooks/useSearch';
import { Pagination } from './Pagination';
import type { DataTableCollection, DataTableProps, SortConfig } from './types';
import { compareValues, getSortableValue } from './utils';

export const DataTable = <T,>({
  id,
  collection,
  columns,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  search,
  dateRange,
  onExport,
  pagination,
}: DataTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const paginationState = usePagination(pagination);

  const searchState = useSearch(search);
  const [value, setValue] = useState(searchState.value);
  const setExternalValue = useDebouncedCallback(searchState.setValue, 250);

  const dateRangeState = useDateRange(dateRange);
  const [startValue, setStartValue] = useState(dateRangeState.startValue);
  const [endValue, setEndValue] = useState(dateRangeState.endValue);

  const handleSort = (columnId: string) => {
    setSortConfig((prevSort) => {
      if (prevSort?.key === columnId) {
        return {
          key: columnId,
          direction: prevSort.direction === 'asc' ? 'desc' : 'asc',
        };
      }

      return { key: columnId, direction: 'asc' };
    });
  };

  const sortedItems = useMemo(() => {
    if (!sortConfig) return collection.items;

    const column = columns.find((col) => col.id === sortConfig.key);
    if (!column || !column.orderable) return collection.items;

    return [...collection.items].sort((a, b) => {
      const aVal = getSortableValue(a, sortConfig.key);
      const bVal = getSortableValue(b, sortConfig.key);

      const comparison = compareValues(aVal, bVal);
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [collection.items, sortConfig, columns]);

  const hasSummaryRow = useMemo(() => columns.some((col) => col.summary !== undefined), [columns]);

  const empty = !loading && collection.items.length === 0;

  return (
    <DataTableContext.Provider value={{ pagination: paginationState }}>
    <TableContainer component={Paper} sx={{ borderRadius: 2, overflowX: 'auto', maxWidth: '100%' }}>
      {(searchState.enabled || dateRangeState.enabled || onExport) && (
        <Stack direction="row" spacing={1} p={2} justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={1} alignItems="center">
            {searchState.enabled && (
              <SearchInput
                placeholder={searchState.placeholder}
                value={value}
                onChange={(newValue) => {
                  setValue(newValue);
                  setExternalValue(newValue);
                }}
              />
            )}
            {dateRangeState.enabled && (
              <DateRangePicker
                selectedStart={startValue}
                selectedEnd={endValue}
                label={dateRangeState.label}
                onAccept={(range) => {
                  setStartValue(range.start ?? null);
                  setEndValue(range.end ?? null);

                  dateRangeState.setRangeValue(range);
                }}
              />
            )}
            <Button
              startIcon={<FilterAltOutlined fontSize="small" sx={{ color: 'text.secondary' }} />}
              variant="outlined"
            >
              Filter
            </Button>
          </Stack>
          <Show when={!!onExport}>
            <Button
              startIcon={<FileDownloadOutlined />}
              onClick={onExport}
              variant="contained"
              sx={{ height: 40, flexShrink: 0 }}
            >
              Export
            </Button>
          </Show>
        </Stack>
      )}

      <Table sx={{ minWidth: 650 }} id={id}>
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.id}
                align={column.align || 'left'}
                sx={{
                  width: column.width,
                  color: 'text.secondary',
                  height: 40,
                  py: 0,
                  bgcolor: 'background.surface',
                  borderTop: '1px solid',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  whiteSpace: 'nowrap',
                }}
              >
                {column.orderable ? (
                  <TableSortLabel
                    active={sortConfig?.key === column.id}
                    direction={sortConfig?.key === column.id ? sortConfig.direction : 'asc'}
                    onClick={() => handleSort(column.id)}
                    IconComponent={KeyboardArrowDownOutlined}
                    sx={{
                      gap: 1,
                      '& .MuiTableSortLabel-icon': {
                        opacity: 0.5,
                      },
                    }}
                  >
                    {column.heading}
                  </TableSortLabel>
                ) : (
                  column.heading
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <Show
            when={!loading}
            fallback={
              <TableRow>
                <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 8 }}>
                  <LoadingSpinner />
                </TableCell>
              </TableRow>
            }
          >
            {sortedItems.map((item, itemIndex) => {
              const key = collection.itemToValue(item);
              const ariaLabel = collection.itemToString(item);

              return (
                <TableRow
                  key={key}
                  onClick={onRowClick ? () => onRowClick(item) : undefined}
                  sx={{
                    ...(onRowClick && {
                      cursor: 'pointer',
                      ':hover': {
                        backgroundColor: 'background.surface',
                      },
                    }),
                  }}
                  aria-label={ariaLabel}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align || 'left'}
                      component={column.id === columns[0].id ? 'th' : undefined}
                      scope={column.id === columns[0].id ? 'row' : undefined}
                      sx={{
                        borderBottom: itemIndex === sortedItems.length - 1 ? 'none' : '1px solid',
                        borderColor: itemIndex === sortedItems.length - 1 ? undefined : 'divider',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {column.cell(item)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </Show>

          <Show when={hasSummaryRow && sortedItems.length > 1}>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || 'left'}
                  component={undefined}
                  sx={{
                    bgcolor: 'background.surface',
                    borderTop: '1px solid',
                    borderBottom: 'none',
                    borderColor: 'divider',
                    fontWeight: 'medium',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {column.summary ? column.summary(sortedItems) : null}
                </TableCell>
              ))}
            </TableRow>
          </Show>

          <Show when={empty}>
            <TableRow>
              <TableCell colSpan={columns.length} sx={{ textAlign: 'center', py: 8 }}>
                <NoData text={emptyMessage} />
              </TableCell>
            </TableRow>
          </Show>
        </TableBody>
      </Table>
      <Pagination />
    </TableContainer>
    </DataTableContext.Provider>
  );
};

// Static collection helper method
DataTable.collection = <T,>({
  items,
  itemToValue,
  itemToString,
}: {
  items: T[];
  itemToValue: (item: T) => string | number;
  itemToString: (item: T) => string;
}): DataTableCollection<T> => ({
  items,
  itemToValue,
  itemToString,
});
