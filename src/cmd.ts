import { CmdBuilder } from './cmd-builder';
import {
  versionCmd,
  getPackageInfo,
  getProjectTypeOrNull,
  isAngularProjectExists,
  isNodeModulesExists,
  navigate,
  orderVersions,
  pkgManagerOutput,
  pkgManagerSetOutput,
  stdout
} from './util';
import { runInteractive } from './bash';
import {
  BashCommand,
  PkgManagerCmd,
  PkgManagerType,
  UrlCommand
} from './types';
import { Context } from './context';
import { OptionValues } from 'commander';
import { BLANK_SPACE, EMPTY_STRING, NOT_FOUND } from './constants';

export class Cmd {
  public static globalVersion(): string {
    const result = versionCmd('globalVersion');
    // ref: https://regexr.com/67i6g
    const regexp =
      /((([0-9]+)\.([0-9]+)\.([0-9]+)(?:-([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?)/gm;

    // @ts-ignore
    return regexp.test(result) ? result.match(regexp)[0] : NOT_FOUND;
  }
  public static printNgGlobalVersion(): void {
    const version = this.globalVersion();
    stdout(version);
  }

  public static printNgRemoteVersion(): void {
    const result = versionCmd('remoteVersion');
    stdout(result);
  }

  public static printNgLocalVersion(): void {
    const version = getPackageInfo('@angular/cli', 'version');
    stdout(version);
  }

  public static printAllVersions(): void {
    stdout(
      `Local version: ${getPackageInfo('/@angular/cli', 'version')}
Global version: ${this.globalVersion()}
Latest version: ${versionCmd('remoteVersion')}`
    );
  }

  public static printInfo(): void {
    if (!isNodeModulesExists()) {
      stdout(
        `node_modules folder not found on path ${process.cwd()}. Install Node modules.`
      );
    } else if (isAngularProjectExists()) {
      stdout(
        `Name: ${getPackageInfo('package.json', 'name')}
Path: ${process.cwd()}
Angular CLI version: ${getPackageInfo('/@angular/cli', 'version')}
Angular version: ${getPackageInfo('/@angular/core', 'version')}
Node version: ${versionCmd('nodeVersion')}
TypeScript version: ${getPackageInfo('/TypeScript', 'version')}
RxJS: ${getPackageInfo('/RxJS', 'version')}`
      );
    } else {
      stdout(`Angular project not found on path ${process.cwd()}`);
    }
  }

  public static remoteDetails(version: string): any {
    const command = CmdBuilder.prepareCommand('showDetails', [
      { $version: version }
    ]);

    return runInteractive(command, false);
  }

  public static uninstall(pkgManager?: PkgManagerCmd | null): any {
    pkgManager = this.setPkgManagerName(pkgManager);

    const command = CmdBuilder.prepareCommand('uninstall', [
      { $pkgManager: pkgManager.name },
      { $uninstall: pkgManager.uninstall }
    ]);

    return runInteractive(command, false);
  }

  public static install(
    version: string,
    pkgManager?: PkgManagerCmd | null
  ): any {
    pkgManager = this.setPkgManagerName(pkgManager);

    const command = CmdBuilder.prepareCommand('install', [
      { $pkgManager: pkgManager.name },
      { $install: pkgManager.install },
      { $version: version }
    ]);

    return runInteractive(command, false);
  }

  public static createUsingGlobalNg(version: string, args: string): any {
    Context.setGlobalOptionValue(true);
    Context.setPkgManagerName('npm'); // always use global npm to install a new version
    this.install(version);

    Context.setGlobalOptionValue(false);
    const command = CmdBuilder.prepareCommand('createWithNg', [
      { $args: args }
    ]);

    return runInteractive(command, true);
  }

  public static createUsingNpx(version: string, args: string): any {
    const command = CmdBuilder.prepareCommand('createWithNpx', [
      { $version: version },
      { $args: args }
    ]);
    return runInteractive(command, true);
  }

  public static createApp(options: OptionValues, args: string[]): void {
    let ngOrNpx = EMPTY_STRING;
    let version = 'latest';
    const arr = Object.entries(options);
    if (arr.length > 0) {
      // get first arg name: ng|npx
      ngOrNpx = arr[0][0].toLowerCase();
      // get first arg value
      version = typeof arr[0][1] === 'string' ? arr[0][1] : version;
    } else {
      stdout(`Provide 'ng' or 'npx' option`);
    }
    if (ngOrNpx == 'ng') {
      this.createUsingGlobalNg(version, args.join(BLANK_SPACE));
    } else if (ngOrNpx == 'npx') {
      this.createUsingNpx(version, args.join(BLANK_SPACE));
    }
  }

  public static list(): any {
    const command = CmdBuilder.prepareCommand('listAll');
    return runInteractive(command, true);
  }

  public static navigateToConsulting(): void {
    const command = UrlCommand.consulting;
    navigate(command.location);
  }

  public static navigateToCompat(): void {
    const command = UrlCommand.compat;
    navigate(command.location);
  }

  public static navigateToDiff(v1: string, v2: string): void {
    const command = UrlCommand.diff;

    // if '-g' provided check global version otherwise local
    if (!v1) {
      if (Context.getGlobalActionValue()) {
        // 'ng --version -g' won't return the right result so had to omit the '-g' flag here
        Context.setGlobalOptionValue(false);
        v1 = this.globalVersion();
        if (v1 === NOT_FOUND) {
          stdout('Global version not found');
          process.exit();
        }
      } else {
        v1 = getPackageInfo('@angular/cli', 'version');
        if (v1 === NOT_FOUND) {
          stdout('Local version not found');
          process.exit();
        }
      }
    }
    // if v2 not provided use latest NPM version
    if (!v2) {
      v2 = versionCmd('remoteVersion');
    }
    const versions = orderVersions(v1, v2);
    command.location = CmdBuilder.replaceArgs(command.location, [
      { $current: versions.smaller },
      { $target: versions.greater }
    ]);
    navigate(command.location);
  }

  static printPkgManager(): void {
    const pkgManager = this.getPkgManagerOrNull(null);
    stdout(pkgManager ? pkgManager.name : NOT_FOUND);
  }

  static setPkgManagerName(pkgManager?: PkgManagerCmd | null): PkgManagerCmd {
    if (!pkgManager) {
      if (Context.getGlobalActionValue()) {
        pkgManager = PkgManagerCmd.npm;
      } else {
        pkgManager = getProjectTypeOrNull();
      }
    }

    if (!pkgManager) {
      pkgManager = PkgManagerCmd.npm;
    }

    Context.setPkgManagerName(pkgManager.name);

    return pkgManager;
  }

  public static getPkgManagerOrNull(
    defaultPkgManager: PkgManagerType | null
  ): PkgManagerCmd | null {
    const command = {
      ...CmdBuilder.prepareCommand('configPkg', [{ $args: EMPTY_STRING }])
    };
    let pkgManager = pkgManagerOutput(command);

    if (!pkgManager) {
      pkgManager = defaultPkgManager;
    }

    if (pkgManager) {
      Context.setPkgManagerName(pkgManager);
      return PkgManagerCmd[pkgManager];
    } else {
      return null;
    }
  }

  public static setPkgManager(command: BashCommand): void {
    pkgManagerSetOutput(command);
    this.printPkgManager();
  }

  public static printOrSetPkgManager(name: string): void {
    let command;
    if (name) {
      command = CmdBuilder.prepareCommand('configPkg', [{ $args: name }]);
      this.setPkgManager(command);
    } else {
      this.printPkgManager();
    }
  }
}
