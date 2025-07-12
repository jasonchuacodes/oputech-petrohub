import { AxiosError } from 'axios';

type BackendError = {
  name?: string;
  message?: string;
};


/**
 * Parses an unknown error (typically thrown by Axios and caught in TanStack Query or try/catch blocks)
 * and safely extracts the backend's custom error message if available.
 *
 * This is useful when the backend returns a structured error shape like:
 * `{ name: string; message: string }`, but the frontend only receives `Internal Server Error`
 * or a generic message unless properly unwrapped.
 *
 * @param error - The error thrown by Axios (usually caught in onError or catch block)
 * @param fallback - Optional fallback message to use if the backend message is missing
 * @returns The extracted error message from the backend, or the fallback message
 *
 * @example
 * try {
 *   await loginUser(credentials);
 * } catch (err) {
 *   const message = parseBackendError(err, 'Login failed');
 *   showToast(message);
 * }
 */
export const parseBackendError = (
  error: unknown,
  fallback = 'Something went wrong'
): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError
  ) {
    const axiosError = error as AxiosError<BackendError>;
    return axiosError.response?.data?.message ?? fallback;
  }

  return fallback;
};
