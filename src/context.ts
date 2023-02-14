import { Params, PkgManagerType } from './types';
import { stdout } from './util';
import { Command } from 'commander';
import { EMPTY_OBJ, EMPTY_STRING } from './constants';

export class Context {
  public static params: Params = EMPTY_OBJ;
  public static pkgManagerName: PkgManagerType = 'npm';

  static setParams(command: Command, action: Command, program: Command): void {
    this.params = {
      command,
      action,
      program
    };
  }

  static getParams(): Params | void {
    if (Object.entries(this.params).length !== 0) {
      return this.params;
    } else {
      stdout('Params are empty');
    }
  }

  static getPkgManagerName(): PkgManagerType {
    return this.pkgManagerName;
  }

  static setPkgManagerName(name: PkgManagerType | typeof EMPTY_STRING): void {
    this.pkgManagerName = name === EMPTY_STRING ? 'npm' : name;
  }

  static setGlobalOptionValue(isGlobal: boolean): void {
    Context.getParams()!.action.setOptionValue('global', isGlobal);
  }

  static getGlobalActionValue(): boolean {
    return Context.getParams()!.action.opts().global;
  }

  static getDebugCommandValue(): boolean {
    return Context.getParams()!.command.opts().debug;
  }
}
