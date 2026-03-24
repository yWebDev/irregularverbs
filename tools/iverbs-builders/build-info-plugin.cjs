'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

/**
 * Replaces src/app/build-info.ts at bundle time with package version, ISO build time,
 * and short git SHA (or "unknown" outside a git tree).
 * @param {string} workspaceRoot
 * @returns {import('esbuild').Plugin}
 */
function createBuildInfoPlugin(workspaceRoot) {
  const expected = path.normalize(path.join(workspaceRoot, 'src', 'app', 'build-info.ts'));

  return {
    name: 'iverbs-build-info',
    setup(build) {
      build.onLoad({ filter: /build-info\.ts$/ }, (args) => {
        if (path.normalize(args.path) !== expected) {
          return null;
        }

        const pkgPath = path.join(workspaceRoot, 'package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        let gitCommit = 'unknown';
        try {
          gitCommit = execSync('git rev-parse --short HEAD', {
            cwd: workspaceRoot,
            encoding: 'utf8',
          }).trim();
        } catch {
          // not a git checkout or git missing
        }

        const contents = `// Generated at build time by tools/iverbs-builders/build-info-plugin.cjs
export const PACKAGE_VERSION = ${JSON.stringify(pkg.version)};
export const BUILD_TIME_ISO = ${JSON.stringify(new Date().toISOString())};
export const GIT_COMMIT = ${JSON.stringify(gitCommit)};
`;

        return { contents, loader: 'ts' };
      });
    },
  };
}

module.exports = { createBuildInfoPlugin };
