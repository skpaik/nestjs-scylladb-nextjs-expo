import {
  IsString,
  IsNumber,
  IsUUID,
  IsIn,
  IsPositive,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  Name: string;

  @IsString()
  Description: string;

  @IsString()
  Brand: string;

  @IsString()
  Category: string;

  @IsPositive()
  Price: number;

  @IsIn(['USD', 'EUR', 'INR']) // or use IsString() for more flexibility
  Currency: string;

  @IsNumber()
  Stock: number;

  @IsNumber()
  EAN: number;

  @IsString()
  Color: string;

  @IsString()
  Size: string;

  @IsIn(['in-stock', 'backorder', 'out-of-stock'])
  Availability: string;

  @IsString()
  ShortDescription: string;

  @IsString()
  Image: string;

  @IsUUID()
  ['Internal ID']: string;
}

export interface ProductRow {
  name: string;
  description: string;
  brand: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  ean: number;
  color: string;
  size: string;
  availability: string;
  shortdescription: string;
  image: string;
  id: string;
}
