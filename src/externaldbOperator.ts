import Operator, { ResourceEventType } from '@dot-i/k8s-operator';
import YAML from 'yaml';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import Logger from './logger';
import { Config } from './config';
import { OperatorFrameworkProject } from './types';
import {
  ConnectionMongo,
  ConnectionMysql,
  ConnectionPostgres,
  Controller,
  ExternalMongo,
  ExternalMysql,
  ExternalPostgres
} from './controllers';

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
    this.watchController(ResourceKind.ConnectionMongo, new ConnectionMongo());
    this.watchController(ResourceKind.ConnectionMysql, new ConnectionMysql());
    this.watchController(
      ResourceKind.ConnectionPostgres,
      new ConnectionPostgres()
    );
    this.watchController(ResourceKind.ExternalMongo, new ExternalMongo());
    this.watchController(ResourceKind.ExternalMysql, new ExternalMysql());
    this.watchController(ResourceKind.ExternalPostgres, new ExternalPostgres());
  }

  protected watchController(
    resourceKind: ResourceKind,
    controller: Controller
  ) {
    this.watchResource(
      ExternaldbOperator.resource2Group(ResourceGroup.Externaldb),
      ResourceVersion.V1alpha1,
      ExternaldbOperator.kind2plural(resourceKind),
      async (e) => {
        try {
          switch (e.type) {
            case ResourceEventType.Added:
              return controller.added(e);
            case ResourceEventType.Deleted:
              return controller.deleted(e);
            case ResourceEventType.Modified:
              return controller.modified(e);
          }
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
  }

  static resource2Group(group: string) {
    return `${group}.${project.domain}`;
  }

  static kind2plural(kind: string) {
    let lowercasedKind = kind.toLowerCase();
    if (lowercasedKind[lowercasedKind.length - 1] === 's') {
      return lowercasedKind;
    }
    if (lowercasedKind[lowercasedKind.length - 1] === 'o') {
      lowercasedKind = `${lowercasedKind}e`;
    }
    return `${lowercasedKind}s`;
  }
}

export enum ResourceGroup {
  Externaldb = 'externaldb'
}

export enum ResourceKind {
  ConnectionMongo = 'ConnectionMongo',
  ConnectionMysql = 'ConnectionMysql',
  ConnectionPostgres = 'ConnectionPostgres',
  ExternalMongo = 'ExternalMongo',
  ExternalMysql = 'ExternalMysql',
  ExternalPostgres = 'ExternalPostgres'
}

export enum ResourceVersion {
  V1alpha1 = 'v1alpha1'
}
