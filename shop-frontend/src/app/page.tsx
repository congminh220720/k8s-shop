import Link from "next/link";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await api.listProducts();

  return (
    <>
      <section className="mb-16 max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-honey/40 bg-honey/10 px-5 py-2 text-sm font-semibold text-honey">
          <span className="size-2 rounded-full bg-honey" />
          {products.length} products in stock
        </span>
        <h1 className="mt-8 font-display text-5xl leading-[1.05] font-black tracking-[-2px] sm:text-6xl">
          Deploy together.
          <br />
          Shop <em className="text-teal">more.</em>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-muted">
          Merch for people who ship containers. Pick something you like and check out in seconds.
        </p>
      </section>

      <section>
        <p className="eyebrow">Fresh from the registry</p>
        <h2 className="mt-2 mb-8 font-display text-4xl font-black tracking-[-1.5px]">
          Our <em className="text-teal">products</em>
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link key={p.id} href={`/products/${p.id}`} className="card group overflow-hidden transition hover:-translate-y-1">
              {p.imageUrl && (
                <img src={p.imageUrl} alt={p.name} className="h-52 w-full object-cover transition group-hover:scale-[1.02]" />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold">{p.name}</h3>
                <p className="mt-1 text-sm text-muted">{p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}</p>
                <p className="mt-4 font-display text-2xl font-black text-teal">{formatPrice(p.priceCents)}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
