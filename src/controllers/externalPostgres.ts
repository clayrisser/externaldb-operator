import { ResourceMeta } from '@dot-i/k8s-operator';
import { Postgres } from '~/databases';
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
    if (
      !resource.spec?.name ||
      !resource.spec.connection?.name ||
      !resource.spec.connection.namespace
    ) {
      return;
    }
    const connectionPostgres = (
      await this.customObjectsApi.getNamespacedCustomObject(
        ExternaldbOperator.resource2Group(ResourceGroup.Externaldb),
        ResourceVersion.V1alpha1,
        resource.spec.connection.namespace,
        ExternaldbOperator.kind2plural(ResourceKind.ConnectionPostgres),
        resource.spec.connection.name
      )
    ).body as ConnectionPostgresResource;
    const postgres = new Postgres({
      connectionString: connectionPostgres.spec?.url,
      database: connectionPostgres.spec?.database,
      host: connectionPostgres.spec?.hostname,
      password: connectionPostgres.spec?.password,
      port: connectionPostgres.spec?.port,
      user: connectionPostgres.spec?.username
    });
    await postgres.createDatabase(resource.spec.name);
  }
}
