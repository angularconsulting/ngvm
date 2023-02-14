#!/usr/bin/env node
import { Option } from 'commander';
import * as commander from 'commander';
import { version } from '../../package.json';
import { Cmd } from '../cmd';
import { getNgvmText, cmdToJson, stdout } from '../util';
import { Context } from '../context';
import { EMPTY_OBJ } from '../constants';

export type Command = commander.Command;
export function makeProgram(
  program: Command,
  options?: { exitOverride?: boolean; suppressOutput?: boolean }
): Command {
  // Configuration
  if (options?.exitOverride) {
    program.exitOverride();
  }
  if (options?.suppressOutput) {
    program.configureOutput({
      writeOut: () => EMPTY_OBJ,
      writeErr: () => EMPTY_OBJ
    });
  }

  program
    .command('install [version]')
    .alias('i')
    .option('-g, --global', 'Install globally')
    .description(
      'Install a specific version of Angular CLI. By default it will install the latest version'
    )
    .action(version => {
      version = version || 'latest';
      Cmd.install(version);
    });

  program
    .command('uninstall')
    .alias('u')
    .option('-g, --global', 'Uninstall global')
    .description('Uninstall the global or local Angular CLI')
    .action(() => {
      Cmd.uninstall();
    });

  program
    .command('new')
    .alias('n')
    .option('-ng [version]', 'Use global Angular CLI')
    .option('-npx [version]', 'Use NPX')
    .allowUnknownOption(true)
    .description(
      'Create a new Angular application. You can use the global Angular CLI or NPX. You can specify any existing Angular CLI version'
    )
    .action((options, cmd) => {
      Cmd.createApp(cmd.opts(), cmd.args);
    });

  program
    .command('latest')
    .description('Print out the latest Angular CLI version available on NPM')
    .action(() => {
      Cmd.printNgRemoteVersion();
    });

  program
    .command('global')
    .description('Print out the global Angular CLI version')
    .action(() => {
      Cmd.printNgGlobalVersion();
    });

  program
    .command('local')
    .description('Print out the local Angular CLI version')
    .action(() => {
      Cmd.printNgLocalVersion();
    });

  program
    .command('versions')
    .alias('vs')
    .description('Print out the global, local and latest Angular CLI versions')
    .action(() => {
      Cmd.printAllVersions();
    });

  program
    .command('inspect')
    .description(
      'Print out Angular CLI, Angular, NodeJS, TypeScript, RxJS versions and more info about current working directory'
    )
    .action(() => {
      Cmd.printInfo();
    });

  program
    .command('list')
    .alias('ls')
    .description('List of all Angular CLI releases available on NPM')
    .action(name => {
      Cmd.list();
    });

  program
    .command('show [version]')
    .description(
      'Check information about a particular Angular CLI version released on NPM. By default, the latest version is shown'
    )
    .action(version => {
      version = version || 'latest';
      Cmd.remoteDetails(version);
    });

  program
    .command('pkgmgr [name]')
    .alias('pm')
    .option('-g, --global', 'Package manager global settings')
    .description(
      'Print out or set local or global Angular CLI default package manager'
    )
    .action(name => {
      Cmd.printOrSetPkgManager(name);
    });

  program
    .command('compat')
    .description(
      'Navigate to the Angular CLI, Angular, NodeJs, TypeScript, RxJS compatibility list'
    )
    .action(name => {
      Cmd.navigateToCompat();
    });

  program
    .command('diff [v1] [v2]')
    .option('-g, --global', 'Use global version')
    .description(
      'Compare the difference between Angular CLI versions. You can specify any existing versions. By default local version will be diffed with the latest'
    )
    .action((v1, v2) => {
      Cmd.navigateToDiff(v1, v2);
    });

  program
    .command('consulting')
    .description(
      'Everything about Angular. High level of expertise, engineering and training.'
    )
    .action(name => {
      Cmd.navigateToConsulting();
    });

  program
    .addOption(
      new Option('--debug', 'display trace information for commands').hideHelp()
    )
    .hook('preAction', (thisCommand, actionCommand) => {
      // store command, action and params
      Context.setParams(thisCommand, actionCommand, program);

      if (thisCommand.opts().debug) {
        console.debug(`>>>>>\n\rcommand: '${thisCommand.name()}'`);
        console.debug('arguments: %O', thisCommand.args);
        console.debug('options: %o', thisCommand.opts());
        console.debug(`<<<<<\n\raction: '${actionCommand.name()}'`);
        console.debug('arguments: %O', actionCommand.args);
        console.debug('options: %o', actionCommand.opts());
      }
    });

  // ref: https://github.com/tj/commander.js/issues/1559
  program
    .version(version, '-v, --version')
    .addOption(new Option('-v').hideHelp());
  program.on('option:v', () => {
    stdout(version);
    process.exit();
  });

  program.addHelpText('before', getNgvmText()).addHelpText(
    'after',
    `
  Examples:
    $ ngvm new my-app --routing --style=scss -npx  
    $ ngvm new my-app --routing --style=scss -ng 15.0.0  
    $ ngvm show 15.0.0    
    $ ngvm pm yarn  
    $ ngvm diff 14.0.0 15.0.0    
    $ ngvm install -g  `
  );

  if (process.env.NODE_ENV === 'dev') {
    program.addOption(new Option('-c2j, --cmdToJson').hideHelp());
    program.on('option:cmdToJson', () => {
      stdout(cmdToJson(program.commands));
      process.exit();
    });
  }

  return program;
}
if (
  process.env.JEST_WORKER_ID === undefined ||
  process.env.NODE_ENV !== 'test'
) {
  makeProgram(new commander.Command(), {
    exitOverride: false,
    suppressOutput: false
  }).parse(process.argv);
}

export function execute(
  program: Command,
  args: string[],
  opts?: { suppressOutput?: boolean }
): void {
  makeProgram(program, {
    exitOverride: true,
    suppressOutput: opts?.suppressOutput
  }).parse(args, { from: 'user' });
}
