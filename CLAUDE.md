# pkg-zango-skill

Zango platform skills and documentation website.

## For Maintainers

```bash
cd frontend && npm install --legacy-peer-deps && npm run dev    # Docs website
node scripts/generate-reference.js                               # Regenerate references
bash scripts/setup-skills.sh /path/to/project                   # Install in a project
```

## Structure
```
├── skills/
│   ├── zango-frontend/    # All frontend development
│   ├── app-panel/         # Browser automation for admin panel
│   └── skill-creator/     # Create/improve skills (Anthropic)
├── references/            # Shared reference files (auto-generated)
├── scripts/               # Setup + generator scripts
└── frontend/              # Documentation website (source of truth)
```
