import { ClientConfig } from 'pg';
import DatabaseClient from './databaseClient';
import Postgres from './postgres';

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

export { DatabaseClient, Postgres };

export * from './postgres';
export * from './databaseClient';
