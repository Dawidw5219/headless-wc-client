// Success response type
export type HWCData<T> = {
  success: true;
  data: T;
};

// Error response type
export type HWCError = {
  success: false;
  message: string;
  error: string;
};

// Combined API response type
export type HWCResp<T> = HWCData<T> | HWCError;
