// src/products/products.service.ts

import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Client, QueryOptions } from 'cassandra-driver';
import { CreateProductDto } from './dto/create-product.dto';
import { CassandraService } from '../../cassandra/cassandra.service';
import { Product } from './models/product-model';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly cassandraService: CassandraService) {}
  async create(data: CreateProductDto): Promise<void> {
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

  async findAllPaginate(query: ProductQueryDto) {
    const client: Client = this.cassandraService.getClient();

    const {
      pageSize = 10,
      pagingState,
      category,
      brand,
      minPrice,
      maxPrice,
    } = query;

    // Build dynamic query
    let queryText = 'SELECT * FROM products';
    const queryParams: any[] = [];
    const conditions: string[] = [];

    if (category) {
      conditions.push('category = ?');
      queryParams.push(category);
    }

    if (brand) {
      conditions.push('brand = ?');
      queryParams.push(brand);
    }

    if (minPrice !== undefined) {
      conditions.push('price >= ?');
      queryParams.push(minPrice);
    }

    if (maxPrice !== undefined) {
      conditions.push('price <= ?');
      queryParams.push(maxPrice);
    }

    if (conditions.length > 0) {
      queryText += ' WHERE ' + conditions.join(' AND ');
    }

    const options: QueryOptions = {
      prepare: true,
      fetchSize: pageSize,
      ...(pagingState && { pagingState }),
    };

    const result = await client.execute(queryText, queryParams, options);

    const items: CreateProductDto[] = (result.rows as unknown as Product[]).map(
      (row) => {
        const dto = new CreateProductDto();
        dto.name = row.name;
        dto.description = row.description;
        dto.brand = row.brand;
        dto.category = row.category;
        dto.price = row.price;
        dto.currency = row.currency;
        dto.stock = row.stock;
        dto.ean = row.ean;
        dto.color = row.color;
        dto.size = row.size;
        dto.availability = row.availability;
        dto.shortDescription = row.shortDescription;
        dto.image = row.image;
        //dto['Internal ID'] = row.id;
        return dto;
      },
    );

    return {
      items,
      pageSize,
      nextPageState: result.pageState || null,
    };
  }
}
