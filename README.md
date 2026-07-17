# adorable-log ❤️

> console.log wrapper that makes browser debugging more adorable.

[![npm version](https://img.shields.io/npm/v/adorable-log)](https://www.npmjs.com/package/adorable-log)
[![npm downloads](https://img.shields.io/npm/dm/adorable-log)](https://www.npmjs.com/package/adorable-log)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

- **Namespace loggers** - tag every log with a named badge so you can filter by module in DevTools
- **Auto color** - deterministic HSL colors from namespace name; override anytime
- **Log levels** - `log`, `info`, `warn`, `error`, `success`, `debug`
- **Groups** - callback-based API that guarantees `groupEnd` is always called
- **Table** - labeled `console.table` with optional column filtering
- **Banner** - visually marks the start of a log flow
- **Global config** - toggle logging per namespace or disable everything in production

---
## Preview
<table>
  <tr>
    <td><img width="622" height="282" alt="README1" src="https://github.com/user-attachments/assets/a90d4cb4-9952-400b-a509-24cae82032cd" /></td>
    <td><img width="833" height="643" alt="README2" src="https://github.com/user-attachments/assets/9716d091-0edb-430f-b165-4b27808d8879" /></td>
  </tr>
</table>

---

## Installation

```bash
npm install adorable-log
# or
pnpm add adorable-log
# or
yarn add adorable-log
```

---

## Quick Start

```ts
import {create} from 'adorable-log';

const log = create('Auth');

log.log('Login attempt');
log.warn('Token expiring soon');
log.error('Authentication failed');
log.success('Login successful');
```

---
## Project Setup

We recommend creating an `alog.config.ts` file at the project root to manage global configuration and loggers in one
place.

```ts
// alog.config.ts
import {configure, create} from 'adorable-log';

configure({
  enabled: process.env.NODE_ENV !== 'production',
  namespaces: {
    Auth: {color: '#E74C3C'},
    Cart: {color: '#2ECC71', enabled: false},
    API: {color: '#3498DB'},
  },
});

export const authLog = create('Auth');
export const cartLog = create('Cart');
export const apiLog = create('API');
```

```ts
// Import only the loggers you need in each file
import {authLog} from '@/alog.config';

authLog.log('Login attempt');
```

> You can also call `create()` directly without `alog.config.ts`.

---

## Features

### Namespace Logger

Create a dedicated logger per module. In the Chrome DevTools console filter, type `[Auth]` to show only logs from that
namespace.

```ts
const log = create('Auth');

log.log('General message');     // [Auth] General message
log.info('Informational message'); // [Auth] ℹ️ Informational message
log.warn('Warning message');    // [Auth] ⚠️ Warning message
log.error('Error message');     // [Auth] ❌ Error message
log.success('Success message'); // [Auth] ✅ Success message
log.debug('Debug message');     // [Auth] 🔍 Debug message
```

| Method    | Icon | Internal API    |
|-----------|------|-----------------|
| `log`     |      | `console.log`   |
| `info`    | ℹ️   | `console.info`  |
| `warn`    | ⚠️   | `console.warn`  |
| `error`   | ❌    | `console.error` |
| `success` | ✅    | `console.log`   |
| `debug`   | 🔍   | `console.debug` |

---


### Automatic Color Assignment

If no color is specified, a color is auto-generated. The same name
always produces the same color, even after a page refresh.

```ts
create('Auth');  // always the same color
create('Cart');  // always the same color
create('API');   // always the same color
```

You can also set a color explicitly.

```ts
// Set at create time
const log = create('Auth', {color: '#E74C3C'});

// Set in bulk via configure
configure({
  namespaces: {
    Auth: {color: '#E74C3C'},
    Cart: {color: '#2ECC71'},
  },
});
```

**Priority:** `create option` > `configure namespace` > `auto-generated hash`

Namespace colors from `configure()` apply even to loggers created before the call — call order
doesn't matter. A color passed directly to `create()` always stays fixed.

The badge text color (white or black) is automatically determined.

---


### Groups

Solves the problem of forgetting `console.groupEnd` and breaking console indentation, by using a callback-based API.

```ts
log.group('Payment Process', () => {
  log.log('Check stock');

  log.group('User Validation', () => {
    log.log('Check token');
    log.log('Check permissions');
  }); // groupEnd called automatically

  log.success('Payment complete');
}); // groupEnd called automatically
```

`groupEnd` is always called even if an error is thrown inside the callback.

The callback always runs even when logging is disabled — only the console grouping is skipped, so
code inside a group never disappears in production.

Groups and tables are rendered collapsed by default (`collapsed: true`).

```ts
// collapsed option — render this group expanded
log.group('Label', () => { ...
}, {collapsed: false});
```

---

### Table

Supports a label and column filtering.

```ts
const foods = [
  {name: '🍔', price: 30.89, group: 1},
  {name: '🍨', price: 20.71, group: 1},
  {name: '🍿', price: 10.31, group: 2},
];

// Label only
log.table('Foods', foods);

// Specific columns only
log.table('Foods', foods, ['name', 'price']);
```

---

### Banner

Visually marks the start of a log flow.

```ts
log.banner('API Request Start');
// [API] | API Request Start |
```

---

## Global Configuration

`configure()` is meant to be called **once** at app initialization. Subsequent calls are ignored with a
console warning.

```ts
import {configure} from 'adorable-log';

configure({
  // Enable/disable all logging (default: true)
  enabled: process.env.NODE_ENV !== 'production',

  // Default collapsed state for group/table (default: true)
  collapsed: true,

  // Per-namespace settings
  namespaces: {
    Auth: {color: '#E74C3C'},
    Cart: {color: '#2ECC71', enabled: false}, // disable this namespace only
    API: {color: '#3498DB'},
  },
});
```

---

## Usage Examples

### React Hook

```ts
// hooks/useAuth.ts
import {authLog} from '@/alog.config';

export function useAuth() {
  const login = async (email: string) => {
    authLog.group('Login', () => {
      authLog.log({email});
      authLog.debug('Token request start');
    });

    const res = await loginApi(email);

    if (!res.ok) {
      authLog.error('Login failed');
    } else {
      authLog.success('Login successful');
    }
  };

  return {login};
}
```

### API Client

```ts
// api/client.ts
import {apiLog} from '@/alog.config';

async function request(url: string, options: RequestInit) {
  apiLog.group(`${options.method} ${url}`, () => {
    apiLog.log({body: options.body});
  });

  const res = await fetch(url, options);

  if (!res.ok) {
    apiLog.error(`${res.status} ${res.statusText}`);
  } else {
    apiLog.success(`Response complete (${res.status})`);
  }

  return res;
}
```

### Console Filtering

```
In the Chrome DevTools console filter input:
  [Auth]  → show only Auth logs
  [API]   → show only API logs
```

---

## API

### `create(namespace, options?)`

Creates a namespace logger instance.

| Parameter       | Type     | Description                  |
|-----------------|----------|------------------------------|
| `namespace`     | `string` | Logger name                  |
| `options.color` | `string` | Badge background color (hex) |

### `configure(options)`

Updates global configuration.

| Option       | Type      | Default | Description                              |
|--------------|-----------|---------|------------------------------------------|
| `enabled`    | `boolean` | `true`  | Enable/disable all logging               |
| `collapsed`  | `boolean` | `true`  | Default collapsed state for group/table  |
| `namespaces` | `object`  | `{}`    | Per-namespace color and enabled settings |

---

## License

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
