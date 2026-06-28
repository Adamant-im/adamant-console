# Getting Started

`adamant-console` is a command-line, JSON-RPC, and lightweight library tool for interacting with the ADAMANT blockchain. It signs ADM transactions locally and submits signed payloads to configured ADAMANT nodes.

Use Console when you need to:

- Inspect account, block, transaction, chat, delegate, and node data
- Send ADM, messages, rich messages, and signal messages
- Register delegates and vote for delegates
- Expose Console behavior through a local JSON-RPC server
- Import small Node.js API wrappers from scripts

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

By default, Console writes `~/.adm/config.jsonc`. A local `config.jsonc` in the current working directory can also override defaults for development.

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

JavaScript library:

```js
import { getNodeHeight } from 'adamant-console/lib/api/index.js';

const height = await getNodeHeight();
console.log(height);
```

## Next Steps

- Review [Installation](./installation.md)
- Set up [Configuration](./configuration.md)
- Read the [Security guide](./security.md)
- Browse the [CLI reference](../reference/cli.md)
