import { notFound } from "@/domain/errors";
import type { Product } from "@/domain/product";
import type { ProductRepository } from "../ports";

export class ListProducts {
  constructor(private readonly products: ProductRepository) {}

  execute(): Promise<Product[]> {
    return this.products.findAll();
  }
}

export class GetProduct {
  constructor(private readonly products: ProductRepository) {}

  async execute(id: string): Promise<Product> {
    const product = await this.products.findById(id);
    if (!product) throw notFound("Product");
    return product;
  }
}
