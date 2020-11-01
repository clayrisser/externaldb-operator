import ora from 'ora';

export default abstract class DatabaseClient {
  public spinner = ora();

  abstract async createDatabase(
    databaseName: string,
    createDatabaseOptions?: Partial<CreateDatabaseOptions>
  ): Promise<CreateDatabaseResult>;
}

export interface CreateDatabaseOptions {
  ignoreIfExists: boolean;
}

export enum CreateDatabaseResult {
  AlreadyExists = 'AlreadyExists',
  Created = 'CREATED'
}
