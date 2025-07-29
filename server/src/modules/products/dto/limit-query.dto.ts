// src/products/dto/limit-query.dto.ts
import { Type } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';

export class LimitQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
