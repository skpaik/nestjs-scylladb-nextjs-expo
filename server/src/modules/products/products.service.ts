import { Injectable } from '@nestjs/common';
import { CreateProductDto, ProductRow } from './dto/create-product.dto';
import { CassandraService } from '../../cassandra/cassandra.service';

@Injectable()
export class ProductsService {
  constructor(private readonly cassandraService: CassandraService) {}

  async create(product: CreateProductDto) {
    const client = this.cassandraService.getClient();

    const query = `
      INSERT INTO products (
        id, name, description, brand, category, price, currency, stock,
        ean, color, size, availability, shortdescription, image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;

    const params = [
      product['Internal ID'],
      product.Name,
      product.Description,
      product.Brand,
      product.Category,
      product.Price,
      product.Currency,
      product.Stock,
      product.EAN,
      product.Color,
      product.Size,
      product.Availability,
      product.ShortDescription,
      product.Image,
    ];

    await client.execute(query, params, { prepare: true });
    return { message: 'Product saved', id: product['Internal ID'] };
  }

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
}
