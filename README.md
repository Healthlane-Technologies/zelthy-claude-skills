# zelthy-claude-skills

A Claude Code plugin marketplace by [Healthlane Technologies](https://zelthy.com), providing skills for Zango app development.

## Installation

**Step 1 — Add this repo as a marketplace:**

```bash
claude plugin marketplace add Healthlane-Technologies/zelthy-claude-skills
```

**Step 2 — Install the plugin:**

```bash
claude plugin install zango-app-developer@zelthy
```

## Available Plugins

### `zango-app-developer`

Full-stack Zango app development — bootstrap Docker environments, create apps, build modules with CRUD, workflows, and a React frontend.

Activates automatically when working on a Zango project, or invoke it directly:

```
/zango-app-developer bootstrap a new Zango environment
```

## Managing Plugins

```bash
# List installed plugins
claude plugin list

# Update to the latest version
claude plugin update zango-app-developer@zelthy

# Uninstall
claude plugin uninstall zango-app-developer@zelthy
```
