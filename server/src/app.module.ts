import { Module } from '@nestjs/common';
import { AllModule } from './modules/all.module';
import { CassandraModule } from './dbs/cassandra/cassandra.module';
import { ScyllaOrmModule } from './dbs/scylla-orm/scylla-orm.module';

@Module({
  imports: [AllModule, CassandraModule, ScyllaOrmModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
