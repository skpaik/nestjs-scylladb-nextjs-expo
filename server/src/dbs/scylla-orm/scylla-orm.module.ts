import { Module, Global } from '@nestjs/common';
import { ScyllaOrmService } from './scylla-orm.service';

@Global()
@Module({
  providers: [ScyllaOrmService],
  exports: [ScyllaOrmService],
})
export class ScyllaOrmModule {}
