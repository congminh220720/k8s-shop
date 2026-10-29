import { invalid, notFound, outOfStock } from "@/domain/errors";
import { createOrder, type Order } from "@/domain/order";
import type { OrderRepository, UnitOfWork } from "../ports";

export interface PlaceOrderInput {
  customerName: string;
  customerEmail: string;
  items: { productId: string; quantity: number }[];
}

export class PlaceOrder {
  constructor(private readonly uow: UnitOfWork) {}

  async execute(input: PlaceOrderInput): Promise<Order> {
    const quantities = new Map<string, number>();
    for (const { productId, quantity } of input.items) {
      quantities.set(productId, (quantities.get(productId) ?? 0) + quantity);
    }
    if (quantities.size === 0) throw invalid("Order must contain at least one item");

    return this.uow.run(async ({ products, orders }) => {
      const found = await products.findByIds([...quantities.keys()]);
      const byId = new Map(found.map((p) => [p.id, p]));

      const order = createOrder(
        input.customerName,
        input.customerEmail,
        [...quantities].map(([productId, quantity]) => {
          const product = byId.get(productId);
          if (!product) throw notFound(`Product ${productId}`);
          return { product, quantity };
        }),
      );

      for (const item of order.items) {
        const ok = await products.decreaseStock(item.productId, item.quantity);
        if (!ok) throw outOfStock(item.productId);
      }
      await orders.save(order);
      return order;
    });
  }
}

export class GetOrder {
  constructor(private readonly orders: OrderRepository) {}

  async execute(id: string): Promise<Order> {
    const order = await this.orders.findById(id);
    if (!order) throw notFound("Order");
    return order;
  }
}
