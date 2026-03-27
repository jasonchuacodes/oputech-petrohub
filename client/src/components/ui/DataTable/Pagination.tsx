import { Stack, Typography, IconButton } from '@mui/material';
import { ChevronLeftOutlined, ChevronRightOutlined } from '@mui/icons-material';

import { useDataTableContext } from './context';

function getPageNumbers(page: number, totalPages: number): (number | '...')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | '...')[] = [1];

  const rangeStart = Math.max(2, page - 1);
  const rangeEnd = Math.min(totalPages - 1, page + 1);

  if (rangeStart > 2) pages.push('...');

  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  if (rangeEnd < totalPages - 1) pages.push('...');

  pages.push(totalPages);

  return pages;
}

export function Pagination() {
  const { pagination } = useDataTableContext();

  if (!pagination.enabled) return null;
  if (pagination.count <= 0 || pagination.totalPages <= 1) return null;

  const start =
    pagination.count <= 0
      ? 0
      : (pagination.page - 1) * pagination.pageSize + 1;

  const until = Math.min(pagination.page * pagination.pageSize, pagination.count);

  const pageNumbers = getPageNumbers(pagination.page, pagination.totalPages);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      px={2}
      py={1.5}
      borderTop="1px solid"
      sx={{ borderColor: 'divider' }}
    >
      <Typography variant="body2" color="text.secondary">
        Showing {start}–{until} of {pagination.count} entries
      </Typography>

      <Stack direction="row" alignItems="center" spacing={0.5}>
        <IconButton
          size="small"
          onClick={() => pagination.goToPage(pagination.page - 1)}
          disabled={!pagination.canGoPrev}
        >
          <ChevronLeftOutlined fontSize="small" />
        </IconButton>

        {pageNumbers.map((p, i) =>
          p === '...' ? (
            <Typography
              key={`ellipsis-${i}`}
              variant="body2"
              color="text.secondary"
              sx={{ px: 0.5 }}
            >
              …
            </Typography>
          ) : (
            <IconButton
              key={p}
              size="small"
              onClick={() => pagination.goToPage(p)}
              disabled={p === pagination.page}
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                ...(p === pagination.page && {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&.Mui-disabled': {
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                  },
                }),
              }}
            >
              <Typography variant="body2">{p}</Typography>
            </IconButton>
          ),
        )}

        <IconButton
          size="small"
          onClick={() => pagination.goToPage(pagination.page + 1)}
          disabled={!pagination.canGoNext}
        >
          <ChevronRightOutlined fontSize="small" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
