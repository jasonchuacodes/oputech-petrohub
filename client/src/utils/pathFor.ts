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

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`:${key}`, String(value));
    }
  }

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
