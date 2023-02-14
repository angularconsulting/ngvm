'use strict';
const chalk = jest.genMockFromModule<any>('chalk');

chalk.red = jest.fn();

module.exports = chalk;
