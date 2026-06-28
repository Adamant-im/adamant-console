---
layout: home

hero:
  name: ADAMANT Console
  text: CLI and JSON-RPC tool for ADAMANT
  tagline: Sign transactions locally, inspect ADAMANT nodes, and automate Console workflows without moving passphrases off your machine.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: CLI Reference
      link: /reference/cli
    - theme: alt
      text: View on GitHub
      link: https://github.com/Adamant-im/adamant-console

features:
  - title: Local signing
    details: Account passphrases stay local while signed payloads are submitted to configured ADAMANT nodes.
    link: /guide/security
    linkText: Security guide
  - title: CLI workflows
    details: Use the interactive prompt or one-shot commands for account, node, send, get, delegate, and vote operations.
    link: /reference/cli
    linkText: CLI reference
  - title: Configuration
    details: Configure passphrase storage, mainnet/testnet nodes, and the local JSON-RPC port from JSONC files.
    link: /guide/configuration
    linkText: Configuration guide
  - title: JSON-RPC daemon
    details: Expose Console commands through a local JSON-RPC server for automation from other tools and languages.
    link: /reference/json-rpc
    linkText: JSON-RPC reference
  - title: Transaction queries
    details: Filter transaction history with Console query fragments backed by adamant-api v3 query normalization.
    link: /reference/transactions-query-language
    linkText: Query language
  - title: JSON answers
    details: Read the response shapes returned by CLI and JSON-RPC commands before wiring Console into scripts.
    link: /reference/json-answer-formats
    linkText: JSON answer formats
---

## Documentation Scope

These docs cover `adamant-console` behavior: commands, config, JSON-RPC methods, and Console-specific response handling. Protocol-level concepts, node endpoints, account formats, and blockchain rules remain in the umbrella [ADAMANT documentation](https://docs.adamant.im/). For programmatic JavaScript integrations, use [ADAMANT JavaScript API](https://js.docs.adamant.im/).

## Quick Links

- [Install Console](./guide/installation.md)
- [Configure networks and passphrases](./guide/configuration.md)
- [Run CLI commands](./reference/cli.md)
- [Filter transactions](./reference/transactions-query-language.md)
- [Read JSON answer formats](./reference/json-answer-formats.md)
- [Run JSON-RPC](./reference/json-rpc.md)
- [Use Console JS wrappers](./reference/js-library.md)
- [Generated API reference](./reference/api/index.md)
