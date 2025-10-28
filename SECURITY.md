# Security Policy

## Reporting a Vulnerability

The security of the Claude Code Marketplace and its plugins is important to us. If you discover a security vulnerability, please report it responsibly.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by emailing:

**[security@melodic.software]** (replace with actual security email)

Or use GitHub's private vulnerability reporting feature:

1. Go to the [Security tab](../../security)
2. Click "Report a vulnerability"
3. Fill out the form with details

### What to Include

When reporting a vulnerability, please include:

- **Type of vulnerability** (e.g., XSS, code injection, authentication bypass)
- **Affected component** (marketplace infrastructure or specific plugin)
- **Steps to reproduce** the vulnerability
- **Potential impact** of the vulnerability
- **Suggested fix** (if you have one)
- **Your contact information** (so we can follow up)

### Response Timeline

- **Initial Response**: Within 48 hours of receiving your report
- **Vulnerability Assessment**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Next regular update cycle
- **Public Disclosure**: After fix is released and users have had time to update

### Vulnerability Scope

#### In Scope

Security vulnerabilities in:

- Marketplace infrastructure (marketplace.json, validation scripts)
- Documentation that could lead to security issues
- Validation and testing workflows
- Plugin distribution mechanisms
- Plugins included in this marketplace

#### Out of Scope

- Vulnerabilities in Claude Code itself (report to Anthropic)
- Vulnerabilities in third-party plugins not in this marketplace
- Social engineering attacks
- DoS attacks requiring excessive resources
- Issues affecting only outdated/unsupported versions

### Security Best Practices for Plugin Developers

If you're developing plugins for this marketplace:

1. **Never include secrets**: No API keys, tokens, or credentials in code
2. **Validate inputs**: Always validate and sanitize user inputs
3. **Use dependencies wisely**: Keep dependencies updated and minimal
4. **Document permissions**: Clearly document required permissions
5. **Test thoroughly**: Test for common vulnerabilities (XSS, injection, etc.)
6. **Handle errors securely**: Don't expose sensitive information in error messages
7. **Use environment variables**: For sensitive configuration values

### Security Review Process

All plugins in this marketplace undergo security review:

- Code review for common vulnerabilities
- Check for hardcoded secrets
- Validation of input handling
- Review of external dependencies
- Assessment of permission requirements

### Supported Versions

| Component                | Supported          |
| ------------------------ | ------------------ |
| Marketplace (current)    | :white_check_mark: |
| Marketplace (deprecated) | :x:                |
| Plugins (current)        | :white_check_mark: |
| Plugins (deprecated)     | :x:                |

We support only the current version of marketplace infrastructure. Plugins are expected to be updated regularly.

### Security Updates

When a security vulnerability is fixed:

1. **Security Advisory**: Published on GitHub Security Advisories
2. **Plugin Updates**: Affected plugins are updated in the marketplace
3. **User Notification**: Critical vulnerabilities announced in README
4. **CVE Assignment**: For critical vulnerabilities affecting many users

### Acknowledgments

We appreciate security researchers who responsibly disclose vulnerabilities. With your permission, we'll acknowledge your contribution in:

- Security advisory
- Repository credits
- Release notes

### Safe Harbor

We support safe harbor for security researchers who:

- Make a good faith effort to avoid harm to users and data
- Don't access or modify data beyond what's necessary to demonstrate vulnerability
- Don't exploit vulnerabilities for personal gain
- Give us reasonable time to fix vulnerabilities before public disclosure
- Don't publicly disclose vulnerability details until we've fixed the issue

### Legal

By submitting a security vulnerability report, you agree that:

- You may not violate any laws in discovering the vulnerability
- You will not access, modify, or delete data without permission
- You will not perform actions that could harm availability or performance
- You will work with us in good faith to resolve the issue

### Contact

For security-related questions that aren't vulnerability reports:

- Email: [security@melodic.software]
- GitHub Discussions: [Security discussions](../../discussions/categories/security)

### Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Claude Code Security Documentation](https://docs.claude.com/en/docs/claude-code)

---

**Last Updated**: 2025-10-28

Thank you for helping keep the Claude Code Marketplace and its community safe!
