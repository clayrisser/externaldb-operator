import { ResourceMeta } from '@dot-i/k8s-operator';
import { CreateDatabaseResult, Postgres } from '~/databases';
import ExternalDatabase from './externalDatabase';
import { ExternalPostgresResource, ConnectionPostgresResource } from '~/types';
import ExternaldbOperator, {
  ResourceGroup,
  ResourceKind,
  ResourceVersion
} from '~/externaldbOperator';

export default class ExternalPostgres extends ExternalDatabase {
  async added(
    resource: ExternalPostgresResource,
    _meta: ResourceMeta
  ): Promise<any> {
    const namespace =
      resource.spec?.connection?.namespace || resource.metadata?.namespace;
    if (!resource.spec?.name || !resource.spec.connection?.name || !namespace) {
      return;
    }
    const connectionPostgres = (
      await this.customObjectsApi.getNamespacedCustomObject(
        ExternaldbOperator.resource2Group(ResourceGroup.Externaldb),
        ResourceVersion.V1alpha1,
        namespace,
        ExternaldbOperator.kind2plural(ResourceKind.ConnectionPostgres),
        resource.spec.connection.name
      )
    ).body as ConnectionPostgresResource;
    const database = connectionPostgres.spec?.database || 'postgres';
    this.spinner.start(`creating database '${database}'`);
    const postgres = new Postgres({
      connectionString: connectionPostgres.spec?.url,
      database,
      host: connectionPostgres.spec?.hostname || 'localhost',
      password: connectionPostgres.spec?.password,
      port: connectionPostgres.spec?.port || 5432,
      user: connectionPostgres.spec?.username
    });
    postgres.spinner = this.spinner;
    const result = await postgres.createDatabase(resource.spec.name);
    if (result === CreateDatabaseResult.AlreadyExists) {
      this.spinner.warn(`database '${database}' already exists`);
    } else {
      this.spinner.succeed(`created database '${database}'`);
    }
  }
}
