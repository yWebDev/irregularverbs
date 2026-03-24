'use strict';

const {
  apply,
  applyTemplates,
  chain,
  mergeWith,
  move,
  url,
  strings,
} = require('@angular-devkit/schematics');
const { parseName } = require('@schematics/angular/utility/parse-name');
const {
  validateHtmlSelector,
  validateClassName,
} = require('@schematics/angular/utility/validation');

function buildSelector(name, prefix) {
  const base = strings.dasherize(name);
  return `${prefix}-${base}`;
}

function verbComponent(options) {
  return () => {
    const path = options.path || 'src/app/components';
    const prefix = options.prefix ?? 'app-iv';
    const parsed = parseName(path, options.name);
    const selector = buildSelector(parsed.name, prefix);
    validateHtmlSelector(selector);
    const className = `${strings.classify(parsed.name)}Component`;
    validateClassName(className);

    const templateSource = apply(url('./files'), [
      applyTemplates({
        ...strings,
        ...options,
        name: parsed.name,
        prefix,
        selector,
      }),
      move(parsed.path),
    ]);

    return chain([mergeWith(templateSource)]);
  };
}

module.exports = { verbComponent };
