import { isPackageExists } from './util';
import * as fs from 'fs';
import path from 'path';

// add additional files
fs.copyFileSync('README.md', 'dist/README.md');

// cleanup dist package.json
const propertiesToDelete: string[] = [
  'lint-staged',
  'commitlint',
  'config',
  'scripts',
  'devDependencies'
];

if (isPackageExists('dist')) {
  const packageJson = require('../dist/package.json');

  propertiesToDelete.forEach(property => {
    delete packageJson[property];
  });

  try {
    fs.writeFileSync('dist/package.json', JSON.stringify(packageJson, null, 2));
  } catch {
    console.log('error');
  }
}

// cleanup dist folder content
const paths = ['dist/src', 'dist/src/bin'];
const filesToDelete = paths.reduce((acc, dir) => {
  try {
    const dirContent = fs.readdirSync(dir);
    acc = acc.concat(
      dirContent
        .filter(file => file.match(/.*\.(js.map|d.ts)$/gi))
        .map(file => path.join(dir, file))
    );
  } catch (err) {
    console.error(err);
  }
  return acc;
}, [] as string[]);

filesToDelete.push('dist/src/_post_build.js');
filesToDelete.push('dist/src/bin/ngvm.test.js');

filesToDelete.forEach(file => {
  try {
    fs.unlinkSync(file);
  } catch {}
});

const pathsToDelete: string[] = ['dist/src/__mocks__'];

pathsToDelete.forEach(path => {
  fs.rmSync(path, { recursive: true, force: true });
});
