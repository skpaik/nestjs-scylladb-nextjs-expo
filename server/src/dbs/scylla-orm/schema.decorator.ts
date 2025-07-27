// scylla-orm/schema.decorator.ts
import 'reflect-metadata';

const SCYLLA_SCHEMA_KEY = 'scylla:schema';

export function ScyllaSchema(table: string) {
  return function (constructor: Function) {
    Reflect.defineMetadata(SCYLLA_SCHEMA_KEY, table, constructor);
  };
}

export function getSchemaTable(target: any): string {
  return Reflect.getMetadata(SCYLLA_SCHEMA_KEY, target.constructor);
}
