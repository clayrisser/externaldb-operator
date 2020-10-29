import { ResourceEvent } from '@dot-i/k8s-operator';

export default abstract class Controller {
  constructor() {}

  async added(_e: ResourceEvent): Promise<any> {}

  async deleted(_e: ResourceEvent): Promise<any> {}

  async modified(_e: ResourceEvent): Promise<any> {}
}
