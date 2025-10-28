#!/usr/bin/env node

/**
 * Marketplace Validation Script
 *
 * Validates the marketplace.json file against the schema and checks for:
 * - JSON schema compliance
 * - Duplicate plugin names
 * - Valid source paths for relative references
 * - Required fields presence
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Configuration
const MARKETPLACE_PATH = path.join(__dirname, '..', '.claude-plugin', 'marketplace.json');
const SCHEMA_PATH = path.join(__dirname, '..', 'schemas', 'marketplace-schema.json');
const PLUGINS_DIR = path.join(__dirname, '..', 'plugins');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message) {
  log(`✗ ${message}`, 'red');
}

function success(message) {
  log(`✓ ${message}`, 'green');
}

function warning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function info(message) {
  log(`ℹ ${message}`, 'blue');
}

// Load JSON file with error handling
function loadJSON(filePath, description) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    if (err.code === 'ENOENT') {
      error(`${description} not found at: ${filePath}`);
    } else if (err instanceof SyntaxError) {
      error(`${description} contains invalid JSON: ${err.message}`);
    } else {
      error(`Failed to load ${description}: ${err.message}`);
    }
    return null;
  }
}

// Validate against JSON schema
function validateSchema(data, schema, description) {
  const ajv = new Ajv({ allErrors: true, verbose: true });
  addFormats(ajv);

  const validate = ajv.compile(schema);
  const valid = validate(data);

  if (!valid) {
    error(`${description} schema validation failed:`);
    validate.errors.forEach(err => {
      const path = err.instancePath || 'root';
      error(`  ${path}: ${err.message}`);
      if (err.params) {
        error(`    ${JSON.stringify(err.params)}`);
      }
    });
    return false;
  }

  success(`${description} schema validation passed`);
  return true;
}

// Check for duplicate plugin names
function checkDuplicateNames(plugins) {
  const names = new Map();
  let hasDuplicates = false;

  plugins.forEach((plugin, index) => {
    const name = plugin.name;
    if (names.has(name)) {
      error(`Duplicate plugin name "${name}" found at indices ${names.get(name)} and ${index}`);
      hasDuplicates = true;
    } else {
      names.set(name, index);
    }
  });

  if (!hasDuplicates) {
    success(`No duplicate plugin names found (${plugins.length} plugins)`);
  }

  return !hasDuplicates;
}

// Validate source paths for relative references
function validateSourcePaths(plugins) {
  let allValid = true;

  plugins.forEach((plugin, index) => {
    const { name, source } = plugin;

    // Only validate relative paths (strings starting with ./)
    if (typeof source === 'string' && source.startsWith('./')) {
      const absolutePath = path.join(__dirname, '..', source);

      if (!fs.existsSync(absolutePath)) {
        error(`Plugin "${name}" source path does not exist: ${source}`);
        allValid = false;
      } else if (!fs.statSync(absolutePath).isDirectory()) {
        error(`Plugin "${name}" source path is not a directory: ${source}`);
        allValid = false;
      }
    }
    // For GitHub and git URLs, we can't validate without fetching
    // For now, just check they're well-formed (schema does this)
  });

  if (allValid) {
    success('All relative source paths are valid');
  }

  return allValid;
}

// Check plugin directory structure
function checkPluginStructure(plugins) {
  let allValid = true;

  plugins.forEach((plugin) => {
    const { name, source, strict = true } = plugin;

    // Only check relative paths
    if (typeof source === 'string' && source.startsWith('./')) {
      const pluginPath = path.join(__dirname, '..', source);

      if (fs.existsSync(pluginPath)) {
        // Check for .claude-plugin directory
        const claudePluginDir = path.join(pluginPath, '.claude-plugin');
        if (!fs.existsSync(claudePluginDir)) {
          warning(`Plugin "${name}" missing .claude-plugin/ directory`);
          if (strict) {
            error(`Plugin "${name}" is strict mode but missing .claude-plugin/ directory`);
            allValid = false;
          }
        } else {
          // Check for plugin.json
          const pluginManifest = path.join(claudePluginDir, 'plugin.json');
          if (!fs.existsSync(pluginManifest)) {
            if (strict) {
              error(`Plugin "${name}" is strict mode but missing plugin.json`);
              allValid = false;
            } else {
              info(`Plugin "${name}" has no plugin.json (strict: false)`);
            }
          }
        }

        // Check for README.md
        const readme = path.join(pluginPath, 'README.md');
        if (!fs.existsSync(readme)) {
          warning(`Plugin "${name}" missing README.md`);
        }

        // Check for LICENSE
        const license = path.join(pluginPath, 'LICENSE');
        if (!fs.existsSync(license)) {
          warning(`Plugin "${name}" missing LICENSE file`);
        }
      }
    }
  });

  if (allValid) {
    success('Plugin structure checks passed');
  }

  return allValid;
}

// Main validation function
async function validateMarketplace() {
  log('\n=== Marketplace Validation ===\n', 'bright');

  let allValid = true;

  // Load marketplace.json
  info('Loading marketplace.json...');
  const marketplace = loadJSON(MARKETPLACE_PATH, 'marketplace.json');
  if (!marketplace) {
    return false;
  }
  success('marketplace.json loaded successfully');

  // Load schema
  info('\nLoading marketplace schema...');
  const schema = loadJSON(SCHEMA_PATH, 'Marketplace schema');
  if (!schema) {
    return false;
  }
  success('Schema loaded successfully');

  // Validate against schema
  log('\n--- Schema Validation ---', 'bright');
  if (!validateSchema(marketplace, schema, 'marketplace.json')) {
    allValid = false;
  }

  // Check for duplicate names
  log('\n--- Duplicate Name Check ---', 'bright');
  if (!checkDuplicateNames(marketplace.plugins)) {
    allValid = false;
  }

  // Validate source paths
  log('\n--- Source Path Validation ---', 'bright');
  if (!validateSourcePaths(marketplace.plugins)) {
    allValid = false;
  }

  // Check plugin structure
  log('\n--- Plugin Structure Check ---', 'bright');
  if (!checkPluginStructure(marketplace.plugins)) {
    allValid = false;
  }

  // Final result
  log('\n=== Validation Result ===\n', 'bright');
  if (allValid) {
    success('✓ All marketplace validations passed!');
    return true;
  } else {
    error('✗ Marketplace validation failed with errors');
    return false;
  }
}

// Run validation
validateMarketplace()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    error(`Unexpected error: ${err.message}`);
    console.error(err);
    process.exit(1);
  });
