import { createUser as apiCreateUser } from "../api/woocommerce";
import type { HWCCreateUserRequest, HWCCreateUserResult } from "../types/user";
import type { HWCResp } from "../types/response";
import { getBaseUrl } from "./config";

export async function createUser(
  userData: HWCCreateUserRequest
): Promise<HWCCreateUserResult> {
  const url = getBaseUrl();
  const res = (await apiCreateUser(
    url,
    userData
  )) as HWCResp<HWCCreateUserResult>;
  if ((res as any).success === false) {
    throw new Error((res as any).message);
  }
  return (res as any).data as HWCCreateUserResult;
}
