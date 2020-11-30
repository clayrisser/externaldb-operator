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

import { KubernetesObject } from '@kubernetes/client-node';
import { KustomizationSpec } from './kustomize';

export interface ConnectionDatabaseSpec {
  configMapName?: string; // string `json:"configMapName,omitempty"`
  database?: string; // string `json:"database,omitempty"`
  hostname?: string; // string `json:"hostname,omitempty"`
  password?: string; // string `json:"password,omitempty"`
  port?: number; // int64 `json:"port,omitempty"`
  secretName?: string; // string `json:"secretName,omitempty"`
  url?: string; // string `json:"url,omitempty"`
  username?: string; // string `json:"username,omitempty"`
}

export interface DatabaseConnection {
  name?: string; // string `json:"name,omitempty"`
  namespace?: string; // string `json:"namespace,omitempty"`
}

export interface ExternalDatabaseSpec {
  configMapName?: string; // string `json:"configMapName,omitempty"`
  secretName?: string; // string `json:"secretName,omitempty"`
  cleanup?: boolean; // bool `json:"cleanup,omitempty"`
  connection?: DatabaseConnection; // DatabaseConnection `json:"connection,omitempty"`
  kustomization?: KustomizationSpec; // KustomizationSpec `json:"kustomization,omitempty" yaml:"kustomization,omitempty"`
  name?: string; // string `json:"name,omitempty"`
}

export interface ExternalDatabaseStatus {
  database?: ExternalDatabaseStatusDatabase; // string `json:"database,omitempty"`
  message?: string; // string `json:"message,omitempty"`
  phase?: ExternalDatabaseStatusPhase; // string `json:"phase,omitempty"`
  ready?: boolean; // bool `json:"ready,omitempty"`
}

export interface ConnectionMongoSpec extends ConnectionDatabaseSpec {}

export interface ConnectionMysqlSpec extends ConnectionDatabaseSpec {}

export interface ConnectionPostgresSpec extends ConnectionDatabaseSpec {
  sslMode?: PostgresSslMode; // string `json:"sslMode,omitempty"`
}

export interface ExternalMongoSpec extends ExternalDatabaseSpec {}

export interface ExternalMysqlSpec extends ExternalDatabaseSpec {}

export interface ExternalPostgresSpec extends ExternalDatabaseSpec {}

export interface ExternalMongoStatus extends ExternalDatabaseStatus {}

export interface ExternalMysqlStatus extends ExternalDatabaseStatus {}

export interface ExternalPostgresStatus extends ExternalDatabaseStatus {}

export interface ConnectionMongoResource extends KubernetesObject {
  spec?: ConnectionMongoSpec;
}

export interface ConnectionMysqlResource extends KubernetesObject {
  spec?: ConnectionMysqlSpec;
}

export interface ConnectionPostgresResource extends KubernetesObject {
  spec?: ConnectionPostgresSpec;
}

export interface ExternalMongoResource extends KubernetesObject {
  spec?: ExternalMongoSpec;
  status?: ExternalMongoStatus;
}

export interface ExternalMysqlResource extends KubernetesObject {
  spec?: ExternalMysqlSpec;
  status?: ExternalMysqlStatus;
}

export interface ExternalPostgresResource extends KubernetesObject {
  spec?: ExternalPostgresSpec;
  status?: ExternalPostgresStatus;
}

export enum ExternalDatabaseStatusDatabase {
  AlreadyExists = 'AlreadyExists',
  Created = 'Created',
  Creating = 'Creating',
  Deleting = 'Deleting',
  Failed = 'Failed'
}

export enum PostgresSslMode {
  Allow = 'allow',
  AllowUnauthorized = 'allow-unauthorized',
  Disable = 'disable',
  Prefer = 'prefer',
  Require = 'require',
  VerifyCa = 'verify-ca',
  VerifyFull = 'verify-full'
}

export enum ExternalDatabaseStatusPhase {
  Failed = 'Failed',
  Pending = 'Pending',
  Succeeded = 'Succeeded',
  Unknown = 'Unknown'
}
