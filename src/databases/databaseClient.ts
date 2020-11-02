import ora from 'ora';

export default abstract class DatabaseClient {
  public spinner = ora();

  abstract async createDatabase(
    databaseName: string,
    createDatabaseOptions?: Partial<CreateDatabaseOptions>
  ): Promise<CreateDatabaseResult>;

  abstract async dropDatabase(
    databaseName: string,
    dropDatabaseOptions?: Partial<DropDatabaseOptions>
  ): Promise<void>;
}

export interface CreateDatabaseOptions {
  ignoreIfExists: boolean;
}

export enum CreateDatabaseResult {
  AlreadyExists = 'ALREADY_EXISTS',
  Created = 'CREATED'
}

export interface DropDatabaseOptions {}
