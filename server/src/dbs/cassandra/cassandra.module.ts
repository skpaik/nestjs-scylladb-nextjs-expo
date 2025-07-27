import { Module, Global } from '@nestjs/common';
import { CassandraService } from './cassandra.service';
import { DbService } from './DbService';

@Global()
@Module({
  providers: [CassandraService, DbService],
  exports: [CassandraService, DbService],
})
export class CassandraModule {}
