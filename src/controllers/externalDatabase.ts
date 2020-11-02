import * as k8s from '@kubernetes/client-node';
import Controller from './controller';

export default abstract class ExternalDatabase extends Controller {
  coreV1Api: k8s.CoreV1Api;

  customObjectsApi: k8s.CustomObjectsApi;

  kubeConfig: k8s.KubeConfig;

  constructor(groupnameprefix: string, kind: string) {
    super(groupnameprefix, kind);
    this.kubeConfig = new k8s.KubeConfig();
    this.kubeConfig.loadFromDefault();
    this.coreV1Api = this.kubeConfig.makeApiClient(k8s.CoreV1Api);
    this.customObjectsApi = this.kubeConfig.makeApiClient(k8s.CustomObjectsApi);
  }
}
