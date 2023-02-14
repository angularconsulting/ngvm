// use -d flag to see the log

import { Context } from './context';
import { PkgManagerCmd } from './types';
import { BLANK_SPACE } from './constants';

export function logCmdInput() {
  return function (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ): any {
    const original = descriptor.value;
    descriptor.value = function (...args: any): any {
      const result = original.call(this, ...args);
      if (Context.getDebugCommandValue()) {
        console.debug(`\n\rDEBUG: BashCommand input`);
        console.debug(
          JSON.stringify(
            {
              name: args,
              input: result
            },
            null,
            2
          )
        );
      }
      return result;
    };
  };
}

export function logCmdOutput() {
  return function (
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
  ): any {
    const original = descriptor.value;
    descriptor.value = function (...args: any): any {
      const result = original.call(this, ...args);

      const cmd = result.args
        ? result.cmd.concat(BLANK_SPACE, result.args)
        : result.cmd;

      if (Context.getDebugCommandValue()) {
        console.debug(`\n\rDEBUG: BashCommand output`);

        console.debug(
          JSON.stringify(
            {
              output: result,
              bash: cmd,
              global: Context.getGlobalActionValue()
                ? PkgManagerCmd[Context.getPkgManagerName()].global
                : false
            },
            null,
            2
          )
        );
      }

      return result;
    };
  };
}
