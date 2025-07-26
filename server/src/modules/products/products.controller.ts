import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

import { ProductQueryDto } from './dto/product-query.dto';
import { SearchProductDto } from './dto/search-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all products with pagination and filtering' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  findAll(@Query() query: ProductQueryDto) {
    return this.productsService.findAllPaginate(query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search products by name and description' })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
  })
  search(@Query() searchDto: SearchProductDto) {
    return this.productsService.search(searchDto);
  }
}
