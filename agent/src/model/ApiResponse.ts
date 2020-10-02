export type ApiResponse<T = ApiSuccess> = T | ApiError;

export interface ApiSuccess {
  success: true;
}

export interface ApiError {
  success: false;
  error: string;
  errorId: string;
}
