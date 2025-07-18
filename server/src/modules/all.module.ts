import { Module } from '@nestjs/common';
import { HomeModule } from './home/home.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [HomeModule, ProductsModule],
  controllers: [],
  providers: [],
})
export class AllModule {}
