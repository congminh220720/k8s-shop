import Link from "next/link";
import { notFound } from "next/navigation";
import { ApiError, api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import { OrderForm } from "./order-form";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await api.getProduct(id).catch((err) => {
    if (err instanceof ApiError && (err.status === 404 || err.status === 400)) notFound();
    throw err;
  });

  return (
    <div className="grid gap-10 md:grid-cols-2">
      {product.imageUrl && (
        <img src={product.imageUrl} alt={product.name} className="card w-full object-cover" />
      )}
      <div>
        <Link href="/" className="eyebrow hover:underline">
          ← All products
        </Link>
        <h1 className="mt-3 font-display text-4xl font-black tracking-[-1.5px] sm:text-5xl">{product.name}</h1>
        <p className="mt-3 font-display text-3xl font-black text-teal">{formatPrice(product.priceCents)}</p>
        <p className="mt-5 text-lg leading-relaxed text-muted">{product.description}</p>
        <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-honey/40 bg-honey/10 px-4 py-1.5 text-sm font-semibold text-honey">
          <span className="size-2 rounded-full bg-honey" />
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </span>
        {product.stock > 0 && <OrderForm productId={product.id} maxQuantity={Math.min(product.stock, 100)} />}
      </div>
    </div>
  );
}
