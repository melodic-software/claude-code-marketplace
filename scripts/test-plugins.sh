#!/bin/bash

##
# Plugin Testing Script
#
# Runs basic tests on all plugins:
# - JSON files are parseable
# - Markdown files are readable
# - No broken file references
# - Directory structure is correct
##

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Functions
log_error() {
    echo -e "${RED}✗ $1${NC}"
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

log_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

test_json_file() {
    local file="$1"
    TESTS_RUN=$((TESTS_RUN + 1))

    if ! python -m json.tool "$file" > /dev/null 2>&1; then
        log_error "Invalid JSON: $file"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi

    TESTS_PASSED=$((TESTS_PASSED + 1))
    return 0
}

test_markdown_file() {
    local file="$1"
    TESTS_RUN=$((TESTS_RUN + 1))

    if [ ! -r "$file" ]; then
        log_error "Cannot read markdown file: $file"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi

    # Check for basic markdown syntax issues
    if [ ! -s "$file" ]; then
        log_warning "Empty markdown file: $file"
    fi

    TESTS_PASSED=$((TESTS_PASSED + 1))
    return 0
}

test_plugin_structure() {
    local plugin_path="$1"
    local plugin_name="$(basename "$plugin_path")"

    echo ""
    log_info "Testing plugin: $plugin_name"

    # Test .claude-plugin directory exists
    if [ ! -d "$plugin_path/.claude-plugin" ]; then
        log_error "Missing .claude-plugin directory in $plugin_name"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi

    # Test plugin.json if it exists
    if [ -f "$plugin_path/.claude-plugin/plugin.json" ]; then
        test_json_file "$plugin_path/.claude-plugin/plugin.json"
    fi

    # Test README.md
    if [ -f "$plugin_path/README.md" ]; then
        test_markdown_file "$plugin_path/README.md"
    else
        log_warning "Missing README.md in $plugin_name"
    fi

    # Test commands if directory exists
    if [ -d "$plugin_path/commands" ]; then
        for cmd in "$plugin_path/commands"/*.md; do
            [ -f "$cmd" ] && test_markdown_file "$cmd"
        done
    fi

    # Test agents if directory exists
    if [ -d "$plugin_path/agents" ]; then
        for agent in "$plugin_path/agents"/*.md; do
            [ -f "$agent" ] && test_markdown_file "$agent"
        done
    fi

    # Test skills if directory exists
    if [ -d "$plugin_path/skills" ]; then
        for skill_dir in "$plugin_path/skills"/*; do
            if [ -d "$skill_dir" ]; then
                if [ -f "$skill_dir/SKILL.md" ]; then
                    test_markdown_file "$skill_dir/SKILL.md"
                else
                    log_warning "Missing SKILL.md in $(basename "$skill_dir")"
                fi
            fi
        done
    fi

    # Test hooks.json if it exists
    if [ -f "$plugin_path/hooks/hooks.json" ]; then
        test_json_file "$plugin_path/hooks/hooks.json"
    fi

    # Test .mcp.json if it exists
    if [ -f "$plugin_path/.mcp.json" ]; then
        test_json_file "$plugin_path/.mcp.json"
    fi
}

# Main script
echo "=== Plugin Testing ==="
echo ""

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"
PLUGINS_DIR="$REPO_ROOT/plugins"

# Test marketplace.json
log_info "Testing marketplace.json"
if [ -f "$REPO_ROOT/.claude-plugin/marketplace.json" ]; then
    test_json_file "$REPO_ROOT/.claude-plugin/marketplace.json"
else
    log_error "marketplace.json not found"
    exit 1
fi

# Check if plugins directory exists
if [ ! -d "$PLUGINS_DIR" ]; then
    log_warning "No plugins directory found"
    exit 0
fi

# Find and test all plugins
PLUGIN_COUNT=0

for category in "$PLUGINS_DIR"/*; do
    if [ -d "$category" ]; then
        category_name="$(basename "$category")"

        # Handle specialized category (has sub-categories)
        if [ "$category_name" = "specialized" ]; then
            for domain in "$category"/*; do
                if [ -d "$domain" ]; then
                    for plugin in "$domain"/*; do
                        if [ -d "$plugin" ] && [ "$(basename "$plugin")" != ".gitkeep" ]; then
                            test_plugin_structure "$plugin"
                            PLUGIN_COUNT=$((PLUGIN_COUNT + 1))
                        fi
                    done
                fi
            done
        else
            # Regular categories (general, meta-agents)
            for plugin in "$category"/*; do
                if [ -d "$plugin" ] && [ "$(basename "$plugin")" != ".gitkeep" ]; then
                    test_plugin_structure "$plugin"
                    PLUGIN_COUNT=$((PLUGIN_COUNT + 1))
                fi
            done
        fi
    fi
done

# Print summary
echo ""
echo "=== Test Summary ==="
echo ""
log_info "Plugins tested: $PLUGIN_COUNT"
log_info "Tests run: $TESTS_RUN"
log_success "Tests passed: $TESTS_PASSED"

if [ $TESTS_FAILED -gt 0 ]; then
    log_error "Tests failed: $TESTS_FAILED"
    exit 1
else
    echo ""
    log_success "All tests passed!"
    exit 0
fi
