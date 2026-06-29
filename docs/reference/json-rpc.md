# JSON-RPC Reference

Start the server:

```sh
node bin/adamant.js rpc server
```

The server listens on `config.rpc.port`, defaulting to `5080`.

Example request:

```sh
curl -s -X POST http://127.0.0.1:5080 \
  -H 'Content-Type: application/json' \
  -d '{"jsonrpc":"2.0","method":"clientVersion","params":[],"id":1}'
```

Array-style methods require `params` as an array. Template-style send and vote methods accept named object parameters.

## Methods

| Method                             | Params style | Result                                      |
| ---------------------------------- | ------------ | ------------------------------------------- |
| `clientVersion`                    | none         | Console version and config metadata         |
| `accountNew`                       | array        | New account object                          |
| `delegateNew`                      | array        | Delegate account object                     |
| `getAddress`                       | array        | Account object                              |
| `getBlock`                         | array        | Block object                                |
| `getBlocks`                        | array        | Block array                                 |
| `getDelegate`                      | array        | Delegate object                             |
| `getChats`                         | array        | Chat array                                  |
| `getChatMessages`                  | array        | Message or transaction array                |
| `getChatTransactions`              | array        | Transaction array                           |
| `getMessage`                       | array        | Transaction object                          |
| `getTransaction`                   | array        | Transaction object                          |
| `getTransactions`                  | array        | Transaction array                           |
| `getTransactionsInBlockById`       | array        | Transaction array                           |
| `getTransactionsInBlockByHeight`   | array        | Transaction array                           |
| `getTransactionsReceivedByAddress` | array        | Transaction array                           |
| `nodeHeight`                       | array        | Node height                                 |
| `nodeVersion`                      | array        | Node version and commit                     |
| `nodeStatus`                       | array        | Node, network, loader, and WebSocket status |
| `sendTokens`                       | object       | Transaction ID                              |
| `sendMessage`                      | object       | Transaction ID                              |
| `sendRich`                         | object       | Transaction ID                              |
| `sendSignal`                       | object       | Transaction ID                              |
| `voteFor`                          | object       | Vote transaction                            |

## Array Params Example

```json
{
  "jsonrpc": "2.0",
  "method": "getTransaction",
  "params": ["123456789", "returnUnconfirmed=1"],
  "id": 1
}
```

## Object Params Example

```json
{
  "jsonrpc": "2.0",
  "method": "sendMessage",
  "params": {
    "address": "U123456789",
    "message": "hello",
    "amount": "0.1ADM",
    "passphrase": "your local passphrase"
  },
  "id": 1
}
```

Do not use real passphrases in shared examples, logs, CI output, issue reports, or screenshots.

## Error Handling

Console maps thrown API errors into JSON-RPC errors. If `params` is not an array for array-style methods, the method returns:

```json
{
  "success": false,
  "error": "\"params\" parameter should be an array"
}
```
