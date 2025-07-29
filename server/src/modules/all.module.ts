import { Module } from '@nestjs/common';
import { HomeModule } from './home/home.module';
import { ProductsModule } from './products/products.module';
import { UserService } from './users/user.service';

@Module({
  imports: [HomeModule, ProductsModule],
  controllers: [],
  providers: [UserService],
})
export class AllModule {}
