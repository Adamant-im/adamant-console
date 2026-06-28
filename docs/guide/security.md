# Security

Console is designed so passphrases stay local. Transaction signing, message encryption, and key derivation happen through `adamant-api` on the machine running Console.

## Sensitive Data Rules

Never log, print, commit, or paste:

- ADM passphrases
- Private keys
- Mnemonic seeds
- Decrypted private messages
- Private `config.jsonc` files

`config.jsonc` is git-ignored and should remain local to the machine that uses it.

## Sending Transactions

Sending commands use the configured passphrase unless a one-shot `--passphrase` override is provided:

```sh
adm send tokens U123456789 1ADM
adm send message U123456789 "hello"
```

When a passphrase override is unavoidable, run it only in a trusted shell:

```sh
adm --passphrase "your local passphrase" send tokens U123456789 1ADM
```

Shell history, process listings, shared terminal logs, and CI output can expose command arguments. Do not use real passphrases in examples, issue reports, screenshots, or logs.

## Node Communication

Console submits signed payloads to configured ADAMANT nodes. Passphrases and private keys must not be sent to nodes. Node responses can fail, lag, or return stale data, so integrations should check `success`, `error`, and response fields before trusting data.

## JSON-RPC Server

The JSON-RPC server listens on the configured port:

```sh
node bin/adamant.js rpc server
```

Run it only on trusted hosts and networks. The server exposes methods that can send transactions when passphrases are configured or supplied in method parameters.

## Dependency Installs

Install with lifecycle scripts disabled by default:

```sh
npm ci --ignore-scripts
npm install --ignore-scripts
```

Do not enable install scripts globally. Review package metadata before adding new dependencies.
