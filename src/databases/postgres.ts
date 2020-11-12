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

import { Client, ClientConfig } from 'pg';
import DatabaseClient, {
  CreateDatabaseOptions,
  CreateDatabaseResult,
  DropDatabaseOptions
} from './databaseClient';

export default class Postgres extends DatabaseClient {
  private client: Client;

  constructor(clientConfig: ClientConfig) {
    super();
    this.client = new Client(clientConfig);
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
    await this.client.connect();
    try {
      await this.client.query(`CREATE DATABASE ${databaseName}`);
    } catch (err) {
      await this.client.end();
      if (
        ignoreIfExists &&
        err.message.indexOf(`database "${databaseName}" already exists`) > -1
      ) {
        return CreateDatabaseResult.AlreadyExists;
      }
      throw err;
    }
    await this.client.end();
    return CreateDatabaseResult.Created;
  }

  async dropDatabase(
    databaseName: string,
    _dropDatabaseOptions: Partial<DropDatabaseOptions> = {}
  ): Promise<void> {
    this.assertDatabaseName(databaseName);
    await this.client.connect();
    await this.client.query(`DROP DATABASE ${databaseName}`);
    await this.client.end();
  }

  assertDatabaseName(databaseName: string) {
    if (!/^[^\d][\w_]+$/g.test(databaseName)) {
      throw new Error(`database name '${databaseName}' is invalid`);
    }
  }
}
