# ADAMANT Console: AI Agent Operating Manual

This document defines how AI agents must work in this repository.

## Mission

`adamant-console` is a Node.js command-line and JSON-RPC tool for interacting with the ADAMANT blockchain. It signs transactions locally (passphrases never leave the machine) and submits them to configurable ADAMANT nodes.

Agent output must optimize for:

1. Correctness and backward compatibility of CLI, RPC, and library interfaces
2. Security — passphrases and keys must never be logged or transmitted
3. Simplicity — the codebase is intentionally lightweight; avoid over-engineering

> The codebase is known to be outdated and will be updated. Prefer targeted, minimal fixes over broad rewrites.

## Language Policy

- Developers may communicate with AI in any language
- All repository artifacts (code, comments, docs, commit messages, PR text) must be in English only

## Project Structure

```
bin/
  adamant.js        # CLI entrypoint — registers all commands via Commander.js
  init.js           # Initialization helper (config setup)
lib/
  account.js        # CLI: account new
  get.js            # CLI: get address/block/blocks/delegate/message/...
  send.js           # CLI: send tokens/message/rich/signal
  node.js           # CLI: node status commands
  delegate.js       # CLI: delegate commands
  vote.js           # CLI: vote commands
  rpc.js            # JSON-RPC server (jayson)
  api/
    index.js        # JS library entrypoint (re-exports all API modules)
    account.js      # createAccount
    get.js          # getAddress, getBlock, getBlocks, getDelegate, getMessage, ...
    send.js         # sendTokens, sendMessage, sendRich, sendSignal
    node.js         # node info API
    delegate.js     # delegate API
    vote.js         # vote API
prompt/
  index.js          # Interactive REPL prompt
  history.js        # Command history for interactive mode
utils/
  api.js            # Creates AdamantApi instance from config (adamant-api package)
  config.js         # Loads and merges config.jsonc / config.default.jsonc
  log.js            # Output helper
  validate.js       # Input validation helpers
  package.js        # Reads package.json metadata
config.default.jsonc  # Default config: passphrase, network, nodes, rpc port
config.jsonc          # User-local config (git-ignored; overrides defaults)
```

### Usage modes

| Mode | Entry | Description |
|---|---|---|
| CLI (interactive) | `node bin/adamant.js` | REPL with history |
| CLI (one-shot) | `node bin/adamant.js <command>` | Single command, then exit |
| JSON-RPC daemon | `node bin/adamant.js rpc server` | jayson server on configured port |
| JS library | `import * as api from 'adamant-console/lib/api/index.js'` | Programmatic use |

### Key dependency

`adamant-api` npm package (`utils/api.js`) wraps all ADAMANT node HTTP calls and transaction signing. Check its README before changing API interaction patterns.

## Configuration

`config.default.jsonc` defines the schema; `config.jsonc` is the user override (git-ignored). Key fields:

- `passphrase` — ADM account passphrase (private; never log or transmit)
- `network` — `"mainnet"` or `"testnet"`
- `networks.mainnet.nodes` / `networks.testnet.nodes` — list of node objects with `ip`, `protocol`, and `port` fields (composed into URLs in `utils/api.js`)
- `rpc.port` — JSON-RPC server port (default `5080`)

**When updating node lists**, refer to the canonical ADM node specification in [`adamant-wallets`](https://github.com/Adamant-im/adamant-wallets) — the `assets/adm/` directory contains the current mainnet and testnet node lists, health-check intervals, and `alt_ip` fallbacks used across all ADAMANT apps.

## Common Commands

```bash
# Install dependencies
npm install

# Run CLI interactively
node bin/adamant.js

# Run a single CLI command
node bin/adamant.js send tokens U123456789 1
node bin/adamant.js get address U123456789
node bin/adamant.js account new

# Start JSON-RPC daemon
node bin/adamant.js rpc server

# Lint (check)
npm run lint

# Lint (auto-fix)
npm run lint:fix

# Format with Prettier
npm run format
```

## Issue, Label, and PR Conventions

Follow organization-wide conventions:

- Governance: <https://github.com/Adamant-im/.github>
- Title prefix guidance: <https://github.com/orgs/Adamant-im/discussions/5>
- Label catalog: <https://github.com/orgs/Adamant-im/discussions/1>

### Issue title prefixes (one or two maximum)

- `[Bug]` — bug, crash, wrong behavior
- `[Feat]` — new functionality
- `[Enhancement]` — improvement of existing functionality
- `[Refactor]` — internal refactoring without behavior change
- `[Docs]` — documentation updates
- `[Test]` — testing work
- `[Chore]` — maintenance and routine tasks
- `[Task]` — general task
- `[Composite]` — multi-part task with sub-tasks

### Label policy

Apply a minimal but informative set: one type label (`Task`, `bug`, `enhancement`) + one or more domain labels (`NodeJS`, `APIs`, `Nodes`, `JavaScript`, `documentation`, `Guideline`, etc.).

### PR title format

Use Conventional Commits style: `Type: Short summary` — for example `Docs: Add AGENTS.md`. No square brackets in PR titles.

### CLI workflow for multi-line content

Always use file-based flags and `.ai-ignored/` for temp files — avoid inline multi-line shell strings:

```bash
gh issue create \
  --body-file .ai-ignored/temp.YYYY-MM-DD.issue-body.md \
  --label "Task,documentation"

gh pr create \
  --body-file .ai-ignored/temp.YYYY-MM-DD.pr-description.md
```

`.ai-ignored/` is git-ignored. Use dated filenames; cleanup is optional.

## Security Rules

- **Never** log, print, or expose passphrases, private keys, or mnemonic seeds — not in output, errors, or debug logs
- Private keys are derived and used locally; they are never sent to nodes
- Keep input validation strict for all CLI arguments and config values (`utils/validate.js`)
- Do not introduce dynamic code execution, unsafe deserialization, or unvalidated shell execution paths
- Do not weaken or bypass existing validation in `adamant-api`

## AI Change Workflow

1. Read the relevant modules before editing
2. Identify invariants that must stay unchanged (command interface, RPC method signatures, config schema, library exports)
3. Make the smallest safe change
4. Run `npm run lint` on touched files
5. Report risks, assumptions, and any intentional scope cuts

## Definition of Done

A change is done when:

- Existing CLI, RPC, and library interfaces behave correctly
- `npm run lint` passes on touched files
- All repository artifacts are in English
- No passphrase, key, or sensitive data exposure was introduced

## Related Repositories

| Repository | Relevance |
|---|---|
| [`adamant`](https://github.com/Adamant-im/adamant) | ADAMANT blockchain node — the server `adamant-console` talks to; see also its [`AGENTS.md`](https://github.com/Adamant-im/adamant/blob/dev/AGENTS.md) for node-level rules |
| [`adamant-api-jsclient`](https://github.com/Adamant-im/adamant-api-jsclient) | The `adamant-api` npm package used in `utils/api.js` — source for API interaction behavior |
| [`adamant-wallets`](https://github.com/Adamant-im/adamant-wallets) | Canonical coin/token specification for all ADAMANT apps — contains the authoritative ADM **mainnet and testnet node lists** (`assets/adm/`), node health-check parameters, and `alt_ip` fallbacks; reference when updating `config.default.jsonc` node entries |
| [`adamant-im`](https://github.com/Adamant-im/adamant-im) | ADAMANT Messenger PWA — another client for the same blockchain; useful reference for protocol usage patterns |
| [ADAMANT docs](https://docs.adamant.im) | Node API reference, account/transaction formats, and protocol details |
