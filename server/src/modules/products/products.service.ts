// src/products/products.service.ts
import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { QueryOptions } from 'cassandra-driver';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.model';
import { ScyllaOrmService } from '../../dbs/scylla-orm/scylla-orm.service';
import { DbService } from '../../dbs/cassandra/DbService';

@Injectable()
export class ProductsService implements OnModuleInit {
  constructor(
    private readonly orm: ScyllaOrmService,
    private readonly dbService: DbService,
  ) {}

  onModuleInit() {
    this.orm.registerSchema(Product);
  }

  async create(data: CreateProductDto): Promise<string> {
    const id = uuidv4();
    const product = Object.assign(new Product(), {
      ...data,
      id,
      createdAt: new Date(),
    });

    const { query, params } = this.orm.insert<Product>(product);

    await this.dbService.executeQuery(query, params, { prepare: true });

    return id;
  }

  async findAllPaginate(query: ProductQueryDto) {
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

    const result = await this.dbService.executeQuery(
      queryText,
      queryParams,
      options,
    );

    const items: Product[] = (result.rows as unknown as Product[]).map(
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

  async search(searchDto: SearchProductDto) {
    const { q, pageSize = 10, pagingState, category, brand } = searchDto;

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

    const result = await this.dbService.executeQuery(
      queryText,
      queryParams,
      options,
    );

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

  async findLatest(limit: number = 10): Promise<Product[]> {
    const query = 'SELECT * FROM products';
    const options: QueryOptions = {
      prepare: true,
      fetchSize: 100, // Fetch more than needed to filter/sort
    };

    const result = await this.dbService.executeQuery(query, [], options);

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

  async findFeatured(limit: number = 10): Promise<Product[]> {
    const query =
      'SELECT * FROM products WHERE availability = ? ALLOW FILTERING';

    const options: QueryOptions = {
      prepare: true,
      fetchSize: 100, // fetch more than `limit` to sort in-memory
    };

    const result = await this.dbService.executeQuery(
      query,
      ['in_stock'],
      options,
    );

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
  ): Promise<Product[]> {
    const query = 'SELECT * FROM products WHERE category = ? ALLOW FILTERING';

    const options: QueryOptions = {
      prepare: true,
      fetchSize: 100, // Fetch more to sort/filter in-memory
    };

    const result = await this.dbService.executeQuery(
      query,
      [category],
      options,
    );

    const sortedItems = (result.rows as unknown as Product[])
      .filter((row) => row.createdAt) // only rows with createdAt
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, limit);

    return sortedItems.map((row) => this.generateProduct(row));
  }

  async findByBrand(brand: string, limit: number = 10): Promise<Product[]> {
    const query = 'SELECT * FROM products WHERE brand = ? ALLOW FILTERING';

    const options = {
      prepare: true,
      fetchSize: 100,
    };

    const result = await this.dbService.executeQuery(query, [brand], options);

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
    const query = 'SELECT category FROM products ALLOW FILTERING';

    const options = {
      prepare: true,
      fetchSize: 500,
    };

    const result = await this.dbService.executeQuery(query, [], options);

    const categories = new Set<string>();

    for (const row of result.rows) {
      if (row.category) {
        categories.add(row.category);
      }
    }

    return Array.from(categories);
  }

  async getBrands(): Promise<string[]> {
    const query = 'SELECT brand FROM products ALLOW FILTERING';

    const options = {
      prepare: true,
      fetchSize: 500,
    };

    const result = await this.dbService.executeQuery(query, [], options);

    const brands = new Set<string>();

    for (const row of result.rows) {
      if (row.brand) {
        brands.add(row.brand);
      }
    }

    return Array.from(brands);
  }

  async update2(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const existing = await this.findOne(id);
    const updated = { ...existing, ...updateProductDto };

    const query = `
    UPDATE products SET
      name = ?, description = ?, brand = ?, category = ?, price = ?,
      currency = ?, stock = ?, ean = ?, color = ?, size = ?, availability = ?,
      shortDescription = ?, image = ?, createdAt = ?
    WHERE id = ?
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
      (updated.id = id),
    ];
    await this.dbService.executeQuery(query, params, { prepare: true });

    return this.generateProduct(updated);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const existing = await this.findOne(id);
    const updated = { ...existing, ...updateProductDto };
    const updateData = Object.assign(new Product(), updated);

    const { query, params } = this.orm.update<Product>(updateData, {
      id: id,
    });

    await this.dbService.executeQuery(query, params, { prepare: true });

    return this.generateProduct(updated);
  }

  async remove(id: string): Promise<void> {
    const query = 'DELETE FROM products WHERE id = ?';
    await this.dbService.executeQuery(query, [id], { prepare: true });
  }

  async updateStock2(id: string, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stock = quantity;

    product.availability = this.checkAvailability(quantity);

    const query = `
    UPDATE products SET stock = ?, availability = ? WHERE id = ?
  `;

    const params = [product.stock, product.availability, id];

    await this.dbService.executeQuery(query, params, { prepare: true });

    return this.generateProduct(product);
  }

  private checkAvailability(quantity: number) {
    let availability = 'in_stock';
    if (quantity === 0) {
      availability = 'out_of_stock';
    } else if (quantity < 20) {
      availability = 'low_stock';
    }
    return availability;
  }

  async findOne(id: string): Promise<Product> {
    const query = 'SELECT * FROM products WHERE id = ?';
    const result = await this.dbService.executeQuery(query, [id], {
      prepare: true,
    });

    if (result.rowLength === 0) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    const row = result.first();

    return this.generateProduct(row as unknown as Product);
  }
  async findById(id: string): Promise<Product> {
    const query = 'SELECT * FROM products WHERE "id" = ? ALLOW FILTERING';
    const result = await this.dbService.executeQuery(query, [id], {
      prepare: true,
    });

    if (result.rowLength === 0) {
      throw new NotFoundException(`Product with internal ID ${id} not found`);
    }

    const row = result.first();

    return this.generateProduct(row as unknown as Product);
  }

  async updateStock(id: string, stock: number) {
    const existing = await this.findOne(id);

    const availability = this.checkAvailability(stock);

    const updated = {
      ...existing,
      ...{
        stock,
        availability,
      },
    };
    const updateData = Object.assign(new Product(), updated);

    const { query, params } = this.orm.update<Product>(updateData, {
      id: id,
    });

    await this.dbService.executeQuery(query, params, { prepare: true });
  }

  async deleteProduct(id: string) {
    const query = 'DELETE FROM products WHERE id = ?';
    const params = this.orm.mapQueryParams(query, { id: id });
    await this.dbService.executeQuery(query, params);
  }
}
