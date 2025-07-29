// models/product.model.ts

import { ScyllaSchema } from '../../../dbs/scylla-orm/schema.decorator';

@ScyllaSchema('products')
export class Product {
  id: string;
  seq: number;
  name: string;
  description?: string;
  brand: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  ean: string;
  color: string;
  size: string;
  availability: string;
  shortDescription: string;
  image: string;
  createdAt: Date;
}
