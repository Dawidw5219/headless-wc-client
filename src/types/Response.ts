export type HWCData<T> = { success: true; data: T };
export type HWCError = { success: false; message: string; error: string };
export type HWCResp<T> = HWCData<T> | HWCError;
