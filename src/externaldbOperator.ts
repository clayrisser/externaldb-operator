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

import Operator, { ResourceEventType } from '@dot-i/k8s-operator';
import ora from 'ora';
import Logger from './logger';
import ResourceTracker from './resourceTracker';
import { Config } from './config';
import { getGroupName, kind2plural } from './util';
import {
  ConnectionMongo,
  ConnectionMysql,
  ConnectionPostgres,
  Controller,
  ExternalMongo,
  ExternalMysql,
  ExternalPostgres
} from './controllers';

const logger = console;

export default class ExternaldbOperator extends Operator {
  static labelNamespace = 'dev.siliconhills.helm2cattle';

  spinner = ora();

  resourceTracker = new ResourceTracker();

  constructor(protected config: Config, protected log = new Logger()) {
    super(log);
  }

  protected async init() {
    this.watchController(
      ResourceKind.ConnectionMongo,
      new ConnectionMongo(
        ResourceGroup.Externaldb,
        ResourceKind.ConnectionMongo
      )
    );
    this.watchController(
      ResourceKind.ConnectionMysql,
      new ConnectionMysql(
        ResourceGroup.Externaldb,
        ResourceKind.ConnectionMysql
      )
    );
    this.watchController(
      ResourceKind.ConnectionPostgres,
      new ConnectionPostgres(
        ResourceGroup.Externaldb,
        ResourceKind.ConnectionPostgres
      )
    );
    this.watchController(
      ResourceKind.ExternalMongo,
      new ExternalMongo(ResourceGroup.Externaldb, ResourceKind.ExternalMongo)
    );
    this.watchController(
      ResourceKind.ExternalMysql,
      new ExternalMysql(ResourceGroup.Externaldb, ResourceKind.ExternalMysql)
    );
    this.watchController(
      ResourceKind.ExternalPostgres,
      new ExternalPostgres(
        ResourceGroup.Externaldb,
        ResourceKind.ExternalPostgres
      )
    );
  }

  protected watchController(
    resourceKind: ResourceKind,
    controller: Controller
  ) {
    this.watchResource(
      getGroupName(ResourceGroup.Externaldb),
      ResourceVersion.V1alpha1,
      kind2plural(resourceKind),
      async (e) => {
        // spawn as non blocking process
        (async () => {
          const {
            oldResource,
            newResource
          } = this.resourceTracker.rotateResource(e.object);
          try {
            switch (e.type) {
              case ResourceEventType.Added:
                await controller.added(newResource, e.meta, oldResource);
                await controller.addedOrModified(
                  newResource,
                  e.meta,
                  oldResource
                );
                return;
              case ResourceEventType.Deleted:
                this.resourceTracker.resetResource(e.object);
                await controller.deleted(newResource, e.meta, oldResource);
                return;
              case ResourceEventType.Modified:
                await controller.modified(newResource, e.meta, oldResource);
                await controller.addedOrModified(
                  newResource,
                  e.meta,
                  oldResource
                );
                return;
            }
          } catch (err) {
            this.spinner.fail(
              [
                err.message || '',
                err.body?.message || err.response?.body?.message || ''
              ].join(': ')
            );
            if (this.config.debug) this.log.error(err);
          }
        })().catch(logger.error);
      }
    ).catch(logger.error);
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

export enum KustomizeResourceGroup {
  Kustomize = 'kustomize'
}

export enum KustomizeResourceKind {
  Kustomization = 'Kustomization'
}

export enum KustomizeResourceVersion {
  V1alpha1 = 'v1alpha1'
}
