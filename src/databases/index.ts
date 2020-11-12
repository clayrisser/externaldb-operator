import { ClientConfig } from 'pg';
import DatabaseClient from './databaseClient';
import Mysql from './mysql';
import Postgres from './postgres';

export enum DatabaseKind {
  Mysql = 'MYSQL',
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
    case DatabaseKind.Mysql: {
      return new Mysql(options);
    }
    case DatabaseKind.Postgres: {
      return new Postgres(options);
    }
  }
}

export { DatabaseClient, Postgres, Mysql };

export * from './databaseClient';
export * from './mysql';
export * from './postgres';
