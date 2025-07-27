// scylla-orm/scylla-orm.service.ts
import 'reflect-metadata';
import { Injectable } from '@nestjs/common';
import { detectQueryType } from './utils';
import { getSchemaTable } from './schema.decorator';
import { QueryType } from './types';

@Injectable()
export class ScyllaOrmService {
  private schemas = new Map<string, string[]>();

  registerSchema<T>(cls: new () => T): void {
    const instance = new cls();
    const fields = Object.keys(instance as object);
    const table = getSchemaTable(instance);
    this.schemas.set(table, fields);
  }

  getFields(table: string): string[] {
    const fields = this.schemas.get(table);
    if (!fields) throw new Error(`Schema not found for table: ${table}`);
    return fields;
  }

  insert<T extends Record<string, any>>(
    entity: T,
  ): { query: string; params: any[] } {
    const table = getSchemaTable(entity);
    const fields = this.getFields(table);

    const columns = fields.join(', ');
    const placeholders = fields.map(() => '?').join(', ');
    const query = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

    const params = fields.map((f) => entity[f]);
    return { query, params };
  }

  update<T extends Record<string, any>>(
    entity: T,
    where: Partial<T>,
  ): { query: string; params: any[] } {
    const table = getSchemaTable(entity);
    const allFields = this.getFields(table);

    const whereKeys = Object.keys(where);
    const setFields = allFields.filter(
      (field) => field in entity && !whereKeys.includes(field),
    );

    if (setFields.length === 0) {
      throw new Error('No fields to update');
    }

    const setClause = setFields.map((f) => `${f} = ?`).join(', ');
    const whereClause = whereKeys.map((k) => `${k} = ?`).join(' AND ');

    const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    const params = [
      ...setFields.map((f) => entity[f]),
      ...whereKeys.map((k) => (where as any)[k]),
    ];

    return { query, params };
  }

  update2<T extends Record<string, any>>(
    entity: T,
    where: Partial<T>,
  ): { query: string; params: any[] } {
    const table = getSchemaTable(entity);
    const fields = this.getFields(table).filter((f) => f in entity);

    const setClause = fields.map((f) => `${f} = ?`).join(', ');
    const whereClause = Object.keys(where)
      .map((k) => `${k} = ?`)
      .join(' AND ');
    const query = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;

    const params = [
      ...fields.map((f) => entity[f]),
      ...Object.keys(where).map((k) => (where as any)[k]),
    ];
    return { query, params };
  }

  mapQueryParams<T extends Record<string, any>>(query: string, data: T): any[] {
    const type: QueryType = detectQueryType(query);
    const placeholders = query.split('?').length - 1;
    const keys = Object.keys(data);

    if (placeholders !== keys.length) {
      throw new Error(
        `Expected ${placeholders} values, but got ${keys.length}`,
      );
    }

    return keys.map((k) => data[k]);
  }

  prepareBatch(statements: { query: string; data: Record<string, any> }[]) {
    return statements.map(({ query, data }) => ({
      query,
      params: this.mapQueryParams(query, data),
    }));
  }
}
