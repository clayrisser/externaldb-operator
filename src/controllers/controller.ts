import ora from 'ora';
import { KubernetesObject } from '@kubernetes/client-node';
import { ResourceMeta } from '@dot-i/k8s-operator';
import { getGroupName, kind2plural } from '~/util';

export default abstract class Controller {
  constructor(protected groupNamePrefix: string, protected kind: string) {
    this.group = getGroupName(this.groupNamePrefix);
    this.plural = kind2plural(this.kind);
  }

  protected group: string;

  protected plural: string;

  spinner = ora();

  async added(_resource: KubernetesObject, _meta: ResourceMeta): Promise<any> {}

  async addedOrModified(
    _resource: KubernetesObject,
    _meta: ResourceMeta
  ): Promise<any> {}

  async deleted(
    _resource: KubernetesObject,
    _meta: ResourceMeta
  ): Promise<any> {}

  async modified(
    _resource: KubernetesObject,
    _meta: ResourceMeta
  ): Promise<any> {}
}
