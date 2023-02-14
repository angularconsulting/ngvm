import {
  BashCommand,
  BashCommandType,
  PackageJsonProperty,
  PkgManagerCmd,
  PkgManagerType,
  VersionsPair
} from './types';
import open from 'open';
import { run } from './bash';
import { accessSync, constants } from 'fs';
import chalk from 'chalk';
import { CmdBuilder } from './cmd-builder';
import {
  BLANK_SPACE,
  EMPTY_STRING,
  NGVM_ASCII,
  NOT_FOUND,
  ZERO_VERSION
} from './constants';
import { Command } from 'commander';

export function stdout(input: string): void {
  console.log(input);
}

export function getNgvmText(): string {
  return `${chalk.red(NGVM_ASCII)}`;
}

export function cmdVersionOutput(command: BashCommand): string {
  const cmd = command.args
    ? command.cmd.concat(BLANK_SPACE, command.args)
    : command.cmd;
  let version = ZERO_VERSION;
  try {
    version = run({ ...command, cmd }, false).replace(/^\D+|\n/g, EMPTY_STRING);
  } catch {}

  return version === ZERO_VERSION ? NOT_FOUND : version;
  // return version;
}

// executing version-related commands
export function versionCmd(
  type: Extract<
    BashCommandType,
    'globalVersion' | 'remoteVersion' | 'nodeVersion'
  >
): string {
  const command = CmdBuilder.prepareCommand(type);
  return cmdVersionOutput(command);
}

export function pkgManagerOutput(command: BashCommand): PkgManagerType | null {
  const cmd = command.args
    ? command.cmd.concat(BLANK_SPACE, command.args)
    : command.cmd;
  let name: PkgManagerType | null = null;
  try {
    name = run({ ...command, cmd })
      .replace(/^\n/g, EMPTY_STRING)
      .trim();
  } catch {}
  return name;
}

export function pkgManagerSetOutput(command: BashCommand): any {
  const cmd = command.args
    ? command.cmd.concat(BLANK_SPACE, command.args)
    : command.cmd;
  try {
    run({ ...command, cmd });
  } catch {}
}

export function navigate(url: string): void {
  open(`https://${url}`);
}

/**
 * Compare two semver versions. Returns true if version A is greater than
 * version B
 * @param {string} versionA
 * @param {string} versionB
 * @return {boolean}
 */
const semverGreaterThan = function (
  versionA: string,
  versionB: string
): boolean {
  const versionsA = versionA.split(/\./g);
  const versionsB = versionB.split(/\./g);
  while (versionsA.length || versionsB.length) {
    const a = Number(versionsA.shift());
    const b = Number(versionsB.shift());
    if (a == b) continue;
    return a > b || isNaN(b);
  }
  return false;
};

export function orderVersions(
  versionA: string,
  versionB: string
): VersionsPair {
  const isGreater = semverGreaterThan(versionA, versionB);

  return isGreater
    ? { smaller: versionB, greater: versionA }
    : { smaller: versionA, greater: versionB };
}

export function getPackageInfo(
  packageName: string,
  property: PackageJsonProperty,
  defaultValue = NOT_FOUND
): string {
  try {
    let packagePath = '';
    if (packageName === 'package.json') {
      packagePath = `./${packageName}`;
    } else if (packageName.startsWith('/')) {
      packagePath = `${process.cwd()}/node_modules${packageName}/package.json`;
    } else {
      packagePath = `${packageName}/package.json`;
    }

    const resolvedPath = require.resolve(packagePath, {
      paths: ['.']
    });
    defaultValue = resolveProperty(require(resolvedPath), property);
  } catch {}
  return defaultValue;
}

function resolveProperty(obj: any, path: any): any {
  if (typeof path === 'string') {
    path = path.split('.');
  }

  if (path.length === 0) {
    return obj;
  }
  return resolveProperty(obj[path[0]], path.slice(1));
}
function checkFileAccess(path: string): boolean {
  try {
    accessSync(path, constants.R_OK | constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

export function isAngularProjectExists(): boolean {
  return checkFileAccess('./angular.json');
}

export function isNodeModulesExists(): boolean {
  return checkFileAccess('./node_modules');
}

export function isYarnLockExists(): boolean {
  return checkFileAccess('./yarn.lock');
}

export function isNpmLockExists(): boolean {
  return checkFileAccess('./package-lock.json');
}

export function isPackageExists(path: string = '.'): boolean {
  return checkFileAccess(`${path}/package.json`);
}

export function getProjectTypeOrNull(): PkgManagerCmd | null {
  if (isYarnLockExists()) {
    return PkgManagerCmd.yarn;
  } else if (isNpmLockExists()) {
    return PkgManagerCmd.npm;
  }
  return null;
}

export function cmdToJson(params: readonly Command[]): string {
  return JSON.stringify(
    params.map((x: Command) => ({
      command: `${x.name()} ${
        x.alias() !== undefined ? '&#124; ' + x.alias() : EMPTY_STRING
      }`,
      description: x.description()
    }))
  );
}
