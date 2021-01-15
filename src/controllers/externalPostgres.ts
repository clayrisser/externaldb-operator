/**
 * Copyright 2020 Silicon Hills LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { KustomizationResource } from 'kustomize-operator';
import { ResourceMeta } from '@dot-i/k8s-operator';
import Connection, { Protocol } from '~/connection';
import { CreateDatabaseResult, Postgres } from '~/databases';
import { kind2plural, getGroupName } from '~/util';
import {
  ConnectionPostgresResource,
  ExternalDatabaseStatusDatabase,
  ExternalDatabaseStatusPhase,
  ExternalPostgresResource,
  ExternalPostgresStatus,
  PostgresSslMode
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
    _meta: ResourceMeta,
    _oldResource?: ExternalPostgresResource
  ): Promise<any> {
    if (!resource.spec?.name) return;
    const connectionResource = await this.getConnectionResource(resource);
    if (!connectionResource?.spec) return;
    const { database, url } = await this.getConnection(connectionResource);
    if (
      resource.status?.database !== ExternalDatabaseStatusDatabase.Created ||
      !resource.spec.cleanup
    ) {
      return;
    }
    this.spinner.start(`dropping database '${database}'`);
    const postgres = new Postgres({
      connectionString: url,
      ssl: { rejectUnauthorized: false }
    });
    postgres.spinner = this.spinner;
    await postgres.dropDatabase(resource.spec.name);
    this.spinner.succeed(`dropped database '${database}'`);
    this.spinner.start(
      `deleting kustomization '${resource.metadata?.name}' in namespace '${resource.metadata?.namespace}'`
    );
    await this.deleteKustomization(resource);
    this.spinner.start(
      `deleted kustomization '${resource.metadata?.name}' in namespace '${resource.metadata?.namespace}'`
    );
  }

  async addedOrModified(
    resource: ExternalPostgresResource,
    _meta: ResourceMeta,
    oldResource?: ExternalPostgresResource
  ): Promise<any> {
    if (
      !resource.spec?.name ||
      (resource.metadata?.generation &&
        resource.metadata?.generation === oldResource?.metadata?.generation)
    ) {
      return;
    }
    const connectionResource = await this.getConnectionResource(resource);
    if (!connectionResource?.spec) return;
    const { database, url } = await this.getConnection(connectionResource);
    this.spinner.start(`creating database '${database}'`);
    try {
      await this.updateStatus(
        {
          database: ExternalDatabaseStatusDatabase.Creating,
          message: 'creating postgres',
          phase: ExternalDatabaseStatusPhase.Pending,
          ready: false
        },
        resource
      );
      const postgres = new Postgres({
        connectionString: url,
        ssl: { rejectUnauthorized: false }
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
        connectionResource
      );
      if (resource.spec.kustomization) await this.applyKustomization(resource);
      await this.updateStatus(
        {
          message: 'created postgres',
          phase: ExternalDatabaseStatusPhase.Succeeded,
          ready: true,
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
          database: ExternalDatabaseStatusDatabase.Failed,
          message: err.message?.toString() || '',
          phase: ExternalDatabaseStatusPhase.Failed,
          ready: false
        },
        resource
      );
      throw err;
    }
  }

  async deleteKustomization(resource: ExternalPostgresResource): Promise<void> {
    if (!resource.metadata?.name || !resource.metadata.namespace) return;
    await this.customObjectsApi.deleteNamespacedCustomObject(
      getGroupName(KustomizeResourceGroup.Kustomize, 'siliconhills.dev'),
      KustomizeResourceVersion.V1alpha1,
      resource.metadata.namespace,
      kind2plural(KustomizeResourceKind.Kustomization),
      resource.metadata.name
    );
  }

  async applyKustomization(resource: ExternalPostgresResource): Promise<void> {
    if (!resource.metadata?.name || !resource.metadata.namespace) return;
    try {
      await this.customObjectsApi.getNamespacedCustomObject(
        getGroupName(KustomizeResourceGroup.Kustomize, 'siliconhills.dev'),
        KustomizeResourceVersion.V1alpha1,
        resource.metadata.namespace,
        kind2plural(KustomizeResourceKind.Kustomization),
        resource.metadata.name
      );
      await this.customObjectsApi.patchNamespacedCustomObject(
        getGroupName(KustomizeResourceGroup.Kustomize, 'siliconhills.dev'),
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
      if (err.statusCode !== 404) throw err;
      const kustomizationResource: KustomizationResource = {
        apiVersion: `${getGroupName(
          KustomizeResourceGroup.Kustomize,
          'siliconhills.dev'
        )}/${KustomizeResourceVersion.V1alpha1}`,
        kind: KustomizeResourceKind.Kustomization,
        metadata: {
          name: resource.metadata.name,
          namespace: resource.metadata.namespace
        },
        spec: resource.spec?.kustomization
      };
      await this.customObjectsApi.createNamespacedCustomObject(
        getGroupName(KustomizeResourceGroup.Kustomize, 'siliconhills.dev'),
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

  async getConnectionResource(
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
    try {
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
    } catch (err) {
      if (err.statusCode !== 404) throw err;
    }
  }

  async getConnection(
    connectionResource: ConnectionPostgresResource
  ): Promise<Connection> {
    const sslMode = connectionResource.spec?.sslMode;
    let database = connectionResource.spec?.database;
    let hostname = connectionResource.spec?.hostname;
    let password = connectionResource.spec?.password;
    let port = connectionResource.spec?.port;
    let url = connectionResource.spec?.url;
    let username = connectionResource.spec?.username;
    if (connectionResource.metadata?.namespace && connectionResource.spec) {
      if (connectionResource.spec?.configMapName) {
        try {
          const configMap = (
            await this.coreV1Api.readNamespacedConfigMap(
              connectionResource.spec.configMapName,
              connectionResource.metadata.namespace
            )
          ).body;
          if (configMap.data?.POSTGRES_DATABASE) {
            database = configMap.data.POSTGRES_DATABASE;
          }
          if (configMap.data?.POSTGRES_PORT) {
            const postgresPort = Number(configMap.data.POSTGRES_PORT);
            if (!isNaN(postgresPort)) port = postgresPort;
          }
          if (configMap.data?.POSTGRES_USERNAME) {
            username = configMap.data.POSTGRES_USERNAME;
          }
          if (configMap.data?.POSTGRES_HOSTNAME) {
            hostname = configMap.data.POSTGRES_HOSTNAME;
          }
        } catch (err) {
          if (err.statusCode !== 404) throw err;
        }
      }
      if (connectionResource.spec.secretName) {
        try {
          const secret = (
            await this.coreV1Api.readNamespacedSecret(
              connectionResource.spec.secretName,
              connectionResource.metadata.namespace
            )
          ).body;
          if (secret.data?.POSTGRES_PASSWORD) {
            password = Buffer.from(
              secret.data.POSTGRES_PASSWORD,
              'base64'
            ).toString('utf-8');
          }
          if (secret.data?.POSTGRES_URL) {
            url = Buffer.from(secret.data.POSTGRES_URL, 'base64').toString(
              'utf-8'
            );
          }
        } catch (err) {
          if (err.statusCode !== 404) throw err;
        }
      }
    }
    const result = new Connection(
      url || {
        database: database || 'postgres',
        hostname,
        password,
        port: port || 3306,
        protocol: Protocol.Postgres,
        username: username || 'postgres',
        options: {
          ...(sslMode === PostgresSslMode.AllowUnauthorized
            ? {}
            : {
                sslmode: sslMode || PostgresSslMode.Prefer
              })
        }
      }
    );
    return result;
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
    const connection = await this.getConnection(connectionResource);
    const clonedConnection = new Connection({
      database: resource.spec.name,
      hostname: connection.hostname,
      password: connection.password,
      port: connection.port,
      protocol: resource.spec.protocol || connection.protocol,
      username: connection.username,
      options: {
        ...(typeof connection.options?.sslmode === 'undefined'
          ? {}
          : {
              sslmode: connection.options?.sslmode || PostgresSslMode.Prefer
            })
      }
    });
    const {
      database,
      hostname,
      options,
      password,
      port,
      url,
      username
    } = clonedConnection;
    const configMapName =
      resource.spec.configMapName || `${resource.metadata.name}-externaldb`;
    const secretName =
      resource.spec.secretName || `${resource.metadata.name}-externaldb`;
    const configMap = {
      POSTGRES_PORT: (port || 5432).toString(),
      POSTGRES_USERNAME: username || 'postgres',
      ...(database ? { POSTGRES_DATABASE: database } : {}),
      ...(hostname ? { POSTGRES_HOSTNAME: hostname } : {}),
      ...(typeof options?.sslmode === 'undefined'
        ? {}
        : {
            POSTGRES_SSLMODE: options?.sslmode
          })
    };
    const secret = {
      ...(password ? { POSTGRES_PASSWORD: password } : {}),
      ...(url ? { POSTGRES_URL: url } : {})
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
      if (err.statusCode !== 404) throw err;
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
      if (err.statusCode !== 404) throw err;
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
}
