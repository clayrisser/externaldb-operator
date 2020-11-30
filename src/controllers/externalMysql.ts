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

import { ResourceMeta } from '@dot-i/k8s-operator';
import Connection, { Protocol } from '~/connection';
import { CreateDatabaseResult, Mysql } from '~/databases';
import { kind2plural, getGroupName } from '~/util';
import {
  ConnectionMysqlResource,
  ExternalDatabaseStatusDatabase,
  ExternalDatabaseStatusPhase,
  ExternalMysqlResource,
  ExternalMysqlStatus,
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

export default class ExternalMysql extends ExternalDatabase {
  async deleted(
    resource: ExternalMysqlResource,
    _meta: ResourceMeta
  ): Promise<any> {
    if (!resource.spec?.name) return;
    const connectionResource = await this.getConnectionResource(resource);
    if (!connectionResource?.spec?.password) return;
    const { database, url } = await this.getConnection(connectionResource);
    if (
      resource.status?.database !== ExternalDatabaseStatusDatabase.Created ||
      !resource.spec.cleanup
    ) {
      return;
    }
    this.spinner.start(`dropping database '${database}'`);
    const mysql = new Mysql(url);
    mysql.spinner = this.spinner;
    await mysql.dropDatabase(resource.spec.name);
    this.spinner.succeed(`dropped database '${database}'`);
  }

  async addedOrModified(
    resource: ExternalMysqlResource,
    _meta: ResourceMeta
  ): Promise<any> {
    if (!resource.spec?.name) return;
    const connectionResource = await this.getConnectionResource(resource);
    if (!connectionResource?.spec?.password) return;
    const { database, url } = await this.getConnection(connectionResource);
    const status = await this.getStatus(resource);
    if (status?.database) return;
    this.spinner.start(`creating database '${database}'`);
    try {
      await this.updateStatus(
        {
          database: ExternalDatabaseStatusDatabase.Creating,
          message: 'creating mysql',
          phase: ExternalDatabaseStatusPhase.Pending,
          ready: false
        },
        resource
      );
      const mysql = new Mysql(url);
      mysql.spinner = this.spinner;
      const result = await mysql.createDatabase(resource.spec.name);
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
          message: 'created mysql',
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

  async applyKustomization(resource: ExternalMysqlResource): Promise<void> {
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
      if (err.statusCode !== 404) throw err;
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
    status: ExternalMysqlStatus,
    resource: ExternalMysqlResource
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
    resource: ExternalMysqlResource
  ): Promise<ConnectionMysqlResource | undefined> {
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
      const connectionMysql = (
        await this.customObjectsApi.getNamespacedCustomObject(
          this.group,
          ResourceVersion.V1alpha1,
          namespace,
          kind2plural(ResourceKind.ConnectionMysql),
          resource.spec.connection.name
        )
      ).body as ConnectionMysqlResource;
      return connectionMysql;
    } catch (err) {
      if (err.statusCode !== 404) throw err;
    }
  }

  async getConnection(
    connectionResource: ConnectionMysqlResource
  ): Promise<Connection> {
    let database = connectionResource.spec?.database;
    let hostname = connectionResource.spec?.hostname;
    let password = connectionResource.spec?.password;
    let port = connectionResource.spec?.port;
    let url = connectionResource.spec?.url;
    let username = connectionResource.spec?.username;
    if (
      connectionResource.metadata?.namespace &&
      connectionResource.spec?.configMapName
    ) {
      if (connectionResource.spec?.configMapName) {
        try {
          const configMap = (
            await this.coreV1Api.readNamespacedConfigMap(
              connectionResource.spec.configMapName,
              connectionResource.metadata.namespace
            )
          ).body;
          if (configMap.data?.MYSQL_DATABASE) {
            database = configMap.data.MYSQL_DATABASE;
          }
          if (configMap.data?.MYSQL_PORT) {
            const mysqlPort = Number(configMap.data.MYSQL_PORT);
            if (!isNaN(mysqlPort)) port = mysqlPort;
          }
          if (configMap.data?.MYSQL_USERNAME) {
            username = configMap.data.MYSQL_USERNAME;
          }
          if (configMap.data?.MYSQL_HOSTNAME) {
            hostname = configMap.data.MYSQL_HOSTNAME;
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
          if (secret.stringData?.MYSQL_PASSWORD) {
            password = secret.stringData.MYSQL_PASSWORD;
          }
          if (secret.stringData?.MYSQL_URL) {
            url = secret.stringData.MYSQL_URL;
          }
        } catch (err) {
          if (err.statusCode !== 404) throw err;
        }
      }
    }
    return new Connection(
      url || {
        database: database || 'mysql',
        hostname,
        password,
        port: port || 3306,
        protocol: Protocol.Mysql,
        username: username || 'mysql'
      }
    );
  }

  async createOrUpdateConnectionResources(
    resource: ExternalMysqlResource,
    connectionResource: ConnectionMysqlResource
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
      protocol: Protocol.Mysql,
      username: connection.username
    });
    const {
      database,
      hostname,
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
      MYSQL_PORT: (port || 5432).toString(),
      MYSQL_USERNAME: username || 'mysql',
      ...(database ? { MYSQL_DATABASE: database } : {}),
      ...(hostname ? { MYSQL_HOSTNAME: hostname } : {})
    };
    const secret = {
      ...(password ? { MYSQL_PASSWORD: password } : {}),
      ...(url ? { MYSQL_URL: url } : {})
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

  async getStatus(
    resource: ExternalMysqlResource
  ): Promise<ExternalMysqlStatus | undefined> {
    if (!resource.metadata?.name || !resource.metadata.namespace) return;
    const body = (
      await this.customObjectsApi.getNamespacedCustomObjectStatus(
        this.group,
        ResourceVersion.V1alpha1,
        resource.metadata.namespace,
        this.plural,
        resource.metadata.name
      )
    ).body as ExternalMysqlResource;
    return body.status;
  }
}
