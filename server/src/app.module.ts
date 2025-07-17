import { Module } from '@nestjs/common';
import { AllModule } from './modules/all.module';
import { UserService } from './users/user.service';
import { CassandraModule } from './cassandra/cassandra.module';

@Module({
  imports: [AllModule, CassandraModule],
  controllers: [],
  providers: [UserService],
})
export class AppModule {}
