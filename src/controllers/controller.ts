import { ResourceMeta } from '@dot-i/k8s-operator';
import { KubernetesObject } from '@kubernetes/client-node';

export default abstract class Controller {
  constructor() {}

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
