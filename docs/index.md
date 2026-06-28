---
layout: home

hero:
  name: ADAMANT Console
  text: CLI, JSON-RPC, and JavaScript library for ADAMANT
  tagline: Sign transactions locally, inspect ADAMANT nodes, and automate Console workflows without moving passphrases off your machine.
  actions:
    - theme: brand
      text: Get Started
      link: /guide/getting-started
    - theme: alt
      text: CLI Reference
      link: /reference/cli

features:
  - title: Local signing
    details: Account passphrases stay local while signed payloads are submitted to configured ADAMANT nodes.
  - title: Multiple usage modes
    details: Use the interactive prompt, one-shot CLI commands, JSON-RPC daemon, or lightweight Node.js library entry point.
  - title: Repository-owned docs
    details: Guides and references live with the code, build in CI, and deploy to GitHub Pages.
---

## Documentation Scope

These docs cover `adamant-console` behavior: commands, config, JSON-RPC methods, and exported JavaScript helpers. Protocol-level concepts, node endpoints, account formats, and blockchain rules remain in the umbrella [ADAMANT documentation](https://docs.adamant.im/).

## Quick Links

- [Install Console](./guide/installation.md)
- [Configure networks and passphrases](./guide/configuration.md)
- [Run CLI commands](./reference/cli.md)
- [Filter transactions](./reference/transactions-query-language.md)
- [Read JSON answer formats](./reference/json-answer-formats.md)
- [Run JSON-RPC](./reference/json-rpc.md)
- [Use the JS library](./reference/js-library.md)
- [Generated API reference](./reference/api/index.md)
