import YAML from 'yaml';
import fs from 'fs-extra';
import path from 'path';
import { OperatorFrameworkProject } from './types';

export const project: OperatorFrameworkProject = YAML.parse(
  fs.readFileSync(path.resolve(__dirname, '../PROJECT')).toString()
);

export function kind2plural(kind: string) {
  let lowercasedKind = kind.toLowerCase();
  if (lowercasedKind[lowercasedKind.length - 1] === 's') {
    return lowercasedKind;
  }
  if (lowercasedKind[lowercasedKind.length - 1] === 'o') {
    lowercasedKind = `${lowercasedKind}e`;
  }
  return `${lowercasedKind}s`;
}

export function getGroupName(groupNamePrefix: string) {
  return `${groupNamePrefix}.${project.domain}`;
}
