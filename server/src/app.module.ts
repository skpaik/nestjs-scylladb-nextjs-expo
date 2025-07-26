import { Module } from '@nestjs/common';
import { AllModule } from './modules/all.module';
import { CassandraModule } from './cassandra/cassandra.module';

@Module({
  imports: [AllModule, CassandraModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
