// src/products/products.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Client, QueryOptions } from 'cassandra-driver';
import { CreateProductDto } from './dto/create-product.dto';
import { CassandraService } from '../../cassandra/cassandra.service';
import { Product } from './models/product-model';
import { ProductQueryDto } from './dto/product-query.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

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
    return row;
  }

  private generateProduct2(row: Product) {
    const dto = new CreateProductDto();
    dto.internalId = row.internalId;
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

  async findLatest(limit: number = 10): Promise<CreateProductDto[]> {
    const client: Client = this.cassandraService.getClient();

    const query = 'SELECT * FROM products';
    const options: QueryOptions = {
      prepare: true,
      fetchSize: 100, // Fetch more than needed to filter/sort
    };

    const result = await client.execute(query, [], options);

    const products = (result.rows as unknown as Product[])
      .filter((row) => row.createdAt)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);

    return products.map((row) => {
      return this.generateProduct(row);
    });
  }

  async findFeatured(limit: number = 10): Promise<CreateProductDto[]> {
    const client: Client = this.cassandraService.getClient();

    const query =
      'SELECT * FROM products WHERE availability = ? ALLOW FILTERING';

    const options: QueryOptions = {
      prepare: true,
      fetchSize: 100, // fetch more than `limit` to sort in-memory
    };

    const result = await client.execute(query, ['in_stock'], options);

    const sortedItems = (result.rows as unknown as Product[])
      .sort((a, b) => (b.stock || 0) - (a.stock || 0)) // highest stock first
      .slice(0, limit);

    return sortedItems.map((row) => {
      return this.generateProduct(row);
    });
  }

  async findByCategory(
    category: string,
    limit: number = 10,
  ): Promise<CreateProductDto[]> {
    const client: Client = this.cassandraService.getClient();

    const query = 'SELECT * FROM products WHERE category = ? ALLOW FILTERING';

    const options: QueryOptions = {
      prepare: true,
      fetchSize: 100, // Fetch more to sort/filter in-memory
    };

    const result = await client.execute(query, [category], options);

    const sortedItems = (result.rows as unknown as Product[])
      .filter((row) => row.createdAt) // only rows with createdAt
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);

    return sortedItems.map((row) => this.generateProduct(row));
  }

  async findByBrand(
    brand: string,
    limit: number = 10,
  ): Promise<CreateProductDto[]> {
    const client = this.cassandraService.getClient();

    const query = 'SELECT * FROM products WHERE brand = ? ALLOW FILTERING';

    const options = {
      prepare: true,
      fetchSize: 100,
    };

    const result = await client.execute(query, [brand], options);

    const sortedItems = (result.rows as unknown as Product[])
      .filter((row) => row.createdAt)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);

    return sortedItems.map((row) => this.generateProduct(row));
  }

  async getCategories(): Promise<string[]> {
    const client = this.cassandraService.getClient();

    const query = 'SELECT category FROM products ALLOW FILTERING';

    const options = {
      prepare: true,
      fetchSize: 500,
    };

    const result = await client.execute(query, [], options);

    const categories = new Set<string>();

    for (const row of result.rows) {
      if (row.category) {
        categories.add(row.category);
      }
    }

    return Array.from(categories);
  }

  async getBrands(): Promise<string[]> {
    const client = this.cassandraService.getClient();

    const query = 'SELECT brand FROM products ALLOW FILTERING';

    const options = {
      prepare: true,
      fetchSize: 500,
    };

    const result = await client.execute(query, [], options);

    const brands = new Set<string>();

    for (const row of result.rows) {
      if (row.brand) {
        brands.add(row.brand);
      }
    }

    return Array.from(brands);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const client = this.cassandraService.getClient();

    const existing = await this.findOne(id);
    const updated = { ...existing, ...updateProductDto };

    const query = `
    UPDATE products SET
      name = ?, description = ?, brand = ?, category = ?, price = ?,
      currency = ?, stock = ?, ean = ?, color = ?, size = ?, availability = ?,
      short_description = ?, image = ?, created_at = ?
    WHERE internal_id = ?
  `;

    const params = [
      updated.name,
      updated.description,
      updated.brand,
      updated.category,
      updated.price,
      updated.currency,
      updated.stock,
      updated.ean,
      updated.color,
      updated.size,
      updated.availability,
      updated.shortDescription,
      updated.image,
      updated.createdAt,
    ];

    await client.execute(query, params, { prepare: true });

    return this.generateProduct(updated);
  }

  async remove(id: string): Promise<void> {
    const client = this.cassandraService.getClient();

    const query = 'DELETE FROM products WHERE internal_id = ?';
    await client.execute(query, [id], { prepare: true });
  }

  async updateStock(id: string, quantity: number): Promise<CreateProductDto> {
    const client = this.cassandraService.getClient();

    const product = await this.findOne(id);
    product.stock = quantity;

    if (quantity === 0) {
      product.availability = 'out_of_stock';
    } else if (quantity < 20) {
      product.availability = 'low_stock';
    } else {
      product.availability = 'in_stock';
    }

    const query = `
    UPDATE products SET stock = ?, availability = ? WHERE internal_id = ?
  `;

    const params = [product.stock, product.availability, id];

    await client.execute(query, params, { prepare: true });

    return this.generateProduct(product);
  }

  async findOne(id: string): Promise<CreateProductDto> {
    const client = this.cassandraService.getClient();

    const query = 'SELECT * FROM products WHERE internal_id = ?';
    const result = await client.execute(query, [id], { prepare: true });

    if (result.rowLength === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const row = result.first();

    return this.generateProduct(row as unknown as Product);
  }
  async findByInternalId(internalId: string): Promise<Product> {
    const client = this.cassandraService.getClient();

    const query =
      'SELECT * FROM products WHERE "internal_id" = ? ALLOW FILTERING';
    const result = await client.execute(query, [internalId], { prepare: true });

    if (result.rowLength === 0) {
      throw new NotFoundException(
        `Product with internal ID ${internalId} not found`,
      );
    }

    const row = result.first();

    return this.generateProduct(row as unknown as Product);
  }
}
