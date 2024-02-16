# Adamant-console

Adamant-console is Command-line utilities to interact with ADAMANT blockchain. It allows you to run commands like send tokens, create new address and get information.

## Understanding interaction with ADAMANT blockchain

ADAMANT has _only secure API_, and you cannot transfer passphrase to node to make any action with wallet. Instead, node _requires signed transaction_ to make any action.

Adamant-console connects to ADAMANT nodes on your choice (set in configuration file), it can be any node, locally installed on your machine, or from other side of the Earth. As Console doesn’t transfer passphrases to nodes, it's safe to connect to any node. Node you connect should have [API enabled](https://medium.com/adamant-im/how-to-run-your-adamant-node-on-ubuntu-990e391e8fcc#fe7e).

You can use any programming languages to interact with Adamant-console, like PHP, Python, NodeJS, bash.

Alternative ways to interact with ADAMANT blockchain:

- [Direct node's API](https://github.com/Adamant-im/adamant/wiki)
- [JS API library](https://github.com/Adamant-im/adamant-api-jsclient/wiki)

## Installing and configuring

The installation and configuration are described in [Adamant-console Wiki](https://github.com/Adamant-im/adamant-console/wiki/Installation-and-configuration).

Note, by default, `network` parameter set to `testnet`. If you want to work with mainnet, set the value to `mainnet`.

## Using Console

There are 3 ways of using ADAMANT Console tool:

- Command-line interface (CLI). List of available for commands see in [Adamant-console Wiki](https://github.com/Adamant-im/adamant-console/wiki/Available-Commands).
- JSON-RPC. To use this interface, [start JSON-RPC daemon](https://github.com/Adamant-im/adamant-console/wiki/JSON-RPC) on Adamant-console.
- Directly through the built-in library. The available methods see in [Adamant-console Wiki](https://github.com/Adamant-im/adamant-console/wiki/Running-Commands-in-Adamant-library) also.

See [Running Commands in Adamant console](https://github.com/Adamant-im/adamant-console/wiki/Running-Commands-in-Adamant-console).

## Integration notes with ADM token for Exchanges

See [Integration notes with ADM token for Exchanges](https://medium.com/adamant-im/integration-notes-with-adm-token-for-exchanges-d51a80c36aaf). Document describes how to create accounts for deposits, get balances and transactions info, as well as, how to make withdrawals.
