// FIle: cassandra.service.ts
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import {
  ArrayOrObject,
  Client,
  QueryOptions,
  types as cassandraTypes,
} from 'cassandra-driver';

@Injectable()
export class CassandraService implements OnModuleInit, OnModuleDestroy {
  private client: Client;

  async onModuleInit() {
    this.client = new Client({
      contactPoints: ['localhost'], // or 'scylladb' if using Docker
      localDataCenter: 'datacenter1',
      keyspace: 'my_keyspace',
    });

    await this.client.connect();
    console.log('Connected to Cassandra');
  }

  getClient(): Client {
    return this.client;
  }

  async onModuleDestroy() {
    await this.client.shutdown();
    console.log('Disconnected from Cassandra');
  }

  executeQuery(
    query: string,
    params?: ArrayOrObject,
    options?: QueryOptions,
  ): Promise<cassandraTypes.ResultSet> {
    console.log('query : ', query);
    console.log('params : ', params);

    return this.getClient().execute(query, params, options);
  }
}
