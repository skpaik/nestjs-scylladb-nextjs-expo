import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductsService } from './products.service';

import { ProductQueryDto } from './dto/product-query.dto';
import { SearchProductDto } from './dto/search-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ParseUUIDPipe } from '@nestjs/common/pipes/parse-uuid.pipe';
import { LimitQueryDto } from './dto/limit-query.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async create(@Body() createProductDto: CreateProductDto): Promise<string> {
    const newProduct = await this.productsService.create(createProductDto);
    console.log(newProduct);
    return newProduct;
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

  @Get('latest')
  @ApiOperation({ summary: 'Get latest products' })
  @ApiResponse({
    status: 200,
    description: 'Latest products retrieved successfully',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of products to return',
  })
  findLatest(@Query() query: LimitQueryDto) {
    return this.productsService.findLatest(query.limit);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Get featured products' })
  @ApiResponse({
    status: 200,
    description: 'Featured products retrieved successfully',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of products to return',
  })
  findFeatured(@Query() query: LimitQueryDto) {
    return this.productsService.findFeatured(query.limit);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all product categories' })
  @ApiResponse({
    status: 200,
    description: 'Categories retrieved successfully',
  })
  getCategories() {
    return this.productsService.getCategories();
  }

  @Get('brands')
  @ApiOperation({ summary: 'Get all product brands' })
  @ApiResponse({ status: 200, description: 'Brands retrieved successfully' })
  getBrands() {
    return this.productsService.getBrands();
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get products by category' })
  @ApiResponse({
    status: 200,
    description: 'Products by category retrieved successfully',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of products to return',
  })
  findByCategory(
    @Param('category') category: string,
    @Query() query: LimitQueryDto,
  ) {
    return this.productsService.findByCategory(category, query.limit);
  }

  @Get('brand/:brand')
  @ApiOperation({ summary: 'Get products by brand' })
  @ApiResponse({
    status: 200,
    description: 'Products by brand retrieved successfully',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of products to return',
  })
  findByBrand(@Param('brand') brand: string, @Query() query: LimitQueryDto) {
    return this.productsService.findByBrand(brand, query.limit);
  }

  @Get('internal/:id')
  @ApiOperation({ summary: 'Get product by internal ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findById(@Param('id') id: string) {
    return this.productsService.findById(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiResponse({ status: 200, description: 'Product retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update product by ID' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Update product stock' })
  @ApiResponse({ status: 200, description: 'Stock updated successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  updateStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('quantity', ParseIntPipe) quantity: number,
  ) {
    return this.productsService.updateStock(id, quantity);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiResponse({ status: 204, description: 'Product deleted successfully' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.remove(id);
  }
}
