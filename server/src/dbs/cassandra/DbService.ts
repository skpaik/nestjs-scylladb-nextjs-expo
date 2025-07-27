import { Injectable } from '@nestjs/common';
import { CassandraService } from './cassandra.service';
import { ArrayOrObject, QueryOptions } from 'cassandra-driver';
import { types as cassandraTypes } from 'cassandra-driver/lib/types';

@Injectable()
export class DbService {
  constructor(private readonly cassandra: CassandraService) {}

  executeQuery(
    query: string,
    params?: ArrayOrObject,
    options?: QueryOptions,
  ): Promise<cassandraTypes.ResultSet> {
    return this.cassandra.getClient().execute(query, params, options);
  }

  async executeBatch(statements: { query: string; params: any[] }[]) {
    return this.cassandra.getClient().batch(statements, { prepare: true });
  }
}
