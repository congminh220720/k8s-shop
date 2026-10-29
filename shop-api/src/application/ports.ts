import type { Order } from "@/domain/order";
import type { Product } from "@/domain/product";

export interface ProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findByIds(ids: string[]): Promise<Product[]>;
  /** Atomically decrements stock; returns false if not enough stock. */
  decreaseStock(id: string, quantity: number): Promise<boolean>;
}

export interface OrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
}

export interface Repositories {
  products: ProductRepository;
  orders: OrderRepository;
}

export interface UnitOfWork {
  run<T>(work: (repos: Repositories) => Promise<T>): Promise<T>;
}
