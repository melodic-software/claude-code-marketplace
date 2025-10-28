# Plugin Guidelines

This document outlines the standards and requirements for plugins in the Claude Code Marketplace. All plugins must adhere to these guidelines to ensure quality, consistency, and compatibility.

## Plugin Structure

### Required Structure

Every plugin must follow this directory structure:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json          # Required: Plugin manifest
├── README.md                 # Required: Plugin documentation
└── LICENSE                   # Required: License file
```

### Optional Components

Plugins can include these optional directories for additional functionality:

```
plugin-name/
├── .claude-plugin/
│   └── plugin.json
├── commands/                 # Slash commands
│   └── command-name.md
├── agents/                   # Subagents
│   └── agent-name.md
├── skills/                   # Agent Skills
│   └── skill-name/
│       └── SKILL.md
├── hooks/                    # Event handlers
│   └── hooks.json
├── .mcp.json                 # MCP server configurations
├── scripts/                  # Utility scripts (optional)
├── templates/                # Templates (optional)
└── docs/                     # Additional documentation (optional)
```

## Plugin Manifest (plugin.json)

The `plugin.json` file must be located at `.claude-plugin/plugin.json`.

### Required Fields

| Field  | Type   | Description                               |
|--------|--------|-------------------------------------------|
| `name` | string | Plugin identifier (kebab-case, no spaces) |

### Recommended Metadata Fields

| Field         | Type   | Description                                   |
|---------------|--------|-----------------------------------------------|
| `description` | string | Brief explanation of plugin purpose           |
| `version`     | string | Semantic version (MAJOR.MINOR.PATCH)          |
| `author`      | object | Author information with `name` field required |

**Example with recommended fields:**

```json
{
  "name": "plugin-name",
  "description": "Brief description of what this plugin does",
  "version": "1.0.0",
  "author": {
    "name": "Author Name",
    "email": "author@example.com"
  }
}
```

### Optional Configuration Fields

| Field        | Type           | Description                                      |
|--------------|----------------|--------------------------------------------------|
| `homepage`   | string         | Plugin homepage or documentation URL             |
| `repository` | string         | Source code repository URL                       |
| `license`    | string         | SPDX license identifier (e.g., MIT, Apache-2.0)  |
| `keywords`   | array          | Tags for plugin discovery                        |
| `commands`   | string\|array  | Custom paths to command files or directories (must be relative and start with `./`)     |
| `agents`     | string\|array  | Custom paths to agent files (must be relative and start with `./`)                      |
| `hooks`      | string\|object | Custom hooks configuration (path must be relative and start with `./` if string)                       |
| `mcpServers` | string\|object | MCP server configurations (path must be relative and start with `./` if string)                        |

## Naming Conventions

### Plugin Names
- Use kebab-case (lowercase with hyphens): `my-plugin-name`
- No spaces, underscores, or special characters
- Descriptive and concise (2-4 words ideal)
- Avoid generic names like "utils" or "helpers"

### Command Names
- Use kebab-case for file names: `my-command.md`
- Command invocation: `/my-command`
- Descriptive of the action performed

### Agent Names
- Use kebab-case for file names: `code-reviewer.md`
- Clear indication of agent's purpose
- Include description frontmatter

### Skill Names
- Use kebab-case for directory names: `pdf-processing/`
- Directory must contain `SKILL.md`
- Name reflects the capability provided

## Slash Commands

Commands are Markdown files in the `commands/` directory.

### Command Structure

```markdown
---
description: Brief description of what this command does
allowed-tools: Tool1, Tool2
argument-hint: [arg1] [arg2]
model: claude-sonnet-4
---

# Command Instructions

Detailed instructions for Claude on how to execute this command.

Use $ARGUMENTS or $1, $2, etc. for argument placeholders.
```

### Command Frontmatter

| Field                      | Required      | Description                                     |
|----------------------------|---------------|-------------------------------------------------|
| `description`              | Recommended* | Brief description shown in /help                |
| `allowed-tools`            | No            | Tools this command can use                      |
| `argument-hint`            | No            | Hint shown during auto-completion               |
| `model`                    | No            | Specific model to use for this command          |
| `disable-model-invocation` | No            | Prevent SlashCommand tool from calling this command |

**\*Note**: While Claude Code has a default for `description` (uses the first line from the prompt), this marketplace requires it for two reasons:
1. **Quality**: Ensures clear, discoverable commands in `/help`
2. **SlashCommand tool compatibility**: The SlashCommand tool requires `description` to be populated for model invocation

### Best Practices

- Keep commands focused on a single task
- Use clear, imperative descriptions
- Include argument hints when commands accept parameters
- Document expected inputs and outputs
- Specify allowed-tools when using Bash execution

## Subagents

Agents are Markdown files in the `agents/` directory that define specialized subagents.

### Agent Structure

```markdown
---
description: Brief description of agent purpose
capabilities: ["capability1", "capability2", "capability3"]
model: claude-sonnet-4
---

# Agent Instructions

Detailed instructions defining:
- Agent's role and expertise
- Specific behaviors and workflows
- Output format requirements
- Error handling approaches
```

### Best Practices

- Define clear specialization and scope
- Include specific workflow steps
- Specify output format expectations
- Document when the agent should be used

## Agent Skills

Skills are directories in the `skills/` directory, each containing a `SKILL.md` file.

### Skill Directory Structure

```
skills/
└── my-skill/
    ├── SKILL.md              # Required: Main skill definition
    ├── GUIDE.md              # Optional: Detailed guide
    ├── REFERENCE.md          # Optional: Reference material
    └── scripts/              # Optional: Utility scripts
        └── helper.sh
```

### SKILL.md Structure

```markdown
# Skill Name

## Overview
Brief description of what this skill enables.

## Usage
When and how Claude should use this skill.

## Components
- List of commands, scripts, or templates provided
- How they work together

## Examples
Real-world usage examples
```

### Best Practices

- Provide comprehensive overview
- Include usage scenarios
- Document all components
- Add practical examples

## Hooks

Hooks are defined in `hooks/hooks.json` and trigger on specific events.

### Hook Structure

```json
{
  "PostToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [
        {
          "type": "command",
          "command": "${CLAUDE_PLUGIN_ROOT}/scripts/validate.sh"
        }
      ]
    }
  ]
}
```

### Supported Hook Events

- `PreToolUse`: Before Claude uses any tool
- `PostToolUse`: After Claude uses any tool
- `UserPromptSubmit`: When user submits a prompt
- `Notification`: When Claude Code sends notifications
- `Stop`: When Claude attempts to stop
- `SubagentStop`: When a subagent attempts to stop
- `SessionStart`: At the beginning of sessions
- `SessionEnd`: At the end of sessions
- `PreCompact`: Before conversation history is compacted

### Best Practices

- Use hooks sparingly (only when necessary)
- Keep hook scripts fast and reliable
- Provide clear error messages
- Document hook behavior in README

## Documentation Requirements

### README.md

Every plugin must include a comprehensive README with:

1. **Title and Description**: Clear explanation of what the plugin does
2. **Installation**: How to install from this marketplace
3. **Usage**: Examples of how to use each feature
4. **Commands Reference**: List all commands with descriptions
5. **Configuration**: Any setup or configuration required
6. **Examples**: Real-world usage scenarios
7. **Troubleshooting**: Common issues and solutions
8. **License**: Link to LICENSE file

### Example README Structure

```markdown
# Plugin Name

Brief description of the plugin.

## Installation

```shell
/plugin install plugin-name@claude-code-marketplace
```

## Features

- Feature 1
- Feature 2

## Usage

### Command Name

Description and example of using the command.

## Configuration

Any required configuration steps.

## Examples

Real-world usage examples.

## Troubleshooting

Common issues and their solutions.

## License

This plugin is licensed under the [MIT License](../LICENSE).
```

## Version Management

### Semantic Versioning

All plugins must use [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH):

- **MAJOR**: Incompatible API changes
- **MINOR**: Added functionality (backwards-compatible)
- **PATCH**: Bug fixes (backwards-compatible)

### Version Updates

When updating a plugin:

1. Update `version` in `plugin.json`
2. Add entry to CHANGELOG.md (if present)
3. Update README if functionality changed
4. Test all features still work
5. Submit update proposal

## Security Requirements

### No Hardcoded Secrets

- No API keys, tokens, or credentials in code
- Use environment variables for sensitive data
- Document required environment variables

### Input Validation

- Validate and sanitize all user inputs
- Handle edge cases gracefully
- Provide clear error messages

### Safe Dependencies

- External scripts must be from trusted sources
- Document any external dependencies
- Pin dependency versions when possible

### Permission Awareness

- Document any special permissions required
- Explain why permissions are needed
- Use least privilege principle

## Testing Requirements

Before submitting a plugin, ensure:

1. **Functionality Testing**
   - All commands work as documented
   - Agents behave correctly
   - Skills are discoverable and functional
   - Hooks trigger appropriately

2. **Error Handling**
   - Graceful handling of invalid inputs
   - Clear error messages
   - No crashes or hangs

3. **Documentation Testing**
   - All examples work
   - Instructions are clear
   - No broken links

4. **Compatibility Testing**
   - Works with current Claude Code version
   - No conflicts with common plugins

See [Testing Guide](TESTING.md) for detailed testing procedures.

## Common Pitfalls

### Don't

- Use generic or ambiguous names
- Include credentials or secrets in code
- Create overly complex command structures
- Forget to document configuration requirements
- Skip error handling
- Use absolute paths (use relative paths or environment variables)

### Do

- Follow kebab-case naming consistently
- Include comprehensive documentation
- Test thoroughly before submission
- Keep commands focused and simple
- Handle errors gracefully
- Use ${CLAUDE_PLUGIN_ROOT} for plugin-relative paths
- Ensure all custom component paths are relative and start with `./`

## Getting Help

- Review [official Claude Code plugin docs](https://docs.claude.com/en/docs/claude-code/plugins)
- Check [marketplace structure documentation](STRUCTURE.md)
- See [testing guide](TESTING.md) for testing workflows
- Ask questions in [GitHub Discussions](../../discussions)

## Updates to Guidelines

These guidelines may be updated as Claude Code evolves. Check back regularly for changes.

Last updated: 2025-10-28
