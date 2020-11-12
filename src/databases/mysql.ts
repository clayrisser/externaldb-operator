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
