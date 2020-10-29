import { ResourceMeta } from '@dot-i/k8s-operator';
import { Postgres } from '~/databases';
import ExternalDatabase from './externalDatabase';
import { ExternalPostgresResource } from '~/types';

export default class ExternalPostgres extends ExternalDatabase {
  async added(
    resource: ExternalPostgresResource,
    _meta: ResourceMeta
  ): Promise<any> {
    if (!resource.spec?.name) return;
    const postgres = new Postgres({});
    await postgres.createDatabase(resource.spec.name);
  }
}
