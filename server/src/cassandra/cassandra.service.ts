// FIle: cassandra.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Client } from 'cassandra-driver';

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
}
