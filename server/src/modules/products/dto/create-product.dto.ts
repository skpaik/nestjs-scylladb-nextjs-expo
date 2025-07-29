// src/products/dto/create-product.dto.ts

import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsUUID,
  IsInt,
  IsPositive,
  IsIn,
  IsDate,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsDate()
  createdAt: Date;

  @IsInt()
  @IsPositive()
  seq: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  category: string;

  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  price: number;

  @IsString()
  @IsIn(['USD', 'EUR', 'GBP', 'INR']) // extend as needed
  currency: string;

  @IsInt()
  @IsPositive()
  stock: number;

  @IsString()
  @IsNotEmpty()
  ean: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsString()
  @IsIn(['in_stock', 'out_of_stock', 'discontinued']) // Extend if needed
  availability: string;

  @IsString()
  @IsNotEmpty()
  shortDescription: string;

  @IsString()
  @IsNotEmpty()
  image: string;
}
