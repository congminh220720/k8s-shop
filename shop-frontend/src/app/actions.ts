"use server";

import { redirect } from "next/navigation";
import { ApiError, api } from "@/lib/api";

export interface OrderFormState {
  error?: string;
}

export async function placeOrder(_prev: OrderFormState, formData: FormData): Promise<OrderFormState> {
  let orderId: string;
  try {
    const order = await api.placeOrder({
      customerName: String(formData.get("customerName") ?? ""),
      customerEmail: String(formData.get("customerEmail") ?? ""),
      items: [{ productId: String(formData.get("productId") ?? ""), quantity: Number(formData.get("quantity")) }],
    });
    orderId = order.id;
  } catch (err) {
    return { error: err instanceof ApiError ? err.message : "Could not place order" };
  }
  redirect(`/orders/${orderId}`);
}
