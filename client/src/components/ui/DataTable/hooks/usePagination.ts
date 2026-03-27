import { useState } from 'react';

import type { DataTablePaginationProps } from '../types';

export function usePagination(props?: DataTablePaginationProps) {
  const [internalPage, setInternalPage] = useState(1);

  const page = props?.page ?? internalPage;
  const pageSize = props?.pageSize ?? 10;
  const count = props?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(count / pageSize));
  const goToPage = props?.onPageChange ?? setInternalPage;

  return {
    enabled: props?.enabled ?? false,
    page,
    totalPages,
    pageSize,
    count,
    goToPage: (p: number) => goToPage(Math.min(Math.max(p, 1), totalPages)),
    canGoPrev: page > 1,
    canGoNext: page < totalPages,
  };
}
