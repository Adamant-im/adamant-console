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
adm client version
```

Prints Console version and effective local configuration metadata.

## Account

```sh
adm account new
```

Creates a new ADAMANT account and prints account data in JSON format.

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

See [Transactions Query Language](./transactions-query-language.md) for filter fields and examples.

## Send

```sh
adm send tokens U123456789 1ADM
adm send tokens U123456789 110000000
adm send message U123456789 "hello"
adm send message U123456789 "hello" 0.1ADM
adm send rich U123456789 '{"type":"reply","text":"hello"}'
adm send signal U123456789 '{"type":"typing","value":true}'
```

`amount` is interpreted by `adamant-api`. Use the `ADM` suffix for decimal ADM values.

## Delegate

```sh
adm delegate new mydelegate
```

Registers the configured account as a delegate.

## Vote

```sh
adm vote for +delegatePublicKey
adm vote for +delegatePublicKey -otherDelegatePublicKey
```

Prefix delegate public keys with `+` to vote or `-` to unvote. A missing prefix is treated as `+`.

## JSON-RPC

```sh
adm rpc server
```

Starts the local JSON-RPC HTTP server on `config.rpc.port`.
