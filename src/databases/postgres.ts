import { Client, ClientConfig } from 'pg';
import { CreateDatabaseOptions, DatabaseClient } from '.';

export default class Postgres implements DatabaseClient {
  private client: Client;

  constructor(clientConfig: ClientConfig) {
    this.client = new Client(clientConfig);
  }

  async createDatabase(
    databaseName: string,
    createDatabaseOptions: Partial<CreateDatabaseOptions> = {}
  ) {
    const { ignoreIfExists }: CreateDatabaseOptions = {
      ignoreIfExists: true,
      ...createDatabaseOptions
    };
    await this.client.connect();
    try {
      await this.client.query('CREATE DATABASE $1', [databaseName]);
    } catch (err) {
      if (!ignoreIfExists) throw err;
    }
    await this.client.end();
  }
}
