import { EntitySchema } from "typeorm";

export interface ProductRow {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  stock: number;
  imageUrl: string | null;
  createdAt: Date;
}

export interface OrderRow {
  id: string;
  customerName: string;
  customerEmail: string;
  totalCents: number;
  createdAt: Date;
  items: OrderItemRow[];
}

export interface OrderItemRow {
  id?: number;
  order?: OrderRow;
  productId: string;
  productName: string;
  unitPriceCents: number;
  quantity: number;
}

export const ProductSchema = new EntitySchema<ProductRow>({
  name: "Product",
  tableName: "products",
  columns: {
    id: { type: "uuid", primary: true, generated: "uuid" },
    name: { type: "varchar", length: 200 },
    description: { type: "text", default: "" },
    priceCents: { name: "price_cents", type: "integer" },
    stock: { type: "integer" },
    imageUrl: { name: "image_url", type: "varchar", length: 500, nullable: true },
    createdAt: { name: "created_at", type: "timestamptz", createDate: true },
  },
});

export const OrderSchema = new EntitySchema<OrderRow>({
  name: "Order",
  tableName: "orders",
  columns: {
    id: { type: "uuid", primary: true },
    customerName: { name: "customer_name", type: "varchar", length: 200 },
    customerEmail: { name: "customer_email", type: "varchar", length: 320 },
    totalCents: { name: "total_cents", type: "integer" },
    createdAt: { name: "created_at", type: "timestamptz" },
  },
  relations: {
    items: { type: "one-to-many", target: "OrderItem", inverseSide: "order", cascade: ["insert"] },
  },
});

export const OrderItemSchema = new EntitySchema<OrderItemRow>({
  name: "OrderItem",
  tableName: "order_items",
  columns: {
    id: { type: "integer", primary: true, generated: "increment" },
    productId: { name: "product_id", type: "uuid" },
    productName: { name: "product_name", type: "varchar", length: 200 },
    unitPriceCents: { name: "unit_price_cents", type: "integer" },
    quantity: { type: "integer" },
  },
  relations: {
    order: {
      type: "many-to-one",
      target: "Order",
      inverseSide: "items",
      joinColumn: { name: "order_id" },
      onDelete: "CASCADE",
    },
  },
});
