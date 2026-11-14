# Getting Started

`adamant-console` is a command-line and JSON-RPC tool for interacting with the ADAMANT blockchain. It signs ADM transactions locally and submits signed payloads to configured ADAMANT nodes.

Use Console when you need to:

- Inspect account, block, transaction, chat, delegate, and node data
- Send ADM, messages, rich messages, and signal messages
- Register delegates and vote for delegates
- Expose Console behavior through a local JSON-RPC server

## Requirements

- Node.js 22.13.0 or newer
- npm 10 or newer

## Install Dependencies

For repository development:

```sh
npm ci --ignore-scripts
```

If dependency metadata changes and the lockfile must be updated:

```sh
npm install --ignore-scripts
```

Do not enable lifecycle scripts globally. If a dependency requires a trusted build step, run a targeted documented rebuild for that package only.

## Initialize Config

Create a user config:

```sh
node bin/adamant.js init
```

By default, Console writes `~/.adm/config.jsonc`. If that file exists, it is used even when `./config.jsonc` is also present. See [Configuration](./configuration.md) for the full lookup order. `adm client` prints the file the process loaded.

## Run Console

Interactive prompt:

```sh
node bin/adamant.js
```

One-shot command:

```sh
node bin/adamant.js node height
```

Installed npm binary:

```sh
adm node height
```

JSON-RPC daemon:

```sh
node bin/adamant.js rpc server
```

Send a small test amount with an `ADM` suffix. A bare decimal is rejected:

```sh
adm send tokens U123456789 0.001ADM
```

`0.001` is not valid. `100000` is 100000 token units, which is 0.001 ADM, because 1 ADM is 100000000 units. Details are in the [CLI reference](../reference/cli.md).

## Next Steps

- Review [Installation](./installation.md)
- Set up [Configuration](./configuration.md)
- Read the [Security guide](./security.md)
- Browse the [CLI reference](../reference/cli.md)
