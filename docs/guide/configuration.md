# Configuration

Console and the JSON-RPC server use the same config resolver. The process starts from the packaged `config.default.jsonc`, then uses the first user file that exists:

1. `$ADM_CONFIG_PATH/$ADM_CONFIG_FILENAME` when those variables are set, otherwise `~/.adm/config.jsonc`
2. `./config.jsonc` in the current working directory, or `./$ADM_CONFIG_FILENAME` when that variable is set
3. The packaged `config.default.jsonc` when neither user file exists

The first existing user file wins and is merged over the packaged defaults. A project-local `config.jsonc` is not loaded when `~/.adm/config.jsonc` already exists. The working directory matters because lookup happens when the process starts, including `adm rpc server`.

Check the resolved file before sending funds:

```sh
adm client
```

`adm client` and `adm client version` print the same summary: Console version, config path, network, and account address. The JSON-RPC server prints that path, network, and account when it starts. The summary does not include the passphrase.

`adm init` without a path writes `~/.adm/config.jsonc`. That file contains the placeholder passphrase from `config.default.jsonc` until you edit it. A placeholder passphrase is treated as unset and does not derive an account address.

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
| `rpc.port`                 | Local JSON-RPC HTTP server port, default `5080`       |

The default network is `testnet`. Use `mainnet` only when you intend to work with real ADM funds.

## JSON-RPC Port

`rpc.port` defaults to `5080`. The server binds that port on the machine. Run a second server only after changing `rpc.port` in the config file that the process actually loads. Confirm the file with `adm client` from the same working directory and environment you use to start the server.

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
