# XRPL Explorer

This repo contains the source code for the block explorer of the XRP Ledger hosted at livenet.xrpl.org.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find the most recent version of guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Basic requirements

### Install Node and NPM

The project requires node@14. Follow installation instructions on [nodejs.org](https://nodejs.org/en/).

### Google BigQuery Setup
This setup is required for the Tokens page of the explorer to function:

1.  [Select or create a Cloud Platform project][projects].
1.  [Enable the Google BigQuery API][enable_api].
1.  [Set up authentication with a service account][auth]

Once you have completed these steps and generated the JSON key file, you must populate the following environment variables in the .env file with their corresponding values from the JSON key file:
```
GOOGLE_APP_PROJECT_ID=your-project-id
GOOGLE_APP_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...
GOOGLE_APP_CLIENT_EMAIL=your-client-email
```

## Install, compile, and run

* `npm install` then
* `npm start` for development mode, or
* `npm run build` then `npm run prod-server` for production mode

## Running on Parallel Networks

### Testnet mode

1. Replace `RIPPLED_HOST=s2.ripple.com` with `RIPPLED_HOST=s.altnet.rippletest.net` in the `.env` file
1. Remove `RIPPLED_SECONDARY` from `.env` (optional, but the extra validator subscriptions are not necessary)
1. Add `REACT_APP_ENVIRONMENT=testnet` to `.env` to enable TESTNET banner

### Devnet mode

1. Replace `RIPPLED_HOST=s2.ripple.com` with `RIPPLED_HOST=s.devnet.rippletest.net` in the `.env` file
1. Remove `RIPPLED_SECONDARY` from `.env` (optional, but the extra validator subscriptions are not necessary)
1. Add `REACT_APP_ENVIRONMENT=devnet` to `.env` to enable TESTNET banner

## Testing

### Run unit tests

* Run tests in watch mode `npm test`
* Run test to produce coverage `npm run test:coverage`
* To open coverage HTML report in app root do `open coverage/index.html`

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

1.  US English (default)
1.  Simplified Chinese
1.  Japanese
1.  Korean
1.  Mexican Spanish
1.  Brazilian Portuguese

## React Documentation

* Most updated documentation for [create-react-app](https://github.com/facebook/create-react-app)
* Latest news in [react blog](https://reactjs.org/blog)
* [React documentation](https://reactjs.org/docs)
* [How to think in react](https://reactjs.org/docs/thinking-in-react.html) and break down components
* [More details on packages and step by step tutorial](https://gitlab.ops.ripple.com/ui/ui_react_base)

[enable_api]: https://console.cloud.google.com/flows/enableapi?apiid=bigquery.googleapis.com
[projects]: https://console.cloud.google.com/project
[auth]: https://cloud.google.com/docs/authentication/getting-started

## How Transactions Are Defined

Each transaction has its properties defined in `src/containers/shared/components/Transactions/{TransactionName}/index.ts`.

 - **Description**: A React component that defines the "Description" portion of a transaction's "Detailed" tab.
 - **Simple**: A React component that defines the left column of a transaction's "Simple" tab.
 - **TableDetail**: A React component that defines the body of transaction on the account, ledger, token, or nft page.
 - **mapper**: A function which takes a transaction object and returns additional properties to map onto a transaction.

    This is run when a transaction is received from the server and is useful for transforming complex properties derived
from nodes.

This object is then provided in `src/containers/shared/components/Transactions/index.ts`
