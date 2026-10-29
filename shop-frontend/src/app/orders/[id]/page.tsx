import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, api } from "@/lib/api";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await api.getOrder(id).catch((err) => {
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) notFound();
    throw err;
  });

  return (
    <div className="card mx-auto max-w-xl p-8 sm:p-10">
      <p className="eyebrow">Order confirmed</p>
      <h1 className="mt-2 font-display text-4xl font-black tracking-[-1.5px]">
        Thank you, <em className="text-teal">{order.customerName}!</em>
      </h1>
      <p className="mt-2 text-sm text-muted">Order {order.id}</p>
      <ul className="mt-6 divide-y divide-teal/10">
        {order.items.map((i) => (
          <li key={i.productId} className="flex justify-between py-2">
            <span>
              {i.productName} × {i.quantity}
            </span>
            <span>{formatPrice(i.unitPriceCents * i.quantity)}</span>
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-baseline justify-between border-t border-teal/10 pt-4 font-semibold">
        <span>Total</span>
        <span className="font-display text-2xl font-black text-teal">{formatPrice(order.totalCents)}</span>
      </p>
      <Link href="/" className="btn-outline mt-8 w-full">
        Continue shopping
      </Link>
    </div>
  );
}
