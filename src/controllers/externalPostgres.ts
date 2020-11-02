import { ResourceMeta } from '@dot-i/k8s-operator';
import { CreateDatabaseResult, Postgres } from '~/databases';
import { kind2plural, getGroupName } from '~/util';
import {
  ConnectionPostgresResource,
  ExternalDatabaseStatusDatabase,
  ExternalPostgresResource,
  ExternalPostgresStatus,
  KustomizationResource
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
      await this.createOrUpdateConnectionResources(
        resource,
        connectionPostgres
      );
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
    } catch (err) {
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

  async createOrUpdateConnectionResources(
    resource: ExternalPostgresResource,
    connectionResource: ConnectionPostgresResource
  ): Promise<void> {
    if (
      !resource.metadata?.name ||
      !resource.metadata.namespace ||
      !resource.spec?.name
    ) {
      return;
    }
    const configMapName = resource.metadata.name;
    const secretName = resource.metadata.name;
    const configMap = {
      PORT: (connectionResource.spec?.port || 5432).toString(),
      USERNAME: connectionResource.spec?.username || 'postgres',
      ...(resource.spec.name ? { DATABASE: resource.spec.name } : {}),
      ...(connectionResource.spec?.hostname
        ? { HOSTNAME: connectionResource.spec.hostname }
        : {})
    };
    const secret = {
      ...(connectionResource.spec?.password
        ? { PASSWORD: connectionResource.spec.password }
        : {}),
      ...(connectionResource.spec?.url
        ? { URL: connectionResource.spec.url }
        : {})
    };
    try {
      await this.coreV1Api.readNamespacedSecret(
        secretName,
        resource.metadata.namespace
      );
      await this.coreV1Api.patchNamespacedSecret(
        secretName,
        resource.metadata.namespace,
        [
          {
            op: 'replace',
            path: '/stringData',
            value: secret
          }
        ],
        undefined,
        undefined,
        undefined,
        undefined,
        {
          headers: { 'Content-Type': 'application/json-patch+json' }
        }
      );
    } catch (err) {
      await this.coreV1Api.createNamespacedSecret(resource.metadata.namespace, {
        metadata: {
          name: secretName,
          namespace: resource.metadata.namespace
        },
        stringData: secret
      });
    }
    try {
      await this.coreV1Api.readNamespacedConfigMap(
        configMapName,
        resource.metadata.namespace
      );
      await this.coreV1Api.patchNamespacedConfigMap(
        configMapName,
        resource.metadata.namespace,
        [
          {
            op: 'replace',
            path: '/data',
            value: configMap
          }
        ],
        undefined,
        undefined,
        undefined,
        undefined,
        {
          headers: { 'Content-Type': 'application/json-patch+json' }
        }
      );
    } catch (err) {
      await this.coreV1Api.createNamespacedConfigMap(
        resource.metadata.namespace,
        {
          metadata: {
            name: configMapName,
            namespace: resource.metadata.namespace
          },
          data: configMap
        }
      );
    }
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
