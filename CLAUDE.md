# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **curated marketplace** for Claude Code plugins. The repository serves as a centralized registry where users can discover, install, and manage plugins that extend Claude Code's capabilities through commands, agents, skills, hooks, and MCP integrations.

### Key Characteristics
- **Curated**: All plugins are manually reviewed for quality, security, and standards compliance
- **Structured**: Plugins are organized into three categories: general, meta-agents, and specialized
- **Validated**: Automated validation ensures structural integrity and compliance with schemas

## Architecture

### Marketplace System

The marketplace is defined by `.claude-plugin/marketplace.json`, which contains:
- Marketplace metadata (name, owner, optional version/description)
- Array of plugin entries with metadata and source paths
- Each plugin entry references either a local path (./plugins/...) or remote Git URL

When users run `/plugin marketplace add melodic-software/claude-code-marketplace`, Claude Code fetches this file to discover available plugins.

### Plugin Categories

1. **General Purpose** (`plugins/general/`)
   - Broadly useful plugins across different projects and workflows
   - Examples: code formatters, documentation generators, testing utilities

2. **Meta Agents** (`plugins/meta-agents/`)
   - Tools specifically for managing Claude Code itself
   - Examples: agent creators, command generators, hook configuration managers

3. **Specialized** (`plugins/specialized/<domain>/`)
   - Domain-specific plugins with additional domain subdirectories
   - Examples: plugins/specialized/aws/, plugins/specialized/react/
   - Organized by technology or framework

### Standard Plugin Structure

Each plugin follows the Claude Code plugin specification:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json          # Required: manifest with at minimum "name" field
├── commands/                 # Optional: slash commands (.md files with frontmatter)
├── agents/                   # Optional: subagents (.md files with frontmatter)
├── skills/                   # Optional: Agent Skills (directories with SKILL.md)
├── hooks/                    # Optional: hooks.json for event handlers
├── .mcp.json                 # Optional: MCP server configurations
├── scripts/                  # Optional: utility scripts
├── README.md                 # Recommended: comprehensive documentation
└── LICENSE                   # Recommended: license file
```

**Important**: All component directories (commands/, agents/, skills/, hooks/) must be at the plugin root, NOT inside .claude-plugin/.

### Plugin Manifest (plugin.json)

The plugin.json file defines plugin metadata:

**Required fields:**
- `name` (string): Plugin identifier in kebab-case

**Recommended metadata fields:**
- `version` (string): Semantic version (MAJOR.MINOR.PATCH)
- `description` (string): Brief explanation of plugin purpose
- `author` (object): Author information with `name` field

**Optional configuration fields:**
- `homepage` (string): Documentation URL
- `repository` (string): Source code URL
- `license` (string): License identifier (e.g., "MIT", "Apache-2.0")
- `keywords` (array): Discovery tags
- `commands` (string|array): Additional command files/directories
- `agents` (string|array): Additional agent files
- `hooks` (string|object): Hook config path or inline config
- `mcpServers` (string|object): MCP config path or inline config

### Plugin Components

1. **Commands**: Custom slash commands as Markdown files in `commands/`
   - File format: Markdown with YAML frontmatter
   - Frontmatter fields: `description`, `allowed-tools`, `argument-hint`, `model`, `disable-model-invocation`
   - Invoked with `/command-name` or `/plugin-name:command-name` (for disambiguation)

2. **Agents**: Specialized subagents as Markdown files in `agents/`
   - File format: Markdown with frontmatter describing agent capabilities
   - Claude can invoke agents automatically based on task context
   - Frontmatter fields: `description`, `capabilities`, `model`

3. **Skills**: Model-invoked capabilities in `skills/` directory
   - Structure: Directories containing `SKILL.md` files
   - **Model-invoked**: Claude autonomously decides when to use them based on task context
   - Can include supporting files alongside SKILL.md (scripts, reference docs)

4. **Hooks**: Event handlers in `hooks/hooks.json`
   - Available events: PreToolUse, PostToolUse, UserPromptSubmit, Notification, Stop, SubagentStop, SessionStart, SessionEnd, PreCompact
   - Hook types: command, validation, notification
   - Use ${CLAUDE_PLUGIN_ROOT} for plugin-relative paths

5. **MCP Servers**: External tool integrations in `.mcp.json`
   - Standard MCP server configuration format
   - Servers start automatically when plugin is enabled
   - Use ${CLAUDE_PLUGIN_ROOT} for plugin-relative paths

### Environment Variables

- **${CLAUDE_PLUGIN_ROOT}**: Contains the absolute path to the plugin directory. Use this in hooks, MCP servers, and scripts to ensure correct paths regardless of installation location.

### Marketplace Manifest Schema

The `.claude-plugin/marketplace.json` file defines the marketplace:

**Required fields:**
- `name` (string): Marketplace identifier in kebab-case
- `owner` (object): Marketplace maintainer with `name` field required
- `plugins` (array): List of available plugins

**Optional marketplace metadata:**
- `metadata.description` (string): Brief marketplace description
- `metadata.version` (string): Marketplace version (semantic versioning)
- `metadata.pluginRoot` (string): Base path for relative plugin sources

**Plugin entry fields:**

Required:
- `name` (string): Plugin identifier in kebab-case
- `source` (string|object): Where to fetch the plugin from

Optional (based on plugin manifest schema with all fields made optional, plus marketplace-specific fields):
- `description`, `version`, `author`, `homepage`, `repository`, `license`, `keywords`
- `category` (string): Plugin category for organization
- `tags` (array): Tags for searchability
- `strict` (boolean, default: true): Require plugin.json in plugin folder
- `commands`, `agents`, `hooks`, `mcpServers`: Component configuration overrides

**Strict mode behavior:**
- When `strict: true` (default): Plugin must have plugin.json, marketplace fields supplement
- When `strict: false`: Plugin.json is optional, marketplace entry serves as complete manifest if missing

**Plugin sources:**
- Relative paths: `"./plugins/category/plugin-name"`
- GitHub repos: `{"source": "github", "repo": "owner/repo"}`
- Git URLs: `{"source": "url", "url": "https://..."}`

### Validation System

The repository includes comprehensive validation with two main components:

1. **JSON Schema Validation**:
   - `schemas/marketplace-schema.json`: Validates marketplace.json structure (JSON Schema Draft 7)
   - `schemas/plugin-manifest-schema.json`: Validates individual plugin.json files (JSON Schema Draft 7)
   - Both enforce strict validation rules including kebab-case naming patterns

2. **Node.js Validation Scripts**:
   - `scripts/validate-marketplace.js`:
     - Validates marketplace.json against schema
     - Checks for duplicate plugin names
     - Verifies relative source paths exist
     - Checks plugin directory structure
     - Uses ajv and ajv-formats for validation

   - `scripts/validate-plugin.js`:
     - Validates plugin.json against schema
     - Checks naming conventions (kebab-case)
     - Verifies required files (README.md, LICENSE when expected)
     - Validates component directories (commands/, agents/, skills/, hooks/)
     - Checks that SKILL.md exists in skill directories
     - Validates hooks.json and .mcp.json syntax

## Commands

### Validation

```bash
# Validate marketplace.json structure
npm run validate:marketplace

# Validate all plugin structures
npm run validate:plugins

# Run both validations
npm run validate
```

### Testing

```bash
# Run basic structural tests on plugins
npm test

# Run full CI test suite (validation + tests)
npm run test:ci
```

### Dependencies

```bash
# Install validation dependencies (ajv, ajv-formats)
npm install
```

## Development Workflow

### Adding a New Plugin

1. **Choose category**: Determine if general, meta-agents, or specialized (with domain)

2. **Create directory structure**:
   ```bash
   # For general/meta-agents
   mkdir -p plugins/<category>/<plugin-name>/.claude-plugin

   # For specialized
   mkdir -p plugins/specialized/<domain>/<plugin-name>/.claude-plugin
   ```

3. **Create plugin.json**: Minimum required field is `name`. Recommended to include `description`, `version`, and `author`:
   ```json
   {
     "name": "plugin-name",
     "description": "Brief description",
     "version": "1.0.0",
     "author": {
       "name": "Author Name"
     }
   }
   ```

4. **Add plugin components** (optional):
   - Commands: Create .md files in `commands/` with frontmatter
   - Agents: Create .md files in `agents/` with frontmatter
   - Skills: Create directories in `skills/` with SKILL.md files
   - Hooks: Create `hooks/hooks.json`
   - MCP servers: Create `.mcp.json`

5. **Add README.md and LICENSE**: Recommended for documentation and legal clarity

6. **Update marketplace.json**: Add plugin entry to plugins array:
   ```json
   {
     "name": "plugin-name",
     "source": "./plugins/<category>/plugin-name",
     "description": "Brief description",
     "version": "1.0.0",
     "category": "category-name",
     "author": {
       "name": "Author Name"
     }
   }
   ```

7. **Validate**: Run `npm run validate` to ensure compliance

8. **Test locally**:
   ```bash
   # From parent directory
   cd ..
   claude

   # In Claude Code
   /plugin marketplace add ./claude-code-marketplace
   /plugin install plugin-name@claude-code-marketplace
   ```

### Naming Conventions

**All names use kebab-case**: lowercase with hyphens (no underscores, spaces, or camelCase)
- Plugin directories: `my-plugin-name`
- Plugin names in plugin.json: `"my-plugin-name"`
- Command files: `command-name.md`
- Agent files: `agent-name.md`
- Skill directories: `skill-name/`
- Marketplace name: `"claude-code-marketplace"`

The regex pattern enforced: `^[a-z0-9]+(-[a-z0-9]+)*$`

### Plugin Validation Checklist

When validating a plugin submission:

**Structure:**
- [ ] .claude-plugin/plugin.json exists at plugin root
- [ ] Component directories (commands/, agents/, skills/, hooks/) are at plugin root, NOT in .claude-plugin/
- [ ] README.md exists (recommended)
- [ ] LICENSE file exists (recommended)

**Plugin.json:**
- [ ] Contains required `name` field
- [ ] Name follows kebab-case convention (lowercase with hyphens)
- [ ] Name matches directory name
- [ ] Version uses semantic versioning (if present)
- [ ] Valid JSON syntax

**Components:**
- [ ] Command files end in .md and have `description` frontmatter
- [ ] Agent files have frontmatter with `description`
- [ ] Each skill directory contains SKILL.md
- [ ] hooks.json is valid JSON (if present)
- [ ] .mcp.json is valid JSON (if present)
- [ ] Scripts use ${CLAUDE_PLUGIN_ROOT} for plugin-relative paths

**Security:**
- [ ] No hardcoded secrets, API keys, or credentials
- [ ] No absolute paths (use relative paths or ${CLAUDE_PLUGIN_ROOT})
- [ ] Input validation in scripts
- [ ] Safe external dependencies

**Marketplace.json entry:**
- [ ] `name` matches plugin directory and plugin.json name
- [ ] `source` path is correct (./plugins/...)
- [ ] `strict` field set appropriately (default: true)
- [ ] No duplicate plugin names in marketplace

### Iteration Workflow

When making changes to a plugin during development:

1. Uninstall current version: `/plugin uninstall plugin-name@claude-code-marketplace`
2. Make your changes to plugin files
3. Run validation: `npm run validate`
4. Reinstall: `/plugin install plugin-name@claude-code-marketplace`
5. Restart Claude Code if prompted
6. Test the updated functionality

## Important Paths

- **Marketplace manifest**: `.claude-plugin/marketplace.json`
- **Validation schemas**: `schemas/marketplace-schema.json`, `schemas/plugin-manifest-schema.json`
- **Validation scripts**: `scripts/validate-marketplace.js`, `scripts/validate-plugin.js`
- **Test script**: `scripts/test-plugins.sh`
- **Plugin directories**: `plugins/general/`, `plugins/meta-agents/`, `plugins/specialized/<domain>/`
- **Documentation**: `docs/PLUGIN_GUIDELINES.md`, `docs/STRUCTURE.md`, `docs/TESTING.md`

## CI/CD

GitHub Actions workflows in `.github/workflows/`:
- `validate-structure.yml`: Runs marketplace and plugin validation on every PR and commit
- `test-plugins.yml`: Runs basic plugin tests automatically

These catch issues early before plugins are added to the marketplace.

## Key Differences from Other Systems

**Strict mode** (plugin.json requirement):
- Default is `strict: true`: Plugin must have plugin.json
- Set `strict: false` in marketplace.json to make plugin.json optional
- When optional, marketplace entry serves as complete manifest

**Skills are model-invoked**:
- Claude autonomously decides when to use Skills based on task context
- Different from commands which are explicitly invoked with `/command-name`
- Skills should provide capabilities Claude can discover and use automatically

**Component path supplements**:
- Custom paths in plugin.json (`commands`, `agents`, etc.) supplement default directories
- They don't replace defaults - both are loaded
- All paths must be relative to plugin root and start with `./`
- Useful for organizing complex plugins with multiple command/agent locations

**Namespacing**:
- Commands can use `/plugin-name:command-name` format for disambiguation
- Plugin prefix is optional unless there are name collisions
- Subdirectories in commands/ and agents/ are for organization, not namespacing

## Security Considerations

When reviewing plugin submissions:

**No hardcoded credentials:**
- No API keys, tokens, or passwords in code
- Use environment variables for sensitive data
- Document required environment variables in README

**Input validation:**
- Validate and sanitize user inputs in scripts
- Handle edge cases gracefully
- Provide clear error messages

**Safe dependencies:**
- External scripts must be from trusted sources
- Document any external dependencies
- Pin dependency versions when possible

**Permission awareness:**
- Document special permissions required
- Use least privilege principle
- Explain why permissions are needed

**Path safety:**
- Use ${CLAUDE_PLUGIN_ROOT} for all plugin-relative paths
- No absolute paths in configuration
- Validate path inputs to prevent directory traversal

## Version Management

All plugins must use semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR**: Incompatible API changes
- **MINOR**: Added functionality (backwards-compatible)
- **PATCH**: Bug fixes (backwards-compatible)

When updating plugins:
1. Update `version` in plugin.json
2. Update `version` in marketplace.json entry (if tracked there)
3. Add entry to CHANGELOG.md (if present)
4. Update README.md if functionality changed
5. Test all features still work
6. Run validation before submitting
