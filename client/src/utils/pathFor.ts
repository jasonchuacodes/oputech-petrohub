export const pathFor = ({
  pathname,
  params,
  query,
}: {
  pathname: string;
  params?: Record<string, string | number | boolean | undefined | null>;
  query?: Record<string, string | number | boolean | undefined | null>;
}) => {
  let path = pathname;

  // Removal of undefined optional params
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        path = path.replace(`:${key}`, String(value));
      }
    }
  }

  path = path.replace(/:(\w+)\?/g, '');

  path = path.replace(/\/+/g, '/');
  path = path.replace(/\/$/, '');
  if (path === '') path = '/';

  // Query params
  if (query) {
    const searchParams = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined) searchParams.set(key, String(value));
    }
    const queryString = searchParams.toString();
    if (queryString) path += `?${queryString}`;
  }

  return path;
};
