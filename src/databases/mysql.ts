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

import { createConnection, ConnectionConfig, Connection } from 'mysql';
import DatabaseClient, {
  CreateDatabaseOptions,
  CreateDatabaseResult,
  DropDatabaseOptions
} from './databaseClient';

export default class Mysql extends DatabaseClient {
  private client: Connection;

  constructor(clientConfig: ConnectionConfig | string) {
    super();
    this.client = createConnection(clientConfig);
  }

  async createDatabase(
    databaseName: string,
    createDatabaseOptions: Partial<CreateDatabaseOptions> = {}
  ): Promise<CreateDatabaseResult> {
    this.assertDatabaseName(databaseName);
    const { ignoreIfExists }: CreateDatabaseOptions = {
      ignoreIfExists: true,
      ...createDatabaseOptions
    };
    this.client.connect();
    this.client.query(
      `CREATE DATABASE${ignoreIfExists ? ' IF NOT EXISTS' : ''} ${databaseName}`
    );
    this.client.end();
    return CreateDatabaseResult.Created;
  }

  async dropDatabase(
    databaseName: string,
    _dropDatabaseOptions: Partial<DropDatabaseOptions> = {}
  ): Promise<void> {
    this.assertDatabaseName(databaseName);
    this.client.connect();
    this.client.query(`DROP DATABASE ${databaseName}`);
    this.client.end();
  }

  assertDatabaseName(databaseName: string) {
    if (!/^[^\d][\w_]+$/g.test(databaseName)) {
      throw new Error(`database name '${databaseName}' is invalid`);
    }
  }
}
