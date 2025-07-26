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
  // async findAll(query: ProductQueryDto) {
  //   const {
  //     page,
  //     limit,
  //     category,
  //     brand,
  //     minPrice,
  //     maxPrice,
  //     sortBy,
  //     sortOrder,
  //   } = query;
  //   const skip = (page - 1) * limit;
  //
  //   const queryBuilder = this.productRepository.createQueryBuilder('product');
  //
  //   // Apply filters
  //   if (category) {
  //     queryBuilder.andWhere('product.category = :category', { category });
  //   }
  //
  //   if (brand) {
  //     queryBuilder.andWhere('product.brand = :brand', { brand });
  //   }
  //
  //   if (minPrice !== undefined) {
  //     queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
  //   }
  //
  //   if (maxPrice !== undefined) {
  //     queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
  //   }
  //
  //   // Apply sorting
  //   if (sortBy && ['name', 'price', 'createdAt'].includes(sortBy)) {
  //     queryBuilder.orderBy(`product.${sortBy}`, sortOrder);
  //   } else {
  //     queryBuilder.orderBy('product.createdAt', 'DESC');
  //   }
  //
  //   // Apply pagination
  //   queryBuilder.skip(skip).take(limit);
  //
  //   const [items, total] = await queryBuilder.getManyAndCount();
  //
  //   return {
  //     items,
  //     total,
  //     page,
  //     limit,
  //     totalPages: Math.ceil(total / limit),
  //   };
  // }

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

  async findAll2(): Promise<Product[]> {
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
