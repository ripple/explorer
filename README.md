[![Release](https://img.shields.io/github/v/release/ripple/explorer.svg)](https://github.com/ripple/explorer/releases)
[![Build](https://github.com/ripple/explorer/actions/workflows/nodejs.yml/badge.svg)](https://github.com/ripple/explorer/actions)
[![License](https://img.shields.io/github/license/ripple/explorer)](https://github.com/ripple/explorer/blob/main/LICENSE)

# XRPL Explorer

This repo contains the source code for the block explorer of the XRP Ledger hosted at livenet.xrpl.org.

This project uses [Vite](https://vitejs.dev/). You can find information about how to use it [here](https://vitejs.dev/guide/cli.html).

## Basic requirements

### Install Node and NPM

The project requires node@22. Follow installation instructions on [nodejs.org](https://nodejs.org/en/).

(Recommended) Install using [nvm](https://github.com/nvm-sh/nvm).

Make sure to use npm version 8+ by running `npm install -g npm@latest` after you install Node.

### Copy example env

`cp .env.example .env`

## Install, compile, and run

- `npm install` then
- `npm start` for development mode, or
- `npm run build` then `npm run prod-server` for production mode

### Installing on Apple Silicon

Since `canvas` does not provide pre-built binaries for Apple chips during `npm install` it will try to compile it manually. To get this to succeed you need to install several dependencies by following the instructions [here](https://github.com/Automattic/node-canvas#compiling).

## Running on Parallel Networks

### Testnet mode

1. Replace `VITE_RIPPLED_HOST=s2.ripple.com` with `VITE_RIPPLED_HOST=s.altnet.rippletest.net` in the `.env` file
1. Add `VITE_ENVIRONMENT=testnet` to `.env` to enable TESTNET banner

### Devnet mode

1. Replace `VITE_RIPPLED_HOST=s2.ripple.com` with `VITE_RIPPLED_HOST=s.devnet.rippletest.net` in the `.env` file
1. Add `VITE_ENVIRONMENT=devnet` to `.env` to enable TESTNET banner

## Testing

### Run unit tests

- Run tests in watch mode `npm test`
- Run test to produce coverage `npm run test:coverage`
- To open coverage HTML report in app root do `open coverage/index.html`

### Debugging Unit Tests in Chrome

1.  Place `debugger;` in your unit test
1.  Do `npm run test:debug`
1.  Open `about:inspect` in Chrome
1.  Click on `inspect` link
1.  Chrome Developer Tools will be open, click `play` button
1.  Now test will start running and will stop on your `debugger;`
1.  You know the rest ;)

## Targeted view sizes

1.  phone-only: 0px - 375px
1.  tablet-portrait-up: 375px - 600px
1.  tablet-landscape-up: 600px - 900px
1.  desktop-up: 900px - 1200px
1.  big-desktop-up: 1200px and up

## Targeted languages

1. US English (default)
1. Spanish
1. French
1. Japanese
1. Korean

When updating translation entires or adding new languages consult the guide [Translating](./docs/translating.md).

## Additional Documentation

- [How to define transactions](./src/containers/shared/components/Transaction/README.md)
- [Routing](./docs/routing.md)

## React Documentation

- Latest news in [react blog](https://reactjs.org/blog)
- [React documentation](https://react.dev)
- [How to think in react](https://reactjs.org/docs/thinking-in-react.html) and break down components
