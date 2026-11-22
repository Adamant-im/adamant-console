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

Install the published package with lifecycle scripts disabled:

```sh
npm install -g adamant-console --ignore-scripts
adm client version
adm node height
```

When working from a checkout, `node bin/adamant.js ...` and `adm ...` use the same command surface.

Current releases override the transitive `uuid` dependency to 11.1.1. Install output should not include the `uuid@8.3.2` deprecation warning seen with older dependency trees.

## Global install with nvm

nvm does not put `node`, `npm`, or global binaries such as `adm` on `PATH` until the shell loads nvm. Non-interactive SSH sessions and scripts need that init step before `adm` can run:

```sh
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
. "$NVM_DIR/nvm.sh"
npm install -g adamant-console --ignore-scripts
adm client
```

Add the same `nvm.sh` source line to the shell profile used by interactive sessions. For a script, source `nvm.sh` at the start or call the `adm` binary under `~/.nvm/versions/node/<version>/bin/adm`.

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
