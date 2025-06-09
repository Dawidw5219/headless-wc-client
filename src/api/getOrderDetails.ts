import { HWCOrderDetails } from "../types/OrderDetails";
import { fetchWithRetry, getRetryFetchOptions } from "../utils/fetchWithRetry";

export async function getOrderDetails(
  url: string,
  orderId: number,
  orderKey: string
): Promise<HWCOrderDetails> {
  try {
    const res = await fetchWithRetry(
      `${url}/wp-json/headless-wc/v1/order/${orderId}?key=${encodeURIComponent(
        orderKey
      )}`,
      getRetryFetchOptions()
    );

    if (!res.ok) {
      if (res.status === 400) {
        throw new Error("Bad request - Missing order ID or order key");
      } else if (res.status === 403) {
        throw new Error("Forbidden - Invalid order key");
      } else if (res.status === 404) {
        throw new Error("Not found - Order does not exist");
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const json = await res.json();
    if (json["success"] !== true)
      throw new Error("Invalid response from server");

    return json as HWCOrderDetails;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
}
