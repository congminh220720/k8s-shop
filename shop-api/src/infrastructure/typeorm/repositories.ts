import { In, type DataSource, type EntityManager } from "typeorm";
import type { OrderRepository, ProductRepository, Repositories, UnitOfWork } from "@/application/ports";
import type { Order } from "@/domain/order";
import type { Product } from "@/domain/product";
import { OrderSchema, ProductSchema, type OrderRow } from "./schemas";

export class TypeOrmProductRepository implements ProductRepository {
  constructor(private readonly em: EntityManager) {}

  findAll(): Promise<Product[]> {
    return this.em.getRepository(ProductSchema).find({ order: { createdAt: "ASC", name: "ASC" } });
  }

  findById(id: string): Promise<Product | null> {
    return this.em.getRepository(ProductSchema).findOneBy({ id });
  }

  findByIds(ids: string[]): Promise<Product[]> {
    return this.em.getRepository(ProductSchema).findBy({ id: In(ids) });
  }

  async decreaseStock(id: string, quantity: number): Promise<boolean> {
    const result = await this.em
      .createQueryBuilder()
      .update(ProductSchema)
      .set({ stock: () => "stock - :qty" })
      .where("id = :id AND stock >= :qty", { id, qty: quantity })
      .execute();
    return result.affected === 1;
  }
}

export class TypeOrmOrderRepository implements OrderRepository {
  constructor(private readonly em: EntityManager) {}

  async save(order: Order): Promise<void> {
    await this.em.getRepository(OrderSchema).save({ ...order, items: order.items.map((i) => ({ ...i })) });
  }

  async findById(id: string): Promise<Order | null> {
    const row = await this.em.getRepository(OrderSchema).findOne({ where: { id }, relations: { items: true } });
    return row ? toOrder(row) : null;
  }
}

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    customerName: row.customerName,
    customerEmail: row.customerEmail,
    totalCents: row.totalCents,
    createdAt: row.createdAt,
    items: row.items.map(({ productId, productName, unitPriceCents, quantity }) => ({
      productId,
      productName,
      unitPriceCents,
      quantity,
    })),
  };
}

export class TypeOrmUnitOfWork implements UnitOfWork {
  constructor(private readonly ds: DataSource) {}

  run<T>(work: (repos: Repositories) => Promise<T>): Promise<T> {
    return this.ds.transaction((em) =>
      work({ products: new TypeOrmProductRepository(em), orders: new TypeOrmOrderRepository(em) }),
    );
  }
}
