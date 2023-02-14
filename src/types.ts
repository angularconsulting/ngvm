import { Command } from 'commander';

export interface BashCommand {
  cmd: string;
  args?: string;
  options?: any;
}

export const BashCommandType = [
  'globalVersion',
  'remoteVersion', // version on npm
  'showDetails',
  'listAll', // list
  'nodeVersion',
  'uninstall',
  'install',
  'createWithNg',
  'createWithNpx',
  'configPkg'
] as const;

export type BashCommandType = (typeof BashCommandType)[number];

export const BashCommands: Record<BashCommandType, BashCommand> = {
  globalVersion: {
    cmd: `ng version`, // the result of this command parsed with regex
    options: { cwd: '/', stdio: 'pipe' }
  },
  remoteVersion: {
    cmd: `npm`,
    args: `show @angular/cli version`,
    options: { stdio: 'pipe' }
  },
  showDetails: {
    cmd: 'npm',
    args: `show @angular/cli@$version`,
    options: { stdio: 'inherit' }
  },
  listAll: {
    cmd: 'npm',
    args: `show @angular/cli time`,
    options: { stdio: 'inherit' }
  },
  nodeVersion: {
    cmd: 'node',
    args: '--version',
    options: { stdio: 'pipe' }
  },
  uninstall: {
    cmd: '$pkgManager',
    args: '$uninstall @angular/cli',
    options: { stdio: 'inherit' }
  },
  install: {
    cmd: '$pkgManager',
    args: '$install @angular/cli@$version',
    options: { stdio: 'inherit' }
  },
  createWithNg: {
    cmd: 'ng',
    args: 'new $args',
    options: { stdio: 'inherit' }
  },
  createWithNpx: {
    cmd: 'npx',
    args: '@angular/cli@$version new $args',
    options: { stdio: 'inherit' }
  },
  configPkg: {
    cmd: 'ng config cli.packageManager $args',
    options: { stdio: 'pipe' }
  }
};
export interface PkgManagerCmd {
  name: PkgManagerType;
  install: string;
  uninstall: string;
  global?: string;
}

export const PkgManagerType = ['npm', 'yarn'] as const;
export type PkgManagerType = (typeof PkgManagerType)[number];

export const PkgManagerCmd: Record<PkgManagerType, PkgManagerCmd> = {
  npm: {
    name: 'npm',
    install: 'install',
    uninstall: 'uninstall',
    global: '-g'
  },
  yarn: {
    name: 'yarn',
    install: 'add',
    uninstall: 'remove',
    global: 'global'
  }
};

export interface UrlInfo {
  location: string;
}
export const UrlType = ['consulting', 'diff', 'compat'] as const;
export type UrlType = (typeof UrlType)[number];

export const UrlCommand: Record<UrlType, UrlInfo> = {
  consulting: {
    location: 'angularconsulting.au/services'
  },
  compat: {
    location: 'stackoverflow.com/a/60258560/415078'
  },
  diff: {
    location:
      'github.com/cexbrayat/angular-cli-diff/compare/$current...$target#files_bucket'
  }
};

export interface Params {
  command?: Command | any;
  action?: Command | any;
  program?: Command | any;
}

export const PackageJsonProperty = ['version', 'name'] as const;
export type PackageJsonProperty = (typeof PackageJsonProperty)[number];

export interface VersionsPair {
  smaller: string;
  greater: string;
}
