import { randomUUID } from "node:crypto";
import { invalid, outOfStock } from "./errors";
import type { Product } from "./product";

export interface OrderItem {
  productId: string;
  productName: string;
  unitPriceCents: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalCents: number;
  createdAt: Date;
}

export interface OrderLine {
  product: Product;
  quantity: number;
}

export function createOrder(customerName: string, customerEmail: string, lines: OrderLine[]): Order {
  if (lines.length === 0) throw invalid("Order must contain at least one item");

  const items = lines.map(({ product, quantity }) => {
    if (!Number.isInteger(quantity) || quantity <= 0) throw invalid("Quantity must be a positive integer");
    if (product.stock < quantity) throw outOfStock(product.id);
    return {
      productId: product.id,
      productName: product.name,
      unitPriceCents: product.priceCents,
      quantity,
    };
  });

  return {
    id: randomUUID(),
    customerName,
    customerEmail,
    items,
    totalCents: items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0),
    createdAt: new Date(),
  };
}
