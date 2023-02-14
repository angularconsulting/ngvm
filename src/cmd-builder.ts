import { logCmdInput, logCmdOutput } from './decorators';

import { BashCommand, BashCommands, BashCommandType } from './types';

export class CmdBuilder {
  @logCmdInput()
  static getCommand(type: BashCommandType): BashCommand {
    return BashCommands[type];
  }
  @logCmdOutput()
  static prepareCommand(
    type: BashCommandType,
    replace?: { [key: string]: string }[]
  ): BashCommand {
    const command = this.getCommand(type);
    if (replace && command.args) {
      return {
        ...command,
        cmd: this.replaceArgs(command.cmd, replace),
        args: this.replaceArgs(command.args, replace)
      };
    } else if (replace && !command.args) {
      return {
        ...command,
        cmd: this.replaceArgs(command.cmd, replace)
      };
    } else {
      return { ...command };
    }
  }

  static replaceArgs(
    text: string,
    replace: { [key: string]: string }[]
  ): string {
    replace.forEach(pattern => {
      for (const [key, value] of Object.entries(pattern)) {
        text = text.replace(key, value);
      }
    });

    return text.trim(); // remove last blank_space if "$args: ''"
  }
}
