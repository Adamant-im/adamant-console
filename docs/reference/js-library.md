# JS Library Reference

The package entry point is `lib/api/index.js`.

```js
import {
  getNodeHeight,
  getAddress,
  sendMessage,
} from 'adamant-console/lib/api/index.js';
```

These wrappers are intentionally small. Use [`adamant-api`](https://js.docs.adamant.im/) directly for lower-level protocol features, typed DTOs, metadata, WebSocket subscriptions, and advanced transaction handling.

## Exports

The public entry point re-exports helpers from:

- `lib/api/account.js`
- `lib/api/get.js`
- `lib/api/node.js`
- `lib/api/send.js`
- `lib/api/delegate.js`
- `lib/api/vote.js`

Generated JSDoc reference is available under [Generated API](./api/index.md).

## Read Node Height

```js
import { getNodeHeight } from 'adamant-console/lib/api/index.js';

const result = await getNodeHeight();

if (!result.success) {
  throw new Error(result.error || result.errorMessage);
}

console.log(result.height);
```

## Send a Message

```js
import { sendMessage } from 'adamant-console/lib/api/index.js';

const result = await sendMessage(
  'U123456789',
  'hello',
  undefined,
  'your local passphrase',
);

if (!result.success) {
  throw new Error(result.error || result.errorMessage);
}

console.log(result.transactionId);
```

Never commit or log real passphrases. Keep secrets in local config or a trusted runtime secret source.

## Response Compatibility

Console wrappers preserve ADAMANT Node API v0.10.0 response fields surfaced by `adamant-api`, including numeric `count`, transaction `timestampMs`, and nullable unconfirmed transaction fields returned with `returnUnconfirmed=1`.

Chat query helpers send `includeDirectTransfers`. The deprecated `withoutDirectTransfers` input is accepted only as a compatibility alias and normalized before calling `adamant-api`.
