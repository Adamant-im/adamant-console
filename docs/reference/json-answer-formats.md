# JSON Answer Formats

Console prints JSON for both successful and failed commands.

Successful responses include `success: true`:

```json
{
  "success": true,
  "version": "3.1.0",
  "network": "testnet"
}
```

Failed responses include `success: false` and an error message:

```json
{
  "success": false,
  "error": "Account is already a delegate"
}
```

Exact fields depend on the command and on the current ADAMANT Node API response.

## Account

`adm account new` returns local account credentials:

```json
{
  "success": true,
  "account": {
    "address": "U123456789",
    "passphrase": "example passphrase generated locally",
    "publicKey": "example-public-key",
    "privateKey": "example-private-key"
  }
}
```

The passphrase and private key are sensitive. Do not share or log real values.

## Client

`adm client version` returns Console metadata and effective local configuration metadata:

```json
{
  "success": true,
  "version": "3.1.0",
  "config": "/home/adamant/.adm/config.jsonc",
  "network": "testnet",
  "account": "Not set"
}
```

## Read Commands

Read commands return the object or list from the node under a command-specific field:

| Command                                      | Main field                   |
| -------------------------------------------- | ---------------------------- |
| `adm get address <address>`                  | `account`                    |
| `adm get block <blockId>`                    | `block`                      |
| `adm get blocks <query>`                     | `blocks`                     |
| `adm get delegate <delegate>`                | `delegate`                   |
| `adm get message <transactionId>`            | `transaction`                |
| `adm get transaction <transactionId>`        | `transaction`                |
| `adm get transactions <query>`               | `transactions` and `count`   |
| `adm get chats <address>`                    | `chats`                      |
| `adm get chat <ownAddress> <partnerAddress>` | `messages` or `transactions` |

Example:

```json
{
  "success": true,
  "account": {
    "address": "U123456789",
    "balance": "100000000",
    "publicKey": "example-public-key"
  }
}
```

## Node Commands

Node commands return node status data:

| Command            | Main field                                         |
| ------------------ | -------------------------------------------------- |
| `adm node height`  | `height`                                           |
| `adm node version` | `version` and `commit`                             |
| `adm node status`  | Node, network, loader, and WebSocket status fields |

## Send, Delegate, and Vote Commands

Transaction-producing commands return transaction identifiers or transaction objects depending on the underlying `adamant-api` result:

| Command                                      | Typical main field                     |
| -------------------------------------------- | -------------------------------------- |
| `adm send tokens <address> <amount>`         | `transactionId`                        |
| `adm send message <address> <text> [amount]` | `transactionId`                        |
| `adm send rich <address> <json>`             | `transactionId`                        |
| `adm send signal <address> <json>`           | `transactionId`                        |
| `adm delegate new <username>`                | `transaction` or delegate account data |
| `adm vote for <delegates...>`                | `transaction`                          |

Always inspect `success` and error fields before trusting command output in scripts.
