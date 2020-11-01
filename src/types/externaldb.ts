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
  cleanup?: boolean; // bool `json:"cleanup,omitempty"`
  connection?: DatabaseConnection; // DatabaseConnection `json:"connection,omitempty"`
  database?: string; // string `json:"database,omitempty"`
  kustomization?: KustomizationSpec; // KustomizationSpec `json:"kustomization,omitempty" yaml:"kustomization,omitempty"`
  name?: string; // string `json:"name,omitempty"`
}

export interface ConnectionMongoSpec extends ConnectionDatabaseSpec {}

export interface ConnectionMysqlSpec extends ConnectionDatabaseSpec {}

export interface ConnectionPostgresSpec extends ConnectionDatabaseSpec {}

export interface ExternalMongoSpec extends ExternalDatabaseSpec {}

export interface ExternalMysqlSpec extends ExternalDatabaseSpec {}

export interface ExternalPostgresSpec extends ExternalDatabaseSpec {}

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
}

export interface ExternalMysqlResource extends KubernetesObject {
  spec?: ExternalMysqlSpec;
}

export interface ExternalPostgresResource extends KubernetesObject {
  spec?: ExternalPostgresSpec;
}
