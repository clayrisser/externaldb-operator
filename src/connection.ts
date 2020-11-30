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

import { HashMap } from './types';

export default class Connection {
  private static URL_REGEX = /^([^:@\/,?]+):\/\/([^:@\/,?]+:?([^:@\/,?]+)?@)?((,?[^:@\/,?]+(:\d+)?)+)(\/[^:@\/,?]+)?(\?[^:@\/,?]+)?$/g;

  hosts: Hosts = {};

  options?: Options;

  hostname: string;

  port?: number;

  database: string;

  username?: string;

  password?: string;

  protocol: string | Protocol;

  constructor(url: string | ConnectionConfig) {
    let database: string | undefined;
    let hostname: string | undefined;
    let hosts: Hosts | undefined;
    let options: Options | undefined;
    let password: string | undefined;
    let port: number | undefined;
    let protocol: string | Protocol | undefined;
    let username: string | undefined;
    if (typeof url === 'string') {
      url = url.replace(/\s/g, '');
      const matches = [...(url.matchAll(Connection.URL_REGEX) || [])];
      if (!matches.length) throw new Error('invalid url string');
      const [
        ,
        protocolSegment,
        authSegment,
        ,
        hostsSegment,
        ,
        ,
        databaseSegment,
        optionsSegment
      ] = matches[0] as string[];
      protocol = protocolSegment;
      [username, password] = (authSegment || '')
        .slice(0, (authSegment?.length || 0) - 1)
        .split(':');
      hosts = hostsSegment
        .split(',')
        .reduce((hosts: Hosts, hostSegment: string) => {
          const [hostname, portStr] = hostSegment.split(':');
          const port = parseInt(portStr);
          hosts[hostname] = isNaN(port) ? null : port;
          return hosts;
        }, {});
      database = databaseSegment.slice(1);
      options = optionsSegment
        .slice(1)
        .split('&')
        .reduce((options: Options, optionSegment: string) => {
          const [key, value] = optionSegment.split('=');
          options[key] = value;
          return options;
        }, {});
    } else {
      ({
        database,
        hostname,
        hosts,
        options,
        password,
        port,
        protocol,
        username
      } = url);
    }
    if (!protocol) throw new Error('protocol must be set');
    if (!database) throw new Error('database must be set');
    this.database = decodeURIComponent(database);
    this.protocol = protocol;
    if (password) {
      this.password = decodeURIComponent(password);
      if (!username) {
        throw new Error('username must be set if password is set');
      }
      this.username = decodeURIComponent(username);
    }
    if (hosts) {
      this.hosts = Object.entries(hosts).reduce(
        (hosts: Hosts, [hostname, port]: [string, Port]) => {
          hosts[decodeURIComponent(hostname)] = port;
          return hosts;
        },
        {}
      );
    } else {
      if (!hostname) throw new Error('hostname or hosts must be set');
      this.hosts[hostname] = typeof port === 'number' ? port : null;
    }
    if (options) {
      this.options = Object.entries(options).reduce(
        (options: Options, [key, value]: [string, any]) => {
          options[decodeURIComponent(key)] = value;
          return options;
        },
        {}
      );
    }
    this.hostname = Object.keys(this.hosts)[0];
    port = this.hosts[this.hostname] as number;
    if (typeof port === 'number') this.port = port;
  }

  protected getAuth(): string {
    if (!this.username) return '';
    return `${encodeURIComponent(this.username)}:${encodeURIComponent(
      this.password || ''
    )}@`;
  }

  protected getDelimitedHosts(delimiter = ','): string {
    return Object.entries(this.hosts)
      .map(
        ([hostname, port]: [string, Port]) =>
          `${encodeURIComponent(hostname)}${
            typeof port === 'number' ? `:${port.toString()}` : ''
          }`
      )
      .join(delimiter);
  }

  protected getDelimitedOptions(delimiter = '&'): string {
    if (!this.options) return '';
    return `?${Object.entries(this.options)
      .map(
        ([key, value]: [string, any]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      )
      .join(delimiter)}`;
  }

  get url() {
    return `${this.protocol}://${this.getAuth()}${this.getDelimitedHosts()}/${
      this.database
    }${this.getDelimitedOptions()}`;
  }
}

export interface ConnectionConfig {
  database?: string;
  hostname?: string;
  hosts?: Hosts;
  options?: Options;
  password?: string;
  port?: number;
  protocol?: string | Protocol;
  username?: string;
}

export type Hosts = HashMap<Port>;

export type Options = HashMap<any>;

export type Port = number | null;

export enum Protocol {
  Mysql = 'mysql',
  Postgres = 'psql',
  MongoDB = 'mongodb'
}
