# Transactions Query Language

`adm get transactions <query>` accepts URL-style transaction query fragments and forwards them to ADAMANT Node through `adamant-api`.

```sh
adm get transactions senderId=U123456789
adm get transactions recipientId=U123456789,limit=10
adm get transactions 'types=0&orderBy=timestamp:desc&returnUnconfirmed=1'
```

Use `,` or `&` to combine query parameters. Prefix a parameter with `and:` or `or:` for explicit logical grouping.

```sh
adm get transactions 'senderId=U123456789,and:recipientId=U987654321'
```

## Transaction Filters

| Parameter           | Purpose                                                             |
| ------------------- | ------------------------------------------------------------------- |
| `blockId`           | Match transactions in a block                                       |
| `fromHeight`        | Match transactions from a starting block height                     |
| `toHeight`          | Match transactions up to an ending block height                     |
| `minAmount`         | Match transactions whose amount is not less than the value          |
| `maxAmount`         | Match transactions whose amount is not greater than the value       |
| `senderId`          | Match transactions sent by an ADAMANT address                       |
| `recipientId`       | Match transactions sent to an ADAMANT address                       |
| `inId`              | Match transactions where the address is sender or recipient         |
| `type`              | Match one transaction type                                          |
| `types`             | Match one or more transaction types when supported by the node API  |
| `returnUnconfirmed` | Include unconfirmed transaction data when supported by the node API |

Amounts are integer ADM atoms. `1 ADM` equals `100000000`.

Transaction type `0` is a token transfer. Transaction type `8` is a chat message or in-chat transfer. For protocol-level type definitions, see [AIP-10 transaction types](https://aips.adamant.im/AIPS/aip-10#transaction-types).

## Block Filters

`adm get blocks <query>` accepts block query parameters:

| Parameter            | Purpose                                      |
| -------------------- | -------------------------------------------- |
| `blockId`            | Match a block by ID                          |
| `generatorPublicKey` | Match blocks forged by a delegate public key |
| `height`             | Match a block by height                      |
| `limit`              | Limit the number of returned records         |
| `offset`             | Skip records before returning results        |
| `orderBy`            | Sort by a field, for example `height:desc`   |

## Common Options

| Option    | Purpose                                                     |
| --------- | ----------------------------------------------------------- |
| `limit`   | Limit returned record count                                 |
| `offset`  | Skip records before returning results                       |
| `orderBy` | Sort by a field and direction, for example `timestamp:desc` |

## Examples

Transactions involving one address, ordered newest first:

```sh
adm get transactions 'inId=U123456789,and:minAmount=1,orderBy=timestamp:desc'
```

Last token transfer involving one address:

```sh
adm get transactions 'inId=U123456789,and:type=0,limit=1,orderBy=timestamp:desc'
```

Transactions in a block sent to a specific recipient:

```sh
adm get transactions 'blockId=7917597195203393333,and:recipientId=U123456789,orderBy=timestamp:asc'
```

Last 100 transactions sent to one recipient:

```sh
adm get transactions 'recipientId=U123456789,orderBy=timestamp:desc,limit=100'
```
