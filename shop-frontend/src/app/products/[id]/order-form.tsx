"use client";

import { useActionState } from "react";
import { placeOrder, type OrderFormState } from "@/app/actions";

export function OrderForm({ productId, maxQuantity }: { productId: string; maxQuantity: number }) {
  const [state, action, pending] = useActionState<OrderFormState, FormData>(placeOrder, {});

  return (
    <form action={action} className="card mt-8 space-y-4 p-7">
      <input type="hidden" name="productId" value={productId} />
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">Quantity</span>
        <input name="quantity" type="number" min={1} max={maxQuantity} defaultValue={1} required className="field" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Your name</span>
          <input name="customerName" required maxLength={200} placeholder="Jane Tan" className="field" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Email address</span>
          <input name="customerEmail" type="email" required maxLength={320} placeholder="jane@company.com" className="field" />
        </label>
      </div>
      {state.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}
      <button type="submit" disabled={pending} className="btn-primary w-full">
        {pending ? "Placing order..." : "Place order 🛒"}
      </button>
    </form>
  );
}
