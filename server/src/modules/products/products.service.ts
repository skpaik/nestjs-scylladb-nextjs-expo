// src/products/products.service.ts

import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateProductDto } from './dto/create-product.dto';
import { CassandraService } from '../../cassandra/cassandra.service';
import { Product } from './models/product-model';

@Injectable()
export class ProductsService {
  constructor(private readonly cassandraService: CassandraService) {}
  async createProduct(data: CreateProductDto): Promise<void> {
    const client = this.cassandraService.getClient();

    const query = `
      INSERT INTO products (
        internal_id, seq, name, description, brand, category, price, currency,
        stock, ean, color, size, availability, short_description, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const params = [
      uuidv4(),
      data.seq,
      data.name,
      data.description,
      data.brand,
      data.category,
      data.price,
      data.currency,
      data.stock,
      data.ean,
      data.color,
      data.size,
      data.availability,
      data.shortDescription,
      data.image,
    ];

    await client.execute(query, params, { prepare: true });
  }

  /*
  async findAll(): Promise<CreateProductDto[]> {
    const client = this.cassandraService.getClient();

    const query = 'SELECT * FROM products';

    const result = await client.execute(query);

    // Map rows to CreateProductDto format
    return (result.rows as unknown as ProductRow[]).map((row) => {
      const dto = new CreateProductDto();
      dto.Name = row.name;
      dto.Description = row.description;
      dto.Brand = row.brand;
      dto.Category = row.category;
      dto.Price = row.price;
      dto.Currency = row.currency;
      dto.Stock = row.stock;
      dto.EAN = row.ean;
      dto.Color = row.color;
      dto.Size = row.size;
      dto.Availability = row.availability;
      dto.ShortDescription = row.shortdescription;
      dto.Image = row.image;
      dto['Internal ID'] = row.id;

      return dto;
    });
  }
  */

  async findAll(): Promise<Product[]> {
    const client = this.cassandraService.getClient();
    const result = await client.execute('SELECT * FROM products');

    return (result.rows as unknown as CreateProductDto[]).map(
      (row): Product => ({
        internalId: row.internalId,
        seq: row.seq,
        name: row.name,
        description: row.description,
        brand: row.brand,
        category: row.category,
        price: row.price,
        currency: row.currency,
        stock: row.stock,
        ean: row.ean,
        color: row.color,
        size: row.size,
        availability: row.availability,
        shortDescription: row.shortDescription,
        image: row.image,
      }),
    );
  }
}
