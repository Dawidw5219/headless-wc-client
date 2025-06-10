import { HWCOrderDetails } from "../types/OrderDetails";
import { HWCResp, HWCError } from "../types/Response";
import { betterFetch } from "../utils/betterFetch";

export async function getOrderDetails(
  url: string,
  orderId: number,
  orderKey: string
): Promise<HWCResp<HWCOrderDetails>> {
  try {
    const res = await betterFetch(
      `${url}/wp-json/headless-wc/v1/order/${orderId}?key=${encodeURIComponent(
        orderKey
      )}`
    );

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const json = await res.json();

    // Check if API returned error response
    if (json.success === false) {
      return json as HWCError;
    }

    return { success: true, data: json as HWCOrderDetails };
  } catch (error) {
    return {
      success: false,
      message: "Network or HTTP error occurred",
      error: "internal",
    };
  }
}
