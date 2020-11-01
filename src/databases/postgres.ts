import { Client, ClientConfig } from 'pg';
import DatabaseClient, {
  CreateDatabaseOptions,
  CreateDatabaseResult
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
}
