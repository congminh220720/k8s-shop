import type { MigrationInterface, QueryRunner } from "typeorm";

export class Init1761700000000 implements MigrationInterface {
  name = "Init1761700000000";

  async up(q: QueryRunner): Promise<void> {
    await q.query(`
      CREATE TABLE products (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(200) NOT NULL,
        description text NOT NULL DEFAULT '',
        price_cents integer NOT NULL CHECK (price_cents >= 0),
        stock integer NOT NULL CHECK (stock >= 0),
        image_url varchar(500),
        created_at timestamptz NOT NULL DEFAULT now()
      )`);
    await q.query(`
      CREATE TABLE orders (
        id uuid PRIMARY KEY,
        customer_name varchar(200) NOT NULL,
        customer_email varchar(320) NOT NULL,
        total_cents integer NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )`);
    await q.query(`
      CREATE TABLE order_items (
        id serial PRIMARY KEY,
        order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id uuid NOT NULL REFERENCES products(id),
        product_name varchar(200) NOT NULL,
        unit_price_cents integer NOT NULL,
        quantity integer NOT NULL CHECK (quantity > 0)
      )`);
    await q.query(`CREATE INDEX idx_order_items_order_id ON order_items(order_id)`);

    await q.query(`
      INSERT INTO products (name, description, price_cents, stock, image_url) VALUES
        ('K8s Hoodie', 'Warm hoodie with the Kubernetes helm logo.', 4500, 20, 'https://picsum.photos/seed/hoodie/600/400'),
        ('Docker Mug', 'Ceramic mug for your morning container.', 1200, 50, 'https://picsum.photos/seed/mug/600/400'),
        ('Argo Sticker Pack', 'Set of 10 GitOps stickers.', 500, 100, 'https://picsum.photos/seed/sticker/600/400'),
        ('Postgres Elephant Plush', 'Soft and reliable, like your database.', 2500, 10, 'https://picsum.photos/seed/elephant/600/400')
    `);
  }

  async down(q: QueryRunner): Promise<void> {
    await q.query(`DROP TABLE order_items`);
    await q.query(`DROP TABLE orders`);
    await q.query(`DROP TABLE products`);
  }
}
