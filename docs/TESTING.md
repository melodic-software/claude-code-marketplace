# Testing Guide

This guide explains how to test Claude Code plugins before adding them to the marketplace. Thorough testing ensures plugins work correctly and meet quality standards.

## Testing Workflow Overview

1. **Local marketplace setup** - Add marketplace locally for testing
2. **Plugin installation** - Install the plugin from local marketplace
3. **Component testing** - Test commands, agents, skills, and hooks
4. **Iteration** - Uninstall, modify, and reinstall as needed
5. **Validation** - Run automated validation scripts
6. **Final testing** - Comprehensive test before submission

## Prerequisites

- Claude Code installed and running
- Node.js (for validation scripts)
- Git (for version control)
- Basic command-line familiarity

## Local Marketplace Setup

### 1. Clone or Create Test Marketplace

If testing a new plugin in this marketplace:

```bash
# Clone the marketplace repository
git clone https://github.com/melodic/claude-code-marketplace.git
cd claude-code-marketplace

# Or if already cloned, pull latest changes
git pull origin main
```

### 2. Add Marketplace Locally

Start Claude Code and add your local marketplace:

```shell
# Start Claude Code
claude

# Add local marketplace (from parent directory of repo)
/plugin marketplace add ./claude-code-marketplace

# Or with absolute path
/plugin marketplace add C:/path/to/claude-code-marketplace
```

### 3. Verify Marketplace Added

```shell
# List marketplaces
/plugin marketplace list
```

You should see `claude-code-marketplace` in the list.

## Plugin Installation Testing

### Install Plugin

```shell
/plugin install plugin-name@claude-code-marketplace
```

Claude Code will prompt you to install. Select "Install now" and restart if prompted.

### Verify Installation

```shell
# View installed plugins
/plugin
```

Select "Manage Plugins" to see your plugin in the list.

## Component Testing

### Testing Slash Commands

#### 1. Verify Commands Appear

```shell
# List all available commands
/help
```

Your plugin's commands should appear in the list.

#### 2. Test Each Command

Test commands without arguments:

```shell
/your-command
```

Test commands with arguments:

```shell
/your-command arg1 arg2
```

#### 3. Verify Command Behavior

- Does it execute as documented?
- Are arguments handled correctly?
- Do error messages make sense?
- Is output clear and useful?

#### 4. Test Edge Cases

- Missing required arguments
- Invalid argument types
- Very long inputs
- Special characters in arguments

### Testing Subagents

#### 1. Verify Agents Available

```shell
# List available agents
/agents
```

Your plugin's agents should appear in the list.

#### 2. Invoke Agents

Ask Claude to use your agent in natural language:

```
Use the [agent-name] agent to [perform task]
```

Or use the Task tool directly if appropriate.

#### 3. Verify Agent Behavior

- Does agent follow its defined role?
- Are outputs formatted correctly?
- Does it handle errors gracefully?
- Does it stay within its scope?

### Testing Skills

Skills are automatically discovered by Claude when relevant to the task.

#### 1. Verify Skill Discovery

Create a scenario where your skill would be useful:

```
I need to [task that skill addresses]
```

Claude should recognize and use the skill automatically.

#### 2. Test Skill Components

- Does SKILL.md provide clear guidance?
- Are supporting files accessible?
- Do any scripts execute correctly?
- Is documentation helpful?

#### 3. Verify Skill Integration

- Works with other Claude Code features?
- Doesn't conflict with other skills?
- Provides value in real scenarios?

### Testing Hooks

Hooks trigger automatically on specific events.

#### 1. Identify Hook Triggers

Check your `hooks/hooks.json` to see what triggers your hooks:

```json
{
  "PostToolUse": [
    {
      "matcher": "Write|Edit",
      "hooks": [...]
    }
  ]
}
```

#### 2. Trigger Hook Events

Perform actions that should trigger your hooks:

```
Write a file to test PostToolUse hook
```

#### 3. Verify Hook Behavior

- Does hook execute when expected?
- Is hook output visible and clear?
- Does hook complete successfully?
- Are errors handled gracefully?

#### 4. Test Hook Performance

- Hook doesn't slow down operations significantly
- Hook completes in reasonable time
- Hook doesn't interfere with other operations

### Testing MCP Servers

If your plugin includes MCP server configurations:

#### 1. Check MCP Status

```shell
/mcp
```

Verify your MCP servers are listed and connected.

#### 2. Test MCP Tools

Use the tools provided by your MCP servers:

```
Use the [tool-name] to [perform action]
```

#### 3. Verify MCP Integration

- Tools are discoverable
- Authentication works (if required)
- Tools provide expected functionality
- Error messages are clear

## Iteration Workflow

When you need to make changes to your plugin:

### 1. Uninstall Current Version

```shell
/plugin uninstall plugin-name@claude-code-marketplace
```

### 2. Make Changes

Edit your plugin files as needed:

```bash
# Edit plugin files
cd plugins/category/plugin-name
# Make your changes
```

### 3. Reinstall Plugin

```shell
/plugin install plugin-name@claude-code-marketplace
```

Restart Claude Code if prompted.

### 4. Repeat Testing

Test the updated functionality to verify fixes or improvements.

## Automated Validation

### Install Dependencies

```bash
# Install validation tools
npm install
```

### Run Validation Scripts

#### Validate Marketplace Structure

```bash
npm run validate:marketplace
```

Checks:
- marketplace.json is valid JSON
- Required fields are present
- Plugin entries are well-formed
- No duplicate plugin names

#### Validate Plugin Structure

```bash
npm run validate:plugins
```

Checks:
- Each plugin has required structure
- plugin.json is valid (when strict: true)
- Required files exist (README.md, LICENSE)
- Directory naming follows conventions

#### Run All Validation

```bash
npm run validate
```

Runs both marketplace and plugin validation.

### Run Basic Tests

```bash
npm test
```

Runs structural tests:
- JSON files are parseable
- Markdown files are readable
- No broken file references
- Directory structure is correct

## Comprehensive Testing Checklist

Before submitting a plugin, verify:

### Functionality
- [ ] All commands work as documented
- [ ] All agents behave correctly
- [ ] All skills are discoverable and functional
- [ ] All hooks trigger appropriately
- [ ] MCP servers connect and work (if applicable)

### Edge Cases
- [ ] Invalid inputs handled gracefully
- [ ] Missing arguments show helpful errors
- [ ] Long inputs don't cause issues
- [ ] Special characters handled correctly

### Documentation
- [ ] README.md is complete and accurate
- [ ] All commands documented with examples
- [ ] Configuration steps are clear
- [ ] Troubleshooting section helps users

### Code Quality
- [ ] No hardcoded secrets or credentials
- [ ] No absolute paths (use relative or env vars)
- [ ] Error messages are clear and helpful
- [ ] Code follows plugin guidelines

### Compatibility
- [ ] Works with current Claude Code version
- [ ] Doesn't conflict with common plugins
- [ ] Environment variables used correctly
- [ ] Dependencies documented

### Security
- [ ] Input validation implemented
- [ ] No malicious code
- [ ] External scripts from trusted sources
- [ ] Permissions documented

### Validation
- [ ] Automated validation passes
- [ ] No schema errors
- [ ] Structure follows conventions
- [ ] JSON files are valid

## Common Issues and Solutions

### Plugin Not Appearing

**Symptoms**: Plugin doesn't show up in `/plugin` menu

**Solutions**:
- Check marketplace was added correctly: `/plugin marketplace list`
- Verify plugin entry in marketplace.json
- Check source path is correct
- Restart Claude Code

### Commands Not Available

**Symptoms**: Commands don't appear in `/help`

**Solutions**:
- Verify commands/ directory exists in plugin
- Check command files have .md extension
- Ensure plugin is installed and enabled
- Restart Claude Code after installation

### Agent Not Working

**Symptoms**: Agent doesn't execute or behaves incorrectly

**Solutions**:
- Check agents/ directory structure
- Verify agent .md file has proper frontmatter
- Test agent instructions are clear
- Check for syntax errors in markdown

### Hook Not Triggering

**Symptoms**: Hook doesn't execute when expected

**Solutions**:
- Verify hooks/hooks.json syntax is correct
- Check matcher regex matches your use case
- Ensure hook script is executable
- Check script path uses ${CLAUDE_PLUGIN_ROOT}

### Validation Failures

**Symptoms**: npm run validate shows errors

**Solutions**:
- Read error messages carefully
- Check JSON syntax with a validator
- Verify all required fields present
- Ensure file names use kebab-case

## Testing Best Practices

### Do

- Test all features thoroughly before submission
- Test in clean environment (fresh Claude Code session)
- Document all test cases and results
- Test with various inputs and scenarios
- Get feedback from other users if possible

### Don't

- Skip edge case testing
- Assume documentation is correct without testing
- Test only the "happy path"
- Ignore validation errors
- Rush through testing

## Performance Testing

### Test Response Time

- Commands should respond quickly (< 2 seconds for simple tasks)
- Hooks should not significantly slow operations
- Scripts should be optimized for performance

### Test Resource Usage

- Plugins shouldn't consume excessive memory
- Scripts should clean up after themselves
- No resource leaks or accumulation

## Integration Testing

### Test with Other Plugins

If users might use your plugin alongside common plugins:

1. Install common plugins
2. Install your plugin
3. Test for conflicts or issues
4. Verify features work correctly together

### Test in Different Scenarios

- Test in different types of projects
- Test with different Claude Code settings
- Test with different models if model-specific

## Reporting Test Results

When submitting a plugin, include:

1. **Test environment**:
   - Claude Code version
   - Operating system
   - Node.js version (if applicable)

2. **Test cases executed**:
   - List all features tested
   - Note any edge cases covered

3. **Test results**:
   - All tests passed
   - Any known limitations
   - Any specific requirements

4. **Validation output**:
   - Output of `npm run validate`
   - Any warnings or notices

## Continuous Testing

As Claude Code evolves:

- Retest plugins periodically
- Test with new Claude Code versions
- Update tests as features change
- Monitor user feedback and bug reports

## Getting Help

If you encounter testing issues:

- Review [Plugin Guidelines](PLUGIN_GUIDELINES.md)
- Check [Marketplace Structure](STRUCTURE.md)
- Ask in [GitHub Discussions](../../discussions)
- Report bugs in [GitHub Issues](../../issues)

## Automated CI Testing

The marketplace includes GitHub Actions workflows that automatically test:

- Marketplace structure validity
- Plugin structure compliance
- JSON syntax correctness
- Documentation completeness

These run on every PR and help catch issues early.

## See Also

- [Plugin Guidelines](PLUGIN_GUIDELINES.md) - Plugin standards and requirements
- [Marketplace Structure](STRUCTURE.md) - How marketplace is organized
- [Contributing Guidelines](../CONTRIBUTING.md) - How to contribute
- [Claude Code Testing Documentation](https://docs.claude.com/en/docs/claude-code/plugins#test-your-plugins-locally)
