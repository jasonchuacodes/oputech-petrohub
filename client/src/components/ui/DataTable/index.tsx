import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { KeyboardArrowDownOutlined } from '@mui/icons-material';
import { useMemo, useState } from 'react';

import { LoadingSpinner } from '../LoadingSpinner';
import { NoData } from '../NoData';
import { Paper } from '../Paper';
import type { DataTableCollection, DataTableProps, SortConfig } from './types';
import { compareValues, getSortableValue } from './utils';

export const DataTable = <T,>({
  id,
  collection,
  columns,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
}: DataTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);

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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" pt={10}>
        <LoadingSpinner />
      </Box>
    );
  }

  if (collection.items.length === 0) {
    return <NoData text={emptyMessage} />;
  }

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
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
                  borderBottom: '1px solid',
                  borderColor: 'divider',
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
                      borderBottom: itemIndex === sortedItems.length - 1 ? undefined : '1px solid',
                      borderColor: itemIndex === sortedItems.length - 1 ? undefined : 'divider',
                    }}
                  >
                    {column.cell(item)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
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
