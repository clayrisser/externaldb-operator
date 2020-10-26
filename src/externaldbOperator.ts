import Operator from '@dot-i/k8s-operator';
import YAML from 'yaml';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import Logger from './logger';
import { Config } from './config';
import { OperatorFrameworkProject, OperatorFrameworkResource } from './types';

export const project: OperatorFrameworkProject = YAML.parse(
  fs.readFileSync(path.resolve(__dirname, '../PROJECT')).toString()
);

export default class ExternaldbOperator extends Operator {
  static labelNamespace = 'dev.siliconhills.helm2cattle';

  spinner = ora();

  constructor(protected config: Config, protected log = new Logger()) {
    super(log);
  }

  protected async init() {
    await Promise.all(
      project.resources.map(async (resource: OperatorFrameworkResource) => {
        return this.watchResource(
          ExternaldbOperator.resource2Group(resource.group),
          resource.version,
          ExternaldbOperator.kind2plural(resource.kind),
          async (e) => {
            try {
              console.log(e);
            } catch (err) {
              console.log(err);
              this.spinner.fail(
                [
                  err.message || '',
                  err.body?.message || err.response?.body?.message || ''
                ].join(': ')
              );
              if (this.config.debug) this.log.error(err);
            }
          }
        ).catch(console.error);
      })
    );
  }

  static resource2Group(group: string) {
    return `${group}.${project.domain}`;
  }

  static kind2plural(kind: string) {
    const lowercasedKind = kind.toLowerCase();
    if (lowercasedKind[lowercasedKind.length - 1] === 's') {
      return lowercasedKind;
    }
    return `${lowercasedKind}s`;
  }
}
