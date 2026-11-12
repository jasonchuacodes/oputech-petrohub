import { ChevronDown, ChevronUp } from 'lucide-react'
import { useMemo, useState, type ReactNode } from 'react'
import { cn } from '~/utils/cn'
import { Spinner } from './spinner'

type SortDirection = 'asc' | 'desc'
type SortConfig = { key: string; direction: SortDirection } | null

export interface DataTableColumn<T> {
  id: string
  heading: string
  cell: (item: T, index: number) => ReactNode
  orderable?: boolean
  width?: string | number
  align?: 'left' | 'center' | 'right'
  footer?: ReactNode
}

export interface DataTableCollection<T> {
  items: T[]
  itemToValue: (item: T) => string | number
  itemToString: (item: T) => string
}

type DataTableProps<T> = {
  id?: string
  collection: DataTableCollection<T>
  columns: DataTableColumn<T>[]
  onRowClick?: (item: T) => void
  loading?: boolean
  emptyMessage?: string
  footer?: ReactNode
  compact?: boolean
}

const alignClass = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

function getSortableValue<T>(item: T, key: string): string | number {
  return ((item as Record<string, unknown>)[key] as string | number) ?? ''
}

function compareValues(a: string | number, b: string | number): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b))
}

function DataTableComponent<T>({
  id,
  collection,
  columns,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  footer,
  compact = false,
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)
  const sortedItems = useMemo(() => {
    if (!sortConfig) return collection.items
    const column = columns.find((candidate) => candidate.id === sortConfig.key)
    if (!column?.orderable) return collection.items
    return [...collection.items].sort((a, b) => {
      const result = compareValues(
        getSortableValue(a, sortConfig.key),
        getSortableValue(b, sortConfig.key),
      )
      return sortConfig.direction === 'asc' ? result : -result
    })
  }, [collection.items, columns, sortConfig])
  const empty = !loading && collection.items.length === 0

  const handleSort = (key: string) => {
    setSortConfig((current) =>
      current?.key === key
        ? { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )
  }

  return (
    <div className="overflow-x-auto rounded-md bg-card shadow-card ring-1 ring-border/60">
      <table id={id} className="w-full min-w-190 text-sm">
        <thead>
          <tr className="border-b border-border bg-card">
            {columns.map((column, index) => (
              <th
                key={column.id}
                scope="col"
                style={{
                  width: column.width ?? (column.id === 'actions' ? 64 : undefined),
                  minWidth: column.id === 'actions' ? 64 : undefined,
                  maxWidth: index === 0 && !column.width ? 360 : undefined,
                }}
                className={cn(
                  'h-11 bg-card px-4 text-xs font-medium whitespace-nowrap text-text-secondary',
                  alignClass[column.align ?? 'left'],
                  column.orderable && 'cursor-pointer select-none',
                  column.id === 'actions' &&
                    'sticky right-0 z-20 border-l border-border/60 shadow-[-5px_0_8px_-8px_rgba(16,16,16,0.3)]',
                )}
                onClick={column.orderable ? () => handleSort(column.id) : undefined}
              >
                <span className="inline-flex items-center gap-1">
                  {column.heading}
                  {column.orderable && (
                    <span className="inline-flex flex-col">
                      <ChevronUp
                        aria-hidden="true"
                        className={cn(
                          'size-3',
                          sortConfig?.key === column.id && sortConfig.direction === 'asc'
                            ? 'text-foreground'
                            : 'text-text-tertiary/40',
                        )}
                      />
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          '-mt-1 size-3',
                          sortConfig?.key === column.id && sortConfig.direction === 'desc'
                            ? 'text-foreground'
                            : 'text-text-tertiary/40',
                        )}
                      />
                    </span>
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="h-32 text-center">
                <Spinner className="mx-auto size-6" />
              </td>
            </tr>
          ) : empty ? (
            <tr>
              <td colSpan={columns.length} className="h-32 text-center text-text-secondary">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            sortedItems.map((item, rowIndex) => (
              <tr
                key={collection.itemToValue(item)}
                aria-label={collection.itemToString(item)}
                onClick={onRowClick ? () => onRowClick(item) : undefined}
                className={cn(
                  'border-b border-border/60 bg-card last:border-b-0',
                  onRowClick && 'cursor-pointer hover:bg-surface-hover',
                )}
              >
                {columns.map((column, columnIndex) => {
                  const Cell = columnIndex === 0 ? 'th' : 'td'
                  return (
                    <Cell
                      key={column.id}
                      scope={columnIndex === 0 ? 'row' : undefined}
                      style={{
                        width: column.width ?? (column.id === 'actions' ? 64 : undefined),
                        minWidth: column.id === 'actions' ? 64 : undefined,
                      }}
                      className={cn(
                        'px-4 py-3 font-normal whitespace-nowrap',
                        compact && 'py-2',
                        alignClass[column.align ?? 'left'],
                        columnIndex === 0 && !column.width && 'max-w-90 truncate',
                        column.id === 'actions' &&
                          'sticky right-0 z-10 border-l border-border/60 bg-card shadow-[-5px_0_8px_-8px_rgba(16,16,16,0.3)]',
                      )}
                    >
                      {column.cell(item, rowIndex)}
                    </Cell>
                  )
                })}
              </tr>
            ))
          )}
        </tbody>
        {!loading && !empty && columns.some((column) => column.footer !== undefined) && (
          <tfoot className="border-t-2 border-border">
            <tr>
              {columns.map((column) => (
                <td
                  key={column.id}
                  className={cn(
                    'bg-muted px-4 py-3 font-semibold whitespace-nowrap',
                    alignClass[column.align ?? 'left'],
                  )}
                >
                  {column.footer}
                </td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
      {footer}
    </div>
  )
}

DataTableComponent.collection = <T,>({
  items,
  itemToValue,
  itemToString,
}: DataTableCollection<T>): DataTableCollection<T> => ({ items, itemToValue, itemToString })

export const DataTable = DataTableComponent
