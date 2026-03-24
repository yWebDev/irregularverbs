'use strict';

const path = require('node:path');
const { createBuilder } = require('@angular-devkit/architect');
const { createBuildInfoPlugin } = require('./build-info-plugin.cjs');

const workspaceRoot = path.join(__dirname, '..', '..');
const angularBuildEntry = path.join(
  workspaceRoot,
  'node_modules',
  '@angular-devkit',
  'build-angular',
  'node_modules',
  '@angular',
  'build',
  'src',
  'index.js',
);
const { buildApplication } = require(angularBuildEntry);

/**
 * @param {import('@angular-devkit/architect/src/api').BuilderHandlerFn<string>} options
 * @param {import('@angular-devkit/architect').BuilderContext} context
 */
async function* run(options, context) {
  const plugin = createBuildInfoPlugin(context.workspaceRoot);
  yield* buildApplication(options, context, { codePlugins: [plugin] });
}

exports.default = createBuilder(run);
