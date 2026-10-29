import { GetOrder, PlaceOrder } from "@/application/use-cases/orders";
import { GetProduct, ListProducts } from "@/application/use-cases/products";
import { getDataSource } from "@/infrastructure/typeorm/data-source";
import {
  TypeOrmOrderRepository,
  TypeOrmProductRepository,
  TypeOrmUnitOfWork,
} from "@/infrastructure/typeorm/repositories";

export async function container() {
  const ds = await getDataSource();
  const products = new TypeOrmProductRepository(ds.manager);
  const orders = new TypeOrmOrderRepository(ds.manager);

  return {
    listProducts: new ListProducts(products),
    getProduct: new GetProduct(products),
    placeOrder: new PlaceOrder(new TypeOrmUnitOfWork(ds)),
    getOrder: new GetOrder(orders),
  };
}
