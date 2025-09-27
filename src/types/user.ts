import type { HWCCustomerData } from "./customer-data";

export type HWCCreateUserRequest = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username: string;
  billing: HWCCustomerData;
  shipping?: HWCCustomerData;
  meta?: {
    phone_verified?: boolean;
    accepts_marketing?: boolean;
    customer_note?: string;
    [key: string]: any;
  };
};

export type HWCCreateUserResponse = {
  success: true;
  data: {
    userId: number;
    email: string;
    username: string;
  };
  message: string;
};

export type HWCCreateUserErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
  };
};

export type HWCCreateUserResult =
  | HWCCreateUserResponse
  | HWCCreateUserErrorResponse;
