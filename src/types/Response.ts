// Success response type
export type SuccessResp<T> = {
  success: true;
  data: T;
};

// Error response type
export type ErrorResp = {
  success: false;
  message: string;
  error: string;
};

// Combined API response type
export type ApiResp<T> = SuccessResp<T> | ErrorResp;
