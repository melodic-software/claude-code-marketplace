# Marketplace Structure

This document explains how the Claude Code Marketplace is organized and how plugins are structured within it.

## Repository Layout

```
claude-code-marketplace/
├── .claude-plugin/
│   └── marketplace.json       # Marketplace manifest
├── .github/
│   ├── workflows/             # CI/CD workflows
│   │   ├── validate-structure.yml
│   │   └── test-plugins.yml
│   └── ISSUE_TEMPLATE/        # Issue templates
│       └── plugin-request.md
├── plugins/                   # All plugins
│   ├── general/               # General-purpose plugins
│   ├── meta-agents/           # Claude Code management tools
│   └── specialized/           # Domain-specific plugins
├── docs/                      # Documentation
│   ├── PLUGIN_GUIDELINES.md
│   ├── STRUCTURE.md (this file)
│   └── TESTING.md
├── schemas/                   # JSON schemas for validation
│   ├── marketplace-schema.json
│   └── plugin-manifest-schema.json
├── scripts/                   # Validation and testing scripts
│   ├── validate-marketplace.js
│   ├── validate-plugin.js
│   └── test-plugins.sh
├── README.md                  # Main documentation
├── CONTRIBUTING.md            # Contribution guidelines
├── LICENSE                    # MIT License
├── SECURITY.md                # Security policy
├── CODE_OF_CONDUCT.md         # Code of conduct
└── package.json               # Node.js dependencies for validation
```

## Marketplace Manifest

The marketplace manifest (`.claude-plugin/marketplace.json`) is the core configuration file that defines:

- Marketplace metadata (name, owner, description)
- List of all available plugins
- Plugin sources and locations

### Example Marketplace Manifest

```json
{
  "name": "claude-code-marketplace",
  "owner": {
    "name": "Melodic Software"
  },
  "metadata": {
    "description": "A curated public marketplace for Claude Code plugins",
    "version": "1.0.0"
  },
  "plugins": [
    {
      "name": "example-plugin",
      "source": "./plugins/general/example-plugin",
      "description": "Example plugin for demonstration",
      "version": "1.0.0",
      "category": "general",
      "author": {
        "name": "Author Name"
      },
      "keywords": ["example", "demo"]
    }
  ]
}
```

### Marketplace Fields

| Field                  | Required | Description                                   |
|------------------------|----------|-----------------------------------------------|
| `name`                 | Yes      | Marketplace identifier (kebab-case)           |
| `owner`                | Yes      | Object with `name` field (and optional email) |
| `metadata.description` | No       | Brief marketplace description                 |
| `metadata.version`     | No       | Marketplace version                           |
| `plugins`              | Yes      | Array of plugin entries                       |

### Plugin Entry Fields

Each plugin entry in the marketplace.json can include:

| Field         | Required | Description                                |
|---------------|----------|--------------------------------------------|
| `name`        | Yes      | Plugin identifier (matches plugin.json)    |
| `source`      | Yes      | Path or URL to plugin source               |
| `description` | No       | Brief plugin description                   |
| `version`     | No       | Plugin version                             |
| `category`    | No       | Category (general, meta-agents, etc.)      |
| `author`      | No       | Author information                         |
| `keywords`    | No       | Tags for searchability                     |
| `strict`      | No       | Require plugin.json (default: true)        |

Note: When `strict: true` (default), the plugin must have its own `plugin.json` file. Marketplace fields supplement that file. When `strict: false`, the plugin.json is optional, and the marketplace entry serves as the complete manifest.

## Plugin Categories

### General Purpose (`plugins/general/`)

Plugins that provide broad utility across different projects and workflows.

**Examples**:
- Code formatters
- Documentation generators
- Git workflow helpers
- Testing utilities
- Project scaffolders

**Organization**:
```
plugins/general/
├── code-formatter/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── commands/
│   ├── README.md
│   └── LICENSE
└── doc-generator/
    ├── .claude-plugin/
    │   └── plugin.json
    ├── agents/
    ├── README.md
    └── LICENSE
```

### Meta Agents (`plugins/meta-agents/`)

Specialized tools for managing Claude Code itself - creating and modifying agents, commands, hooks, and skills.

**Examples**:
- Agent creator/editor
- Slash command generator
- Hook configuration manager
- Skill scaffolder
- Settings helper

**Organization**:
```
plugins/meta-agents/
├── agent-creator/
│   ├── .claude-plugin/
│   │   └── plugin.json
│   ├── commands/
│   ├── agents/
│   ├── README.md
│   └── LICENSE
└── command-generator/
    ├── .claude-plugin/
    │   └── plugin.json
    ├── commands/
    ├── templates/
    ├── README.md
    └── LICENSE
```

### Specialized (`plugins/specialized/`)

Domain-specific plugins focused on particular technologies, frameworks, or specialized workflows.

**Examples**:
- `plugins/specialized/aws/` - AWS-specific tools
- `plugins/specialized/react/` - React development helpers
- `plugins/specialized/database/` - Database utilities
- `plugins/specialized/kubernetes/` - K8s management tools

**Organization**:
```
plugins/specialized/
├── aws/
│   └── aws-helper/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── commands/
│       ├── README.md
│       └── LICENSE
├── react/
│   └── component-generator/
│       ├── .claude-plugin/
│       │   └── plugin.json
│       ├── commands/
│       ├── templates/
│       ├── README.md
│       └── LICENSE
└── database/
    └── migration-helper/
        ├── .claude-plugin/
        │   └── plugin.json
        ├── commands/
        ├── README.md
        └── LICENSE
```

## Plugin Structure

Each plugin follows the standard Claude Code plugin structure:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json          # Required: Plugin manifest
├── commands/                 # Optional: Slash commands
│   ├── command1.md
│   └── command2.md
├── agents/                   # Optional: Subagents
│   ├── agent1.md
│   └── agent2.md
├── skills/                   # Optional: Agent Skills
│   └── skill-name/
│       ├── SKILL.md
│       └── GUIDE.md
├── hooks/                    # Optional: Event handlers
│   └── hooks.json
├── .mcp.json                 # Optional: MCP server config
├── scripts/                  # Optional: Utility scripts
├── templates/                # Optional: Templates
├── docs/                     # Optional: Additional docs
├── README.md                 # Required: Plugin documentation
└── LICENSE                   # Required: License file
```

## How Plugins are Referenced

### In marketplace.json

Plugins use relative paths from the repository root:

```json
{
  "name": "my-plugin",
  "source": "./plugins/general/my-plugin"
}
```

### By Users

Users reference plugins with the marketplace name:

```shell
/plugin install my-plugin@claude-code-marketplace
```

### Plugin Installation Flow

1. User adds marketplace: `/plugin marketplace add melodic-software/claude-code-marketplace`
2. Claude Code fetches `.claude-plugin/marketplace.json`
3. User browses or installs plugin: `/plugin install my-plugin@claude-code-marketplace`
4. Claude Code resolves the source path: `./plugins/general/my-plugin`
5. Claude Code fetches the plugin from that location
6. Plugin components become available

## Directory Naming

### Must Use kebab-case

All directory and file names use kebab-case (lowercase with hyphens):

- ✅ `code-formatter/`
- ✅ `my-custom-agent.md`
- ✅ `pdf-processing/`
- ❌ `CodeFormatter/`
- ❌ `my_custom_agent.md`
- ❌ `PDFProcessing/`

### Descriptive Names

Names should clearly indicate purpose:

- ✅ `aws-deployment-helper/`
- ✅ `react-component-generator/`
- ❌ `helper/`
- ❌ `tool1/`

## Validation Structure

### JSON Schemas (`schemas/`)

Schemas validate JSON structure:

- `marketplace-schema.json` - Validates marketplace.json
- `plugin-manifest-schema.json` - Validates plugin.json files

### Validation Scripts (`scripts/`)

Scripts perform structural and content validation:

- `validate-marketplace.js` - Validates marketplace.json structure
- `validate-plugin.js` - Validates individual plugin structure
- `test-plugins.sh` - Runs basic tests on all plugins

### CI/CD Workflows (`.github/workflows/`)

Automated validation runs on every PR and push:

- `validate-structure.yml` - Validates JSON and directory structure
- `test-plugins.yml` - Tests plugin functionality

## Adding a New Plugin

When adding a new plugin to the marketplace:

1. **Choose Category**: Determine if it's general, meta-agent, or specialized
2. **Create Directory**: `plugins/<category>/<plugin-name>/`
3. **Add Plugin Files**: Include all required components
4. **Update marketplace.json**: Add entry to plugins array
5. **Run Validation**: `npm run validate`
6. **Test Plugin**: Follow [Testing Guide](TESTING.md)
7. **Submit PR**: Create pull request with changes

### Example: Adding a General Plugin

```bash
# 1. Create plugin directory
mkdir -p plugins/general/my-new-plugin/.claude-plugin
mkdir -p plugins/general/my-new-plugin/commands

# 2. Create plugin.json
cat > plugins/general/my-new-plugin/.claude-plugin/plugin.json << 'EOF'
{
  "name": "my-new-plugin",
  "description": "Description of my plugin",
  "version": "1.0.0",
  "author": {
    "name": "Your Name"
  }
}
EOF

# 3. Add to marketplace.json (in the plugins array)
# {
#   "name": "my-new-plugin",
#   "source": "./plugins/general/my-new-plugin",
#   "description": "Description of my plugin",
#   "version": "1.0.0",
#   "category": "general"
# }

# 4. Validate
npm run validate
```

## Environment Variables

Plugins can use environment variables for paths:

- `${CLAUDE_PLUGIN_ROOT}` - Resolves to plugin's installation directory

Example in hooks.json:
```json
{
  "command": "${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh"
}
```

## Best Practices

### Organization

- Keep related plugins in the same category
- Use subdirectories for domain grouping in specialized/
- Maintain consistent structure across all plugins

### Naming

- Use clear, descriptive names
- Follow kebab-case consistently
- Avoid generic names like "utils" or "helper"

### Documentation

- Keep README files comprehensive
- Include examples for every feature
- Document all configuration requirements

### Maintenance

- Keep plugins updated with latest Claude Code features
- Respond to issues and user feedback
- Maintain backwards compatibility when possible

## See Also

- [Plugin Guidelines](PLUGIN_GUIDELINES.md) - Detailed plugin requirements
- [Testing Guide](TESTING.md) - How to test plugins
- [Contributing Guidelines](../CONTRIBUTING.md) - How to contribute
- [Claude Code Plugin Documentation](https://docs.claude.com/en/docs/claude-code/plugins)
