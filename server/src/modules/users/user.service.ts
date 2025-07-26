import { Injectable } from '@nestjs/common';
import { CassandraService } from '../../cassandra/cassandra.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(private readonly cassandraService: CassandraService) {}

  async createUser(name: string) {
    const client = this.cassandraService.getClient();
    const query = 'INSERT INTO users (id, name) VALUES (?, ?)';
    await client.execute(query, [uuidv4(), name], { prepare: true });
  }

  async getUsers() {
    const client = this.cassandraService.getClient();
    const result = await client.execute('SELECT * FROM users');
    return result.rows;
  }
}
