# Contributing to Claude Code Marketplace

Thank you for your interest in contributing to the Claude Code Marketplace! This is a **curated** marketplace, which means all plugins are reviewed and added by maintainers to ensure quality, security, and standards compliance.

## How to Contribute

### Requesting a Plugin

If you'd like to see a plugin added to this marketplace, please:

1. **Check existing plugins**: Review the [README](README.md#available-plugins) to see if a similar plugin already exists
2. **Check open requests**: Search [existing issues](../../issues) to see if someone has already requested the plugin
3. **Submit a request**: [Create a new plugin request issue](../../issues/new?assignees=&labels=plugin-request&template=plugin-request.md&title=%5BPLUGIN%5D+) with:
   - Plugin name and description
   - What problem it solves
   - Proposed functionality
   - Whether you're offering to develop it or just requesting it
   - Any relevant links or examples

### Proposing Your Own Plugin

If you've developed a plugin and want it included in this marketplace:

1. **Ensure it meets our standards**: Review [Plugin Guidelines](docs/PLUGIN_GUIDELINES.md)
2. **Test thoroughly**: Follow the [Testing Guide](docs/TESTING.md)
3. **Submit a proposal**: [Create a plugin proposal issue](../../issues/new?assignees=&labels=plugin-request&template=plugin-request.md&title=%5BPLUGIN%5D+) including:
   - Link to your plugin repository
   - Comprehensive description and documentation
   - Examples of how to use it
   - Test results and validation evidence
   - Any security considerations

## Plugin Quality Standards

All plugins in this marketplace must meet these requirements:

### Required Elements

- **Complete plugin manifest**: Valid `.claude-plugin/plugin.json` with at minimum the `name` field (recommended to include `description`, `version`, and `author` for quality)
- **Clear documentation**: README.md with installation, usage, and examples
- **Proper structure**: Follows official Claude Code plugin structure
- **Semantic versioning**: Uses semantic versioning (e.g., 1.0.0) when version is included
- **License**: Includes a clear license (MIT, Apache-2.0, or similar OSI-approved)

### Code Quality

- **Works as documented**: All functionality operates as described
- **Error handling**: Gracefully handles errors and edge cases
- **No hardcoded secrets**: No API keys, tokens, or credentials in code
- **Clear naming**: Uses descriptive, kebab-case names for commands and agents
- **Follows conventions**: Adheres to Claude Code best practices

### Security

- **No malicious code**: No code that could harm users or their systems
- **Safe dependencies**: If using external scripts/tools, they must be from trusted sources
- **Permission awareness**: Clearly documents any special permissions required
- **Input validation**: Properly validates and sanitizes user inputs

### Documentation

- **Installation instructions**: Clear steps to install and configure
- **Usage examples**: Real-world examples showing how to use the plugin
- **Command reference**: Documentation for all commands, agents, or skills provided
- **Troubleshooting**: Common issues and their solutions
- **Version history**: Changelog documenting changes between versions

## Review Process

When you submit a plugin proposal, maintainers will:

1. **Initial review** (1-3 days)
   - Check that the proposal is complete
   - Verify it aligns with marketplace categories
   - Confirm it doesn't duplicate existing plugins

2. **Technical review** (1-2 weeks)
   - Test the plugin functionality
   - Review code for security concerns
   - Validate documentation completeness
   - Check compliance with Claude Code standards

3. **Decision** (3-5 days after review)
   - Approve and add to marketplace
   - Request changes or improvements
   - Decline with explanation

## For Maintainers

If you're a marketplace maintainer, see the maintainer's guide for:

- How to add plugins to the marketplace
- Validation checklist
- Testing procedures
- Version management
- Category assignment guidelines

## Plugin Categories

Plugins are organized into three categories:

### General Purpose
Broadly useful plugins for common development tasks, productivity, and automation. These should be applicable across many different projects and workflows.

### Meta Agents
Tools specifically for managing Claude Code itself - creating agents, commands, hooks, skills, etc. These help users extend and customize Claude Code.

### Specialized
Domain-specific plugins focused on particular technologies, frameworks, or specialized workflows (e.g., AWS tools, React helpers, database utilities).

## Questions?

- **General questions**: [Open an issue](../../issues) with the "question" label
- **Bug reports**: [File an issue](../../issues/new)
- **Plugin proposals**: [Submit a plugin request](../../issues/new?assignees=&labels=plugin-request&template=plugin-request.md&title=%5BPLUGIN%5D+)

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## License

By contributing (through proposals or other means), you agree that any plugins added to this marketplace will maintain their own licenses, while the marketplace infrastructure is licensed under the MIT License.
