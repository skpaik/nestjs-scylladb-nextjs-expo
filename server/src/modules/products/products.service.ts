// src/products/products.service.ts
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Client, QueryOptions } from 'cassandra-driver';
import { CreateProductDto } from './dto/create-product.dto';
import { CassandraService } from '../../cassandra/cassandra.service';
import { Product } from './models/product-model';
import { ProductQueryDto } from './dto/product-query.dto';
import { SearchProductDto } from './dto/search-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly cassandraService: CassandraService) {}

  async create(data: CreateProductDto): Promise<void> {
    const client = this.cassandraService.getClient();

    const query = `
        INSERT INTO products (internal_id, seq, name, description, brand, category, price, currency,
                              stock, ean, color, size, availability, short_description, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
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
        return this.generateProduct(row);
      },
    );

    return {
      items,
      pageSize,
      nextPageState: result.pageState || null,
    };
  }

  private generateProduct(row: Product) {
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
  }

  async search(searchDto: SearchProductDto) {
    const { q, pageSize = 10, pagingState, category, brand } = searchDto;

    const client: Client = this.cassandraService.getClient();

    // Build CQL query
    let queryText = 'SELECT * FROM products';
    const queryParams: any[] = [];
    const filters: string[] = [];

    if (category) {
      filters.push('category = ?');
      queryParams.push(category);
    }

    if (brand) {
      filters.push('brand = ?');
      queryParams.push(brand);
    }

    if (filters.length > 0) {
      queryText += ' WHERE ' + filters.join(' AND ');
    }

    const options: QueryOptions = {
      prepare: true,
      fetchSize: pageSize,
      ...(pagingState && { pagingState }),
    };

    const result = await client.execute(queryText, queryParams, options);

    // Filter rows in-memory using q (case-insensitive search)
    const searchTerm = q?.toLowerCase() ?? '';

    const filteredItems = (result.rows as unknown as Product[]).filter(
      (row) => {
        if (!searchTerm) return true;
        return (
          row.name?.toLowerCase().includes(searchTerm) ||
          row.description?.toLowerCase().includes(searchTerm) ||
          row.shortDescription?.toLowerCase().includes(searchTerm)
        );
      },
    );

    // Map to DTO
    const items = filteredItems.map((row) => {
      return this.generateProduct(row);
    });

    return {
      items,
      pageSize,
      nextPageState: result.pageState || null,
      query: q,
    };
  }
}
