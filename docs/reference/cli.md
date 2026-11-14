# CLI Reference

The CLI entry point is `bin/adamant.js`. The npm package exposes it as `adm`.

```sh
node bin/adamant.js <type> <command> [options]
adm <type> <command> [options]
```

Global option:

| Option                      | Purpose                                                        |
| --------------------------- | -------------------------------------------------------------- |
| `-p, --passphrase <phrase>` | Override the configured account passphrase for this invocation |

## Client

```sh
adm client
adm client version
```

`adm client` with no subcommand prints the same summary as `adm client version`: Console version, resolved config path, network, and account address. The summary does not include the passphrase.

## Account

```sh
adm account new
```

Creates a new ADAMANT account and prints account data in JSON format. The response includes `passphrase` and `privateKey`. Do not log, share, or commit that output.

## Node

```sh
adm node height
adm node version
adm node status
```

These commands inspect the configured ADAMANT node. `node status` returns aggregated node, network, loader, and WebSocket status.

## Get

```sh
adm get address U123456789
adm get block 123456789
adm get blocks limit=10
adm get blocks orderBy=height:desc,limit=5
adm get delegate lynx
adm get delegate U11651572364276578835
adm get chats U123456789
adm get chats U123456789 includeDirectTransfers=1
adm get chat U123456789 U987654321
adm get chat U123456789 U987654321 returnUnconfirmed=1
adm get message 123456789
adm get transaction 123456789
adm get transaction 123456789 returnUnconfirmed=1
adm get transactions senderId=U123456789
adm get transactions recipientId=U123456789,limit=10
adm get transactions 'types=0&orderBy=timestamp:desc&returnUnconfirmed=1'
```

Query arguments use ADAMANT Node query parameters. For `get transactions`, combine fragments with `,` or `&`. Prefix a parameter with `and:` or `or:` for explicit logical grouping.

Delegate usernames and addresses are resolved on the configured network. `lynx` is a well-known mainnet delegate name and does not resolve on testnet unless that delegate is registered there. Public keys avoid that lookup.

`adm get chat` returns chat messages with the ciphertext still in `asset.chat`. It does not add a decoded field. `adm get message <transactionId>` loads one message transaction and sets `transaction.decoded` when the configured passphrase can decrypt it.

See [Transactions Query Language](./transactions-query-language.md) for filter fields and examples.

## Send

```sh
adm send tokens U123456789 0.001ADM
adm send tokens U123456789 1ADM
adm send tokens U123456789 100000
adm send message U123456789 "hello"
adm send message U123456789 "hello" 0.1ADM
adm send rich U123456789 '{"type":"reply","text":"hello"}'
adm send signal U123456789 '{"type":"typing","value":true}'
```

Amount format for `send tokens` and the optional `send message` amount:

| Form        | Meaning                                                                             |
| ----------- | ----------------------------------------------------------------------------------- |
| `0.001ADM`  | 0.001 ADM                                                                           |
| `1 ADM`     | 1 ADM. A space before `ADM` is accepted                                             |
| `100000`    | 100000 token units, which is 0.001 ADM                                              |
| `100000000` | 1 ADM in token units                                                                |
| `0.001`     | Rejected. The error tells you to use `0.001ADM` or an integer number of token units |

1 ADM is 100000000 token units (8 decimal places). There is no `NADM` suffix. A bare integer is the raw token-unit amount, not a whole ADM value, so `1` sends 1 unit rather than 1 ADM. JSON-RPC accepts the same strings. An integer JSON number is also treated as token units.

## Delegate

```sh
adm delegate new mydelegate
```

Registers the configured account as a delegate. `adamant-api` sets the registration fee to 300 ADM (`30000000000` token units) on both mainnet and testnet. The account must hold at least that amount.

## Vote

```sh
adm vote for +delegatePublicKey
adm vote for +delegatePublicKey -otherDelegatePublicKey
```

Prefix delegate public keys with `+` to vote or `-` to unvote. A missing prefix is treated as `+`.

Usernames and addresses work only when that delegate is registered on the configured network. Voting for a mainnet-only name such as `lynx` while `network` is `testnet` fails with a message that names the current network. Use `+publicKey` when the delegate name belongs to another network.

## JSON-RPC

```sh
adm rpc server
```

Starts the local JSON-RPC HTTP server on `config.rpc.port`.
