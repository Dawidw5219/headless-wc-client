import { HWCOrderDetails } from "../types/OrderDetails";
import { ResponseError } from "../types/ResponseError";
import { betterFetch } from "../utils/betterFetch";

export async function getOrderDetails(
  url: string,
  orderId: number,
  orderKey: string
): Promise<HWCOrderDetails | ResponseError> {
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
      return json as ResponseError;
    }

    return json as HWCOrderDetails;
  } catch (error) {
    return {
      success: false,
      message: "Network or HTTP error occurred",
      error: "internal",
    };
  }
}
