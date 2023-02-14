import * as command from './ngvm';
import { Cmd } from '../cmd';
import * as commander from 'commander';

describe('testing cli', () => {
  it('should call global', () => {
    const spy = jest
      .spyOn(Cmd, 'printNgGlobalVersion')
      .mockImplementation(undefined);
    command.execute(new commander.Command(), ['global']);
    expect(spy).toBeCalled();
  });

  it('should call local', () => {
    const spy = jest
      .spyOn(Cmd, 'printNgLocalVersion')
      .mockImplementation(undefined);
    command.execute(new commander.Command(), ['local']);
    expect(spy).toBeCalled();
  });

  it('should call latest', () => {
    const spy = jest
      .spyOn(Cmd, 'printNgRemoteVersion')
      .mockImplementation(undefined);
    command.execute(new commander.Command(), ['latest']);
    expect(spy).toBeCalled();
  });

  it('should call all versions', () => {
    const spy = jest
      .spyOn(Cmd, 'printAllVersions')
      .mockImplementation(undefined);
    command.execute(new commander.Command(), ['versions']);
    expect(spy).toBeCalled();
  });

  it('should call inspect', () => {
    const spy = jest.spyOn(Cmd, 'printInfo').mockImplementation(undefined);
    command.execute(new commander.Command(), ['inspect']);
    expect(spy).toBeCalled();
  });

  it('should call release', () => {
    const spy = jest.spyOn(Cmd, 'remoteDetails').mockImplementation(undefined);
    command.execute(new commander.Command(), ['show']);
    expect(spy).toBeCalled();
  });

  it('should call list', () => {
    const spy = jest.spyOn(Cmd, 'list').mockImplementation(undefined);
    command.execute(new commander.Command(), ['list']);
    expect(spy).toBeCalled();
  });

  it('should call install', () => {
    const spy = jest.spyOn(Cmd, 'install').mockImplementation(undefined);
    command.execute(new commander.Command(), ['install']);
    expect(spy).toBeCalled();
  });

  it('should call uninstall', () => {
    const spy = jest.spyOn(Cmd, 'uninstall').mockImplementation(undefined);
    command.execute(new commander.Command(), ['uninstall']);
    expect(spy).toBeCalled();
  });

  it('should call new', () => {
    const spy = jest.spyOn(Cmd, 'createApp').mockImplementation(undefined);
    command.execute(new commander.Command(), ['new']);
    expect(spy).toBeCalled();
  });

  it('should call pkgmanager', () => {
    const spy = jest
      .spyOn(Cmd, 'printOrSetPkgManager')
      .mockImplementation(undefined);
    command.execute(new commander.Command(), ['pm']);
    expect(spy).toBeCalled();
  });

  it('should call podcast', () => {
    const spy = jest
      .spyOn(Cmd, 'navigateToConsulting')
      .mockImplementation(undefined);
    command.execute(new commander.Command(), ['consulting']);
    expect(spy).toBeCalled();
  });

  it('should call compat', () => {
    const spy = jest
      .spyOn(Cmd, 'navigateToCompat')
      .mockImplementation(undefined);
    command.execute(new commander.Command(), ['compat']);
    expect(spy).toBeCalled();
  });

  it('should call diff', () => {
    const spy = jest.spyOn(Cmd, 'navigateToDiff').mockImplementation(undefined);
    command.execute(new commander.Command(), ['diff']);
    expect(spy).toBeCalled();
  });
});
