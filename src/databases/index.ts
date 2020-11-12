/**
 * Copyright 2020 Silicon Hills LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
