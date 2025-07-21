import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';
import { Product } from './models/product-model';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.createProduct(dto);
  }

  // @Get()
  // findAll() {
  //   return this.productsService.findAll();
  // }
  @Get()
  async findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }
}
