// scylla-orm/utils.ts
import { QueryType } from './types';

export function detectQueryType(query: string): QueryType {
  const prefix = query.trim().split(/\s+/)[0].toUpperCase();
  if (['INSERT', 'UPDATE', 'DELETE', 'SELECT'].includes(prefix)) {
    return prefix as QueryType;
  }
  throw new Error(`Unsupported query type: ${prefix}`);
}
