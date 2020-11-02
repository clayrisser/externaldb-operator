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
