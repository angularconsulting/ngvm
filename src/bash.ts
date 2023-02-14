import { BashCommand, PkgManagerCmd } from './types';
import { stdout } from './util';
import { Context } from './context';
import { BLANK_SPACE, EMPTY_STRING } from './constants';

export const run = (command: BashCommand, handleError = false): any => {
  const global = Context.getGlobalActionValue()
    ? PkgManagerCmd[Context.getPkgManagerName()].global
    : EMPTY_STRING;
  if (global) {
    command.cmd = `${command.cmd} ${global}`;
  }
  if (Context.getDebugCommandValue() || handleError) {
    try {
      return require('child_process')
        .execSync(command.cmd, command.options)
        .toString('utf8')
        .trim();
    } catch (error: any) {
      stdout(error.message);
      process.exit();
    }
  } else {
    return require('child_process')
      .execSync(command.cmd, command.options)
      .toString('utf8')
      .trim();
  }
};

export const runInteractive = (
  command: BashCommand,
  handleError = false
): any => {
  const global = Context.getGlobalActionValue()
    ? PkgManagerCmd[Context.getPkgManagerName()].global
    : EMPTY_STRING;
  const args = global
    ? [...command.args!.split(BLANK_SPACE), global]
    : [...command.args!.split(BLANK_SPACE)];
  if (Context.getDebugCommandValue() || handleError) {
    try {
      return require('child_process').spawnSync(
        command.cmd,
        args,
        command.options
      );
    } catch (error: any) {
      stdout(error.message);
      process.exit();
    }
  } else {
    return require('child_process').spawnSync(
      command.cmd,
      args,
      command.options
    );
  }
};
