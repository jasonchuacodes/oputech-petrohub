export type PaginationParams = {
  page: number;
  pageSize: number;
};

export function getPaginationArgs({ page, pageSize }: PaginationParams) {
  return {
    skip: (page - 1) * pageSize,
    take: pageSize,
  };
}
