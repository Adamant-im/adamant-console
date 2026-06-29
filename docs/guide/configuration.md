# Configuration

Console loads defaults from `config.default.jsonc` and merges user overrides from `config.jsonc`.

Common config locations:

- `config.default.jsonc` in the repository
- `config.jsonc` in the current working directory
- `~/.adm/config.jsonc` created by `adm init`

## Create User Config

```sh
node bin/adamant.js init
```

The command prints the created config path and an editor command. Edit the file before sending transactions on mainnet.

## Important Fields

| Field                      | Purpose                                               |
| -------------------------- | ----------------------------------------------------- |
| `passphrase`               | Default ADM account passphrase used for local signing |
| `network`                  | Active network, either `mainnet` or `testnet`         |
| `networks.<network>.nodes` | ADAMANT node list consumed by `adamant-api`           |
| `rpc.port`                 | Local JSON-RPC HTTP server port                       |

The default network is `testnet`. Use `mainnet` only when you intend to work with real ADM funds.

## Node Lists

Node entries contain `ip`, `protocol`, and `port`. Console composes these into node URLs through `utils/api.js` and passes them to `adamant-api`.

When updating ADM node lists, use the canonical metadata from [`adamant-wallets/assets/general/adamant/info.json`](https://github.com/Adamant-im/adamant-wallets/blob/dev/assets/general/adamant/info.json).

## Passphrase Overrides

You can override the configured passphrase for one CLI invocation:

```sh
adm --passphrase "your local passphrase" send tokens U123456789 1ADM
```

Avoid passphrase flags in shared terminals because shell history can persist command arguments. Prefer private local config files with restrictive filesystem permissions.

## Startup Health Check

Interactive mode checks configured node health before accepting the first command:

```sh
node bin/adamant.js
```

One-shot commands skip this startup check. To disable the interactive startup check:

```sh
ADM_CHECK_HEALTH_AT_STARTUP=0 node bin/adamant.js
```
