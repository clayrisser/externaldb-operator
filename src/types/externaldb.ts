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
}

export interface ConnectionMongoSpec extends ConnectionDatabaseSpec {}

export interface ConnectionMysqlSpec extends ConnectionDatabaseSpec {}

export interface ConnectionPostgresSpec extends ConnectionDatabaseSpec {}

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
  AlreadyExists = 'ALREADY_EXISTS',
  Created = 'CREATED',
  Creating = 'CREATING',
  Deleting = 'DELETING',
  Failed = 'FAILED'
}
