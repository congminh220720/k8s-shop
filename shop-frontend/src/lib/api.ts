import "server-only";

const API_URL = process.env.API_URL ?? "http://localhost:3001";

export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  stock: number;
  imageUrl: string | null;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  totalCents: number;
  createdAt: string;
  items: { productId: string; productName: string; unitPriceCents: number; quantity: number }[];
}

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: { "content-type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(res.status, body.message ?? `API error ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listProducts: () => request<Product[]>("/api/products"),
  getProduct: (id: string) => request<Product>(`/api/products/${encodeURIComponent(id)}`),
  getOrder: (id: string) => request<Order>(`/api/orders/${encodeURIComponent(id)}`),
  placeOrder: (input: { customerName: string; customerEmail: string; items: { productId: string; quantity: number }[] }) =>
    request<Order>("/api/orders", { method: "POST", body: JSON.stringify(input) }),
};
