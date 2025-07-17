import { Module, Global } from '@nestjs/common';
import { CassandraService } from './cassandra.service';

@Global() // Make it available globally
@Module({
  providers: [CassandraService],
  exports: [CassandraService],
})
export class CassandraModule {}
