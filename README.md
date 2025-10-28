# Claude Code Marketplace

A curated public marketplace for [Claude Code](https://docs.claude.com/en/docs/claude-code) plugins. This marketplace provides high-quality, tested plugins that extend Claude Code's capabilities with custom commands, agents, skills, hooks, and MCP integrations.

## Quick Start

### Add this marketplace

```shell
/plugin marketplace add melodic/claude-code-marketplace
```

### Browse available plugins

```shell
/plugin
```

Select "Browse Plugins" to see available plugins with descriptions and installation options.

### Install a plugin

```shell
/plugin install <plugin-name>@claude-code-marketplace
```

## Plugin Categories

This marketplace organizes plugins into three categories:

### General Purpose
Plugins that provide broad utility across different projects and workflows. These plugins are useful for common development tasks, productivity enhancements, and general-purpose automation.

**Location**: `plugins/general/`

### Meta Agents
Specialized agents for managing Claude Code itself. These tools help you create, modify, and manage Claude Code components like sub-agents, slash commands, hooks, and skills.

**Location**: `plugins/meta-agents/`

**Examples of meta agent capabilities**:
- Create new sub-agents with guided workflows
- Generate slash commands with proper frontmatter
- Manage hooks and hook configurations
- Scaffold new skills with SKILL.md templates

### Specialized
Domain-specific plugins focused on particular technologies, frameworks, or workflows. These plugins provide deep functionality for specialized use cases.

**Location**: `plugins/specialized/<domain>/`

## Available Plugins

This marketplace is currently in its initial setup phase. Plugins will be added soon.

To request a plugin, please see our [Contributing Guidelines](CONTRIBUTING.md).

## Plugin Management

### List installed plugins

```shell
/plugin
```

Select "Manage Plugins" to see installed plugins and their status.

### Enable/disable plugins

```shell
/plugin enable <plugin-name>@claude-code-marketplace
/plugin disable <plugin-name>@claude-code-marketplace
```

### Uninstall a plugin

```shell
/plugin uninstall <plugin-name>@claude-code-marketplace
```

### Update marketplace

```shell
/plugin marketplace update claude-code-marketplace
```

Refreshes the plugin listings from this marketplace.

## Documentation

- [Contributing Guidelines](CONTRIBUTING.md) - How to propose plugins for this curated marketplace
- [Plugin Guidelines](docs/PLUGIN_GUIDELINES.md) - Standards and requirements for plugins
- [Marketplace Structure](docs/STRUCTURE.md) - How this marketplace is organized
- [Testing Guide](docs/TESTING.md) - How to test plugins locally

## About This Marketplace

This is a **curated** marketplace maintained by Melodic Software. All plugins are reviewed for quality, security, and adherence to Claude Code plugin standards before being added.

### Why curated?

- **Quality assurance**: Every plugin is tested and reviewed
- **Security**: Plugins are vetted for security concerns
- **Standards compliance**: Plugins follow Claude Code best practices
- **Documentation**: All plugins include clear documentation and usage examples

## Support

- Report issues: [GitHub Issues](../../issues)
- Request plugins: [Submit a plugin request](../../issues/new?assignees=&labels=plugin-request&template=plugin-request.md&title=%5BPLUGIN%5D+)
- Documentation: [Claude Code Plugins Documentation](https://docs.claude.com/en/docs/claude-code/plugins)

## License

This marketplace and its infrastructure are licensed under the [MIT License](LICENSE).

Individual plugins may have their own licenses - please refer to each plugin's documentation for details.
