# ADAMANT Console

`adamant-console` is a command-line, JSON-RPC, and lightweight library tool for interacting with the ADAMANT blockchain. It signs ADM transactions locally and submits signed payloads to configured ADAMANT nodes.

Passphrases never need to be sent to a node. Keep passphrases, private keys, decrypted messages, and local config files out of logs and shared terminals.

Full Console documentation is published at [console.docs.adamant.im](https://console.docs.adamant.im/).

## Features

- Interactive `adm` prompt for common account, node, send, get, delegate, and vote commands
- One-shot CLI commands for scripts and operations
- Library entry point for Node.js consumers
- JSON-RPC server for integration from other languages and services
- Local ADM account generation, signing, voting, token transfers, and encrypted messages
- Configurable mainnet/testnet node lists and RPC port
- Shared ADAMANT Node API v0.10.0 behavior through [`adamant-api`](https://github.com/Adamant-im/adamant-api-jsclient)

## Requirements

- Node.js 22.13.0 or newer
- npm 10 or newer

## Installation

```sh
npm ci
```

For local development after dependency changes:

```sh
npm install
```

## Configuration

Create a user config from the bundled default:

```sh
node bin/adamant.js init
```

By default, the file is created as `~/.adm/config.jsonc`. You can also keep `config.jsonc` in the current working directory for local overrides.

Important fields:

| Field                      | Purpose                                         |
| -------------------------- | ----------------------------------------------- |
| `passphrase`               | Default ADM account passphrase used for signing |
| `network`                  | `mainnet` or `testnet`                          |
| `networks.<network>.nodes` | ADAMANT nodes used by `adamant-api`             |
| `rpc.port`                 | JSON-RPC HTTP server port                       |

The default network is `testnet`. Update `network` to `mainnet` only when you intend to use real ADM funds.

When updating ADM node lists, use the canonical metadata in [`adamant-wallets/assets/general/adamant/info.json`](https://github.com/Adamant-im/adamant-wallets/blob/dev/assets/general/adamant/info.json).

## CLI Usage

Run the interactive prompt:

```sh
node bin/adamant.js
```

Run one-shot commands:

```sh
node bin/adamant.js client version
node bin/adamant.js node height
node bin/adamant.js node version
node bin/adamant.js node status
node bin/adamant.js account new
node bin/adamant.js get address U123456789
node bin/adamant.js get transaction 123456789
node bin/adamant.js get transaction 123456789 returnUnconfirmed=1
node bin/adamant.js get delegate U11651572364276578835
node bin/adamant.js get chats U123456789 includeDirectTransfers=1
node bin/adamant.js get chat U123456789 U987654321 returnUnconfirmed=1
node bin/adamant.js send tokens U123456789 110020030
node bin/adamant.js send tokens U123456789 1.1ADM
node bin/adamant.js send message U123456789 "hello"
node bin/adamant.js vote for +delegatePublicKey
```

The npm package exposes the `adm` binary:

```sh
adm node height
```

You can override the configured passphrase for a single CLI invocation:

```sh
adm --passphrase "your local passphrase" send tokens U123456789 1
```

Avoid shell history exposure when using passphrase flags in shared environments.

### Startup Health Check

Interactive mode checks configured node health before the first command, so users can see node availability early:

```sh
node bin/adamant.js
```

One-shot commands skip this startup check. To disable it explicitly, set:

```sh
ADM_CHECK_HEALTH_AT_STARTUP=0 node bin/adamant.js
```

## JSON-RPC Usage

Start the JSON-RPC server:

```sh
node bin/adamant.js rpc server
```

The server listens on `config.rpc.port` and exposes methods that match the existing Console API surface, including:

- `clientVersion`
- `accountNew`
- `delegateNew`
- `getAddress`
- `getBlock`
- `getBlocks`
- `getChats`
- `getChatMessages`
- `getChatTransactions`
- `getDelegate`
- `getMessage`
- `getTransaction`
- `getTransactions`
- `getTransactionsInBlockById`
- `getTransactionsInBlockByHeight`
- `getTransactionsReceivedByAddress`
- `nodeHeight`
- `nodeStatus`
- `nodeVersion`
- `sendTokens`
- `sendMessage`
- `sendRich`
- `sendSignal`
- `voteFor`

Array-style methods accept JSON-RPC `params` as an array. Template-style send and vote methods accept named object parameters.

## Library Usage

Import the lightweight API wrappers from Node.js:

```js
import { getNodeHeight, sendMessage } from 'adamant-console/lib/api/index.js';

const height = await getNodeHeight();
console.log(height);

const result = await sendMessage(
  'U123456789',
  'hello',
  undefined,
  'local passphrase',
);
console.log(result.transactionId);
```

Use [`adamant-api`](https://js.docs.adamant.im/) directly for lower-level protocol features, typed DTOs, metadata, WebSocket subscriptions, and advanced transaction handling.

The Console wrappers preserve Node v0.10.0 response fields, including numeric `count`, transaction `timestampMs`, and unconfirmed transaction fields returned with `returnUnconfirmed=1`. Chat query helpers send `includeDirectTransfers`; the deprecated `withoutDirectTransfers` input is accepted only as a compatibility alias and normalized before calling `adamant-api`.

## Development

```sh
npm ci --ignore-scripts
npm run lint
npm run format:check
npm test
```

Useful scripts:

| Script                 | Purpose                                     |
| ---------------------- | ------------------------------------------- |
| `npm run lint`         | Check JavaScript with ESLint flat config    |
| `npm run lint:fix`     | Apply safe ESLint fixes                     |
| `npm run format`       | Format repository files with Prettier       |
| `npm run format:check` | Check Prettier formatting                   |
| `npm test`             | Run Node.js test discovery                  |
| `npm run docs:api`     | Generate the library API reference          |
| `npm run docs:dev`     | Generate API docs and run VitePress locally |
| `npm run docs:build`   | Generate API docs and build the docs site   |
| `npm run docs:preview` | Preview the built docs site after a build   |

This project intentionally stays small. Prefer focused changes over framework migrations, and keep CLI command names, JSON-RPC method names, config fields, and library exports stable unless a task explicitly approves a breaking change.

## Security Notes

- Passphrases are used locally to derive keys and sign transactions
- Private keys, passphrases, and decrypted message content must not be logged or transmitted
- `config.jsonc` is user-local and must not be committed
- Node responses can fail or be stale; check `success` and error fields before trusting data
- POST retries and signing behavior are owned by `adamant-api`

## Links

- [ADAMANT website](https://adamant.im/)
- [ADAMANT Console docs](https://console.docs.adamant.im/)
- [ADAMANT documentation](https://docs.adamant.im/)
- [ADAMANT Improvement Proposals](https://aips.adamant.im/all)
- [AIPs source](https://github.com/Adamant-im/AIPs)
- [ADAMANT Node](https://github.com/Adamant-im/adamant)
- [ADAMANT API schema](https://schema.adamant.im/)
- [ADAMANT schema source](https://github.com/Adamant-im/adamant-schema)
- [ADAMANT JavaScript API](https://github.com/Adamant-im/adamant-api-jsclient)
- [ADAMANT JavaScript API docs](https://js.docs.adamant.im/)
- [ADAMANT wallet metadata](https://github.com/Adamant-im/adamant-wallets)
- [ADAMANT blockchain explorer](https://explorer.adamant.im/)
- [Console issues](https://github.com/Adamant-im/adamant-console/issues)
- [Historical Console wiki](https://github.com/Adamant-im/adamant-console/wiki)

## License

GPL-3.0
