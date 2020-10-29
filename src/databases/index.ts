import { ClientConfig } from 'pg';
import Postgres from './postgres';

export abstract class DatabaseClient {
  abstract async createDatabase(
    databaseName: string,
    createDatabaseOptions?: Partial<CreateDatabaseOptions>
  ): Promise<void>;
}

export interface CreateDatabaseOptions {
  ignoreIfExists: boolean;
}

export enum DatabaseKind {
  Postgres = 'POSTGRES'
}

export function createDatabaseClient(
  databaseKind: DatabaseKind.Postgres,
  options?: ClientConfig
): Postgres;
export function createDatabaseClient(
  databaseKind: DatabaseKind,
  options?: any
): DatabaseClient {
  switch (databaseKind) {
    case DatabaseKind.Postgres: {
      return new Postgres(options);
    }
  }
}

export { Postgres };

export * from './postgres';
