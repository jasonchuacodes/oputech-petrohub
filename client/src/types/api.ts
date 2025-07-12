type RequestError = {
  status: number;
  message: string;
};

type ApiResponse<T> = {
  message: string;
  data: T;
};

export type { ApiResponse, RequestError };
