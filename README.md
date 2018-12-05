
Command-line utilities to work with ADAMANT blockchain.

# Understanding interaction with ADAMANT blockchain

Use Adamant-console for interaction with ADAMANT blockchain. 

ADAMANT node is based on Lisk 0.9 code, but with important difference. ADAMANT has *only secure API*, and you cannot transfer passphrase to node to make any action with wallet, like Lisk 0.9 does. Instead, node *requires signed transaction* to make any action.

Adamant-console connects to ADAMANT nodes on your choice (set in configuration file), it can be any node, locally installed on your machine, or from other side of the Earth. As Console doesn’t transfer passphrases to nodes, it is safe to connect to any node. Important thing, node you connect should have [API enabled](https://medium.com/adamant-im/how-to-run-your-adamant-node-on-ubuntu-990e391e8fcc#fe7e).

So, your exchange do not need ADAMANT node installed, while you still can [do that](https://medium.com/adamant-im/how-to-run-your-adamant-node-on-ubuntu-990e391e8fcc).

You can use any programming languages to interact with Adamant-console, like PHP, Python, NodeJS, bash.

# Installing and configuring Adamant-console

The installation and configuration are described in [Adamant-console Wiki](https://github.com/Adamant-im/adamant-console/wiki/Installation-and-configuration).

# Commands

There are two ways of interacting with ADAMANT blockchain. You can use *command-line interface (CLI)* or *JSON-RPC* on your choice. See [Running Commands in Adamant console](https://github.com/Adamant-im/adamant-console/wiki/Running-Commands-in-Adamant-console).

List of available for *CLI* commands see in [Adamant-console Wiki](https://github.com/Adamant-im/adamant-console/wiki/Available-Commands) also.

To use *JSON-RPC* interface, [start JSON-RPC daemon](https://github.com/Adamant-im/adamant-console/wiki/JSON-RPC) on Adamant-console.

# Integration notes with ADM token for Exchanges

