# XRPL Explorer

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find the most recent version of guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Basic requirements

### xcode

1.  Install xcode from app store
1.  Open xcode and agree to license and finish the installation

### Install node.js and npm with [nvm](https://github.com/creationix/nvm)

1.  `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash`
1.  `nvm install node`
1.  `nvm alias default node`

### Global packages

1.  `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
1.  `npm install -g create-react-app`
1.  `brew install watchman`

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

## Polyfills

We load some polyfills conditionally because

1.  React 16 depends on the collection types `Map` and `Set`, [Doc](https://reactjs.org/docs/javascript-environment-requirements.html)
1.  React also depends on `requestAnimationFrame`, [Doc](https://reactjs.org/docs/javascript-environment-requirements.html)
1.  We are using `Intl` to format our number and dates, [Doc](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)

The following polyfills has been loaded conditionally to support older browsers such as `< IE11`:

1.  [es6-promise](https://github.com/stefanpenner/es6-promise)
1.  [Intl.js](https://github.com/andyearnshaw/Intl.js)
1.  [core-js](https://github.com/zloirock/core-js)
1.  [raf](https://www.npmjs.com/package/raf)

Using [require-ensure](https://webpack.js.org/api/module-methods/#require-ensure) Webpack will create different `chunk` for these polyfills and they get loaded if user borwser don't support the feature needed.
