#!/usr/bin/env node

/**
 * Plugin Validation Script
 *
 * Validates individual plugins for:
 * - Directory structure
 * - plugin.json compliance with schema
 * - Required files (README.md, LICENSE)
 * - Component files (commands, agents, skills, hooks)
 * - Naming conventions
 */

const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

// Configuration
const PLUGINS_DIR = path.join(__dirname, '..', 'plugins');
const SCHEMA_PATH = path.join(__dirname, '..', 'schemas', 'plugin-manifest-schema.json');

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
  log(`  ✗ ${message}`, 'red');
}

function success(message) {
  log(`  ✓ ${message}`, 'green');
}

function warning(message) {
  log(`  ⚠ ${message}`, 'yellow');
}

function info(message) {
  log(`  ℹ ${message}`, 'blue');
}

// Load JSON file with error handling
function loadJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    return null;
  }
}

// Check if name follows kebab-case convention
function isKebabCase(name) {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(name);
}

// Validate plugin.json against schema
function validatePluginManifest(pluginPath, pluginName) {
  const manifestPath = path.join(pluginPath, '.claude-plugin', 'plugin.json');

  if (!fs.existsSync(manifestPath)) {
    error('Missing plugin.json');
    return false;
  }

  const manifest = loadJSON(manifestPath);
  if (!manifest) {
    error('plugin.json is not valid JSON');
    return false;
  }

  // Load schema
  const schema = loadJSON(SCHEMA_PATH);
  if (!schema) {
    error('Could not load plugin manifest schema');
    return false;
  }

  // Validate against schema
  const ajv = new Ajv({ allErrors: true, verbose: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  const valid = validate(manifest);

  if (!valid) {
    error('plugin.json schema validation failed:');
    validate.errors.forEach(err => {
      const path = err.instancePath || 'root';
      error(`    ${path}: ${err.message}`);
    });
    return false;
  }

  // Check name matches directory
  if (manifest.name !== pluginName) {
    warning(`plugin.json name "${manifest.name}" doesn't match directory name "${pluginName}"`);
  }

  success('plugin.json is valid');
  return true;
}

// Validate required files
function validateRequiredFiles(pluginPath) {
  let allValid = true;

  // Check README.md
  const readme = path.join(pluginPath, 'README.md');
  if (!fs.existsSync(readme)) {
    error('Missing README.md');
    allValid = false;
  } else {
    success('README.md found');
  }

  // Check LICENSE
  const license = path.join(pluginPath, 'LICENSE');
  if (!fs.existsSync(license)) {
    error('Missing LICENSE file');
    allValid = false;
  } else {
    success('LICENSE file found');
  }

  return allValid;
}

// Validate optional component directories
function validateComponents(pluginPath) {
  const components = {
    commands: path.join(pluginPath, 'commands'),
    agents: path.join(pluginPath, 'agents'),
    skills: path.join(pluginPath, 'skills'),
    hooks: path.join(pluginPath, 'hooks'),
  };

  // Check commands directory
  if (fs.existsSync(components.commands)) {
    const files = fs.readdirSync(components.commands);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    if (mdFiles.length > 0) {
      success(`commands/ directory found with ${mdFiles.length} command(s)`);
    } else {
      warning('commands/ directory exists but contains no .md files');
    }
  }

  // Check agents directory
  if (fs.existsSync(components.agents)) {
    const files = fs.readdirSync(components.agents);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    if (mdFiles.length > 0) {
      success(`agents/ directory found with ${mdFiles.length} agent(s)`);
    } else {
      warning('agents/ directory exists but contains no .md files');
    }
  }

  // Check skills directory
  if (fs.existsSync(components.skills)) {
    const skillDirs = fs.readdirSync(components.skills, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory());

    if (skillDirs.length > 0) {
      success(`skills/ directory found with ${skillDirs.length} skill(s)`);

      // Check each skill has SKILL.md
      skillDirs.forEach(dir => {
        const skillMd = path.join(components.skills, dir.name, 'SKILL.md');
        if (!fs.existsSync(skillMd)) {
          warning(`Skill "${dir.name}" missing SKILL.md`);
        }
      });
    } else {
      warning('skills/ directory exists but contains no skill directories');
    }
  }

  // Check hooks directory
  if (fs.existsSync(components.hooks)) {
    const hooksJson = path.join(components.hooks, 'hooks.json');
    if (fs.existsSync(hooksJson)) {
      const hooks = loadJSON(hooksJson);
      if (hooks) {
        success('hooks/hooks.json found and valid');
      } else {
        error('hooks/hooks.json is not valid JSON');
      }
    } else {
      warning('hooks/ directory exists but missing hooks.json');
    }
  }

  // Check for .mcp.json
  const mcpJson = path.join(pluginPath, '.mcp.json');
  if (fs.existsSync(mcpJson)) {
    const mcp = loadJSON(mcpJson);
    if (mcp) {
      success('.mcp.json found and valid');
    } else {
      error('.mcp.json is not valid JSON');
    }
  }
}

// Validate naming conventions
function validateNaming(pluginName) {
  if (!isKebabCase(pluginName)) {
    error(`Plugin name "${pluginName}" should use kebab-case (lowercase with hyphens)`);
    return false;
  }

  success('Plugin name follows kebab-case convention');
  return true;
}

// Validate a single plugin
function validatePlugin(pluginPath, pluginName, category) {
  log(`\n--- Validating: ${category}/${pluginName} ---`, 'bright');

  let allValid = true;

  // Check naming
  if (!validateNaming(pluginName)) {
    allValid = false;
  }

  // Check for .claude-plugin directory
  const claudePluginDir = path.join(pluginPath, '.claude-plugin');
  if (!fs.existsSync(claudePluginDir)) {
    error('Missing .claude-plugin/ directory');
    allValid = false;
  } else {
    success('.claude-plugin/ directory found');

    // Validate plugin.json
    if (!validatePluginManifest(pluginPath, pluginName)) {
      allValid = false;
    }
  }

  // Validate required files
  if (!validateRequiredFiles(pluginPath)) {
    allValid = false;
  }

  // Validate optional components
  validateComponents(pluginPath);

  return allValid;
}

// Find all plugins in the plugins directory
function findPlugins() {
  const plugins = [];

  if (!fs.existsSync(PLUGINS_DIR)) {
    return plugins;
  }

  const categories = fs.readdirSync(PLUGINS_DIR, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  categories.forEach(category => {
    const categoryPath = path.join(PLUGINS_DIR, category);

    // For specialized category, we might have sub-categories
    if (category === 'specialized') {
      const domains = fs.readdirSync(categoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      domains.forEach(domain => {
        const domainPath = path.join(categoryPath, domain);
        const pluginDirs = fs.readdirSync(domainPath, { withFileTypes: true })
          .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
          .map(dirent => dirent.name);

        pluginDirs.forEach(pluginName => {
          plugins.push({
            name: pluginName,
            path: path.join(domainPath, pluginName),
            category: `${category}/${domain}`,
          });
        });
      });
    } else {
      const pluginDirs = fs.readdirSync(categoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
        .map(dirent => dirent.name);

      pluginDirs.forEach(pluginName => {
        plugins.push({
          name: pluginName,
          path: path.join(categoryPath, pluginName),
          category,
        });
      });
    }
  });

  return plugins;
}

// Main validation function
async function validateAllPlugins() {
  log('\n=== Plugin Validation ===\n', 'bright');

  const plugins = findPlugins();

  if (plugins.length === 0) {
    warning('No plugins found in plugins/ directory');
    return true;
  }

  info(`Found ${plugins.length} plugin(s) to validate\n`);

  let allValid = true;

  for (const plugin of plugins) {
    const isValid = validatePlugin(plugin.path, plugin.name, plugin.category);
    if (!isValid) {
      allValid = false;
    }
  }

  // Final result
  log('\n=== Validation Result ===\n', 'bright');
  if (allValid) {
    success(`✓ All ${plugins.length} plugin(s) passed validation!`);
    return true;
  } else {
    error('✗ Some plugins failed validation');
    return false;
  }
}

// Run validation
validateAllPlugins()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    error(`Unexpected error: ${err.message}`);
    console.error(err);
    process.exit(1);
  });
