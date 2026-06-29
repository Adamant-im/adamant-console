# Installation

## From the Repository

Clone the repository and install dependencies with lifecycle scripts disabled:

```sh
git clone https://github.com/Adamant-im/adamant-console.git
cd adamant-console
npm ci --ignore-scripts
```

Run the local CLI entry point:

```sh
node bin/adamant.js client version
```

## npm Binary

The package exposes the `adm` binary:

```sh
adm client version
adm node height
```

When working from a checkout, `node bin/adamant.js ...` and `adm ...` use the same command surface.

## Development Scripts

```sh
npm run lint
npm run format:check
npm test
```

Docs scripts:

```sh
npm run docs:api
npm run docs:dev
npm run docs:build
npm run docs:preview
```

`docs:api` generates the API reference from JSDoc comments on exported library modules. `docs:build` runs generation first, then builds the VitePress site.

## Runtime Support

The supported runtime is Node.js 22.13.0 or newer. Older Node.js runtimes are not supported by this repository.
