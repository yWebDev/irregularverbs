"use strict";

const fs = require("fs");
const path = require("path");
const { fileURLToPath } = require("url");

/**
 * @param {string | undefined} filename
 * @returns {string}
 */
function toFsPath(filename) {
  if (!filename) {
    return "";
  }
  if (filename.startsWith("file:")) {
    try {
      return fileURLToPath(filename);
    } catch {
      return filename;
    }
  }
  return path.normalize(filename);
}

/**
 * @param {string} [prefix]
 * @param {string} key
 */
function keyPath(prefix, key) {
  return prefix ? `${prefix}.${key}` : key;
}

/**
 * @param {unknown} value
 * @returns {boolean}
 */
function isPlainObject(value) {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value)
  );
}

/**
 * @param {unknown} value
 * @returns {string}
 */
function typeLabel(value) {
  if (value === null) {
    return "null";
  }
  if (Array.isArray(value)) {
    return "array";
  }
  return typeof value;
}

/**
 * Compare nested object keys to baseline; all leaves are allowed to differ in value.
 * @param {unknown} base
 * @param {unknown} other
 * @param {string} prefix
 * @returns {string[]}
 */
function structuralDiff(base, other, prefix) {
  /** @type {string[]} */
  const issues = [];

  if (isPlainObject(base)) {
    if (!isPlainObject(other)) {
      issues.push(
        `Expected object at "${prefix || "(root)"}" but got ${typeLabel(other)}.`,
      );
      return issues;
    }

    const b = /** @type {Record<string, unknown>} */ (base);
    const o = /** @type {Record<string, unknown>} */ (other);

    for (const k of Object.keys(b)) {
      if (!Object.prototype.hasOwnProperty.call(o, k)) {
        issues.push(
          `Missing key "${keyPath(prefix, k)}" (present in baseline locale).`,
        );
        continue;
      }
      issues.push(...structuralDiff(b[k], o[k], keyPath(prefix, k)));
    }

    for (const k of Object.keys(o)) {
      if (!Object.prototype.hasOwnProperty.call(b, k)) {
        issues.push(
          `Extra key "${keyPath(prefix, k)}" (not in baseline locale).`,
        );
      }
    }

    return issues;
  }

  if (isPlainObject(other)) {
    issues.push(
      `Expected leaf value at "${prefix || "(root)"}" but got object.`,
    );
  }

  return issues;
}

/** @type {import("eslint").Rule.RuleModule} */
const localeStructureRule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Require ngx-translate locale JSON files to share the same key structure as the baseline file",
    },
    schema: [
      {
        type: "object",
        properties: {
          baseline: {
            type: "string",
            description: "Baseline filename inside the same folder (e.g. en.json)",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      mismatch: "{{message}}",
      baselineRead:
        "Could not read baseline locale file {{baseline}}: {{detail}}",
    },
  },

  create(context) {
    const options = context.options[0] || {};
    const baselineName =
      typeof options.baseline === "string" && options.baseline.length > 0
        ? options.baseline
        : "en.json";

    return {
      "Document:exit"() {
        const filePath = toFsPath(
          context.physicalFilename ?? context.filename,
        );
        const basename = path.basename(filePath);
        const dir = path.dirname(filePath);

        if (basename === baselineName) {
          return;
        }

        const basePath = path.join(dir, baselineName);
        let baseText;
        try {
          baseText = fs.readFileSync(basePath, "utf8");
        } catch (err) {
          const detail =
            err instanceof Error ? err.message : String(err);
          context.report({
            loc: { line: 1, column: 0 },
            messageId: "baselineRead",
            data: { baseline: baselineName, detail },
          });
          return;
        }

        let baseJson;
        try {
          baseJson = JSON.parse(baseText);
        } catch (err) {
          const detail =
            err instanceof Error ? err.message : String(err);
          context.report({
            loc: { line: 1, column: 0 },
            messageId: "baselineRead",
            data: { baseline: baselineName, detail },
          });
          return;
        }

        let currentJson;
        try {
          currentJson = JSON.parse(context.sourceCode.text);
        } catch {
          return;
        }

        const diffs = structuralDiff(baseJson, currentJson, "");
        for (const message of diffs) {
          context.report({
            loc: { line: 1, column: 0 },
            messageId: "mismatch",
            data: { message },
          });
        }
      },
    };
  },
};

module.exports = {
  rules: {
    "locale-structure": localeStructureRule,
  },
};
