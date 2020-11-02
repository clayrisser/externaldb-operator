import { ResourceMeta } from '@dot-i/k8s-operator';
import { CreateDatabaseResult, Postgres } from '~/databases';
import { kind2plural, getGroupName } from '~/util';
import {
  ExternalPostgresResource,
  ConnectionPostgresResource,
  KustomizationResource,
  ExternalPostgresStatus,
  ExternalDatabaseStatusDatabase
} from '~/types';
import {
  KustomizeResourceGroup,
  KustomizeResourceKind,
  KustomizeResourceVersion,
  ResourceKind,
  ResourceVersion
} from '~/externaldbOperator';
import ExternalDatabase from './externalDatabase';

export default class ExternalPostgres extends ExternalDatabase {
  async deleted(
    resource: ExternalPostgresResource,
    _meta: ResourceMeta
  ): Promise<any> {
    if (!resource.spec?.name) return;
    const connectionPostgres = await this.getConnection(resource);
    if (!connectionPostgres) return;
    if (
      resource.status?.database !== ExternalDatabaseStatusDatabase.Created ||
      !resource.spec.cleanup
    ) {
      return;
    }
    const database = connectionPostgres.spec?.database || 'postgres';
    this.spinner.start(`dropping database '${database}'`);
    const postgres = new Postgres({
      connectionString: connectionPostgres.spec?.url,
      database,
      host: connectionPostgres.spec?.hostname || 'localhost',
      password: connectionPostgres.spec?.password,
      port: connectionPostgres.spec?.port || 5432,
      user: connectionPostgres.spec?.username
    });
    postgres.spinner = this.spinner;
    await postgres.dropDatabase(resource.spec.name);
    this.spinner.succeed(`dropped database '${database}'`);
  }

  async addedOrModified(
    resource: ExternalPostgresResource,
    _meta: ResourceMeta
  ): Promise<any> {
    if (!resource.spec?.name) return;
    const connectionPostgres = await this.getConnection(resource);
    if (!connectionPostgres) return;
    const status = await this.getStatus(resource);
    if (status?.database) return;
    const database = connectionPostgres.spec?.database || 'postgres';
    this.spinner.start(`creating database '${database}'`);
    try {
      await this.updateStatus(
        {
          database: ExternalDatabaseStatusDatabase.Creating
        },
        resource
      );
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
      if (resource.spec.kustomization) await this.applyKustomization(resource);
      await this.updateStatus(
        {
          database:
            result === CreateDatabaseResult.AlreadyExists
              ? ExternalDatabaseStatusDatabase.AlreadyExists
              : ExternalDatabaseStatusDatabase.Created
        },
        resource
      );
    } catch (err) {
      await this.updateStatus(
        {
          database: ExternalDatabaseStatusDatabase.Failed
        },
        resource
      );
      throw err;
    }
  }

  async applyKustomization(resource: ExternalPostgresResource): Promise<void> {
    if (!resource.metadata?.name || !resource.metadata.namespace) return;
    try {
      await this.customObjectsApi.getNamespacedCustomObject(
        getGroupName(KustomizeResourceGroup.Kustomize),
        KustomizeResourceVersion.V1alpha1,
        resource.metadata.namespace,
        kind2plural(KustomizeResourceKind.Kustomization),
        resource.metadata.name
      );
      const kustomizationResource: KustomizationResource = {
        metadata: {
          name: resource.metadata.name,
          namespace: resource.metadata.namespace
        },
        spec: resource.spec?.kustomization
      };
      await this.customObjectsApi.createNamespacedCustomObject(
        getGroupName(KustomizeResourceGroup.Kustomize),
        KustomizeResourceVersion.V1alpha1,
        resource.metadata.namespace,
        kind2plural(KustomizeResourceKind.Kustomization),
        kustomizationResource
      );
    } catch (err) {
      await this.customObjectsApi.patchNamespacedCustomObject(
        getGroupName(KustomizeResourceGroup.Kustomize),
        KustomizeResourceVersion.V1alpha1,
        resource.metadata.namespace,
        kind2plural(KustomizeResourceKind.Kustomization),
        resource.metadata.name,
        [
          {
            op: 'replace',
            path: '/spec',
            value: resource.spec?.kustomization
          }
        ],
        undefined,
        undefined,
        undefined,
        {
          headers: { 'Content-Type': 'application/json-patch+json' }
        }
      );
    }
  }

  async updateStatus(
    status: ExternalPostgresStatus,
    resource: ExternalPostgresResource
  ): Promise<void> {
    if (!resource.metadata?.name || !resource.metadata.namespace) return;
    await this.customObjectsApi.patchNamespacedCustomObjectStatus(
      this.group,
      ResourceVersion.V1alpha1,
      resource.metadata.namespace,
      this.plural,
      resource.metadata.name,
      [
        {
          op: 'replace',
          path: '/status',
          value: status
        }
      ],
      undefined,
      undefined,
      undefined,
      {
        headers: { 'Content-Type': 'application/json-patch+json' }
      }
    );
  }

  async getConnection(
    resource: ExternalPostgresResource
  ): Promise<ConnectionPostgresResource | undefined> {
    if (
      !resource.metadata?.name ||
      !resource.metadata.namespace ||
      !resource.spec?.connection?.name
    ) {
      return;
    }
    const namespace =
      resource.spec?.connection?.namespace || resource.metadata.namespace;
    const connectionPostgres = (
      await this.customObjectsApi.getNamespacedCustomObject(
        this.group,
        ResourceVersion.V1alpha1,
        namespace,
        kind2plural(ResourceKind.ConnectionPostgres),
        resource.spec.connection.name
      )
    ).body as ConnectionPostgresResource;
    return connectionPostgres;
  }

  async getStatus(
    resource: ExternalPostgresResource
  ): Promise<ExternalPostgresStatus | undefined> {
    if (!resource.metadata?.name || !resource.metadata.namespace) return;
    const body = (
      await this.customObjectsApi.getNamespacedCustomObjectStatus(
        this.group,
        ResourceVersion.V1alpha1,
        resource.metadata.namespace,
        this.plural,
        resource.metadata.name
      )
    ).body as ExternalPostgresResource;
    return body.status;
  }
}
