[![pipeline status](https://gitlab.ops.ripple.com/DataTeam/xrpcharts/badges/master/pipeline.svg)](https://gitlab.ops.ripple.com/DataTeam/xrpcharts/commits/master) [![coverage report](https://gitlab.ops.ripple.com/DataTeam/xrpcharts/badges/master/coverage.svg)](https://datateam.gitlab.ops.ripple.com/xrpcharts/master/)

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app). You can find the most recent version of guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

# Important documentation

* Most updated documentation for [create-react-app](https://github.com/facebook/create-react-app)
* Latest news in [react blog](https://reactjs.org/blog)
* [React documentation](https://reactjs.org/docs)
* [How to think in react](https://reactjs.org/docs/thinking-in-react.html) and break down components
* [More details on packages and step by step tutorial](https://gitlab.ops.ripple.com/ui/ui_react_base)

# Basic requirements

## xcode

1.  Install xcode from app store
1.  Open xcode and agree to license and finish the installation

## Install node.js and npm with [nvm](https://github.com/creationix/nvm)

1.  `curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.8/install.sh | bash`
1.  `nvm install node`
1.  `nvm alias default node`

## Global packages

1.  `ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
1.  `npm install -g create-react-app`
1.  `brew install watchman`

# Install, compile, and run

* `npm install` then
* `npm start` - for development mode, or
* `npm run build` then `npm run prod-server` for production mode

# Testnet mode

1. Replace `RIPPLED_HOST=s2.ripple.com` with `RIPPLED_HOST=s.altnet.rippletest.net` in the `.env` file
1. Remove `RIPPLED_SECONDARY` from `.env` (optional, but the extra validator subscriptions are not necessary)
1. Add `REACT_APP_ENVIRONMENT=testnet` to `.env` to enable TESTNET banner

# Devnet mode

1. Replace `RIPPLED_HOST=s2.ripple.com` with `RIPPLED_HOST=s.devnet.rippletest.net` in the `.env` file
1. Remove `RIPPLED_SECONDARY` from `.env` (optional, but the extra validator subscriptions are not necessary)
1. Add `REACT_APP_ENVIRONMENT=devnet` to `.env` to enable TESTNET banner

# Run unit test

* Run tests in watch mode `npm test`
* Run test to produce coverage `npm run test:coverage`
* To open coverage HTML report in app root do `open coverage/index.html`

# Debug unit test in Chrome

1.  Place `debugger;` in your unit test
1.  Do `npm run test:debug`
1.  Open `about:inspect` in Chrome
1.  Click on `inspect` link
1.  Chrome Developer Tools will be open, click `play` button
1.  Now test will start running and will stop on your `debugger;`
1.  You know the rest ;)

# Targeted view sizes

1.  phone-only: 0px - 375px
1.  tablet-portrait-up: 375px - 600px
1.  tablet-landscape-up: 600px - 900px
1.  desktop-up: 900px - 1200px
1.  big-desktop-up: 1200px and up

# Targeted languages

1.  US English (default)
1.  Simplified Chinese
1.  Japanese
1.  Korean
1.  Mexican Spanish
1.  Brazilian Portuguese

# CSS linting rules are extended from

1.  [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard)
1.  [stylelint-config-recommended-scss](https://github.com/kristerkari/stylelint-config-recommended-scss)
1.  [stylelint-config-idiomatic-order](https://github.com/ream88/stylelint-config-idiomatic-order)

# Pollyfills

We load some pollyfills conditionally because

1.  React 16 depends on the collection types Map and Set, [Doc](https://reactjs.org/docs/javascript-environment-requirements.html)
1.  React also depends on requestAnimationFrame, [Doc](https://reactjs.org/docs/javascript-environment-requirements.html)
1.  We are using `Intl` to format our number and dates, [Doc](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)

Following pollyfills has been loaded conditionally to support older browsers such as `< IE11`

1.  [es6-promise](https://github.com/stefanpenner/es6-promise)
1.  [Intl.js](https://github.com/andyearnshaw/Intl.js)
1.  [core-js](https://github.com/zloirock/core-js)
1.  [raf](https://www.npmjs.com/package/raf)

Using [require-ensure](https://webpack.js.org/api/module-methods/#require-ensure) Webpack will create different `chunk` for these pollyfills and they get loaded if user borwser don't support the feature needed.

# JSON viewer

We are using [react-json-view](https://github.com/mac-s-g/react-json-view)

# Analytics

We are using Google Analytics for more info read the [documentation](https://developers.google.com/analytics/devguides/collection/analyticsjs/)

# Visual Studio Code IDE

[VSC](https://code.visualstudio.com/) is fast and reliable IDE if you choose to use it please do a following configurations

## Install Extensions

1.  DotENV
1.  ESLint
1.  Prettier - Code formatter

## User Settings

```
{
    "explorer.confirmDelete": false,
    "editor.formatOnSave": true,
    "stylelint.enable": true,
    "files.exclude": {
        "node_modules/": true,
        "coverage/": true,
        "build/": true,
        "src/**/*.css": true
    }
}
```

# Useful Chrome add-on

* [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)
* [Dom listener](https://chrome.google.com/webstore/detail/domlistener/jlfdgnlpibogjanomigieemaembjeolj?hl=en)
* [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi/related?hl=en)
* [Postman](https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop/related?hl=en)

# Basic security

## Update module dependencies

1.  `npm install -g npm-check-updates`
1.  to see the available updates `ncu`
1.  to update the package.json `ncu -u`
1.  [documentation](https://www.npmjs.com/package/npm-check-updates)

## Clean your package.json

1.  `npm install -g fixpack`
1.  to re-write package.json run `fixpack`
1.  [documentation](https://www.npmjs.com/package/fixpack)

## Node Security (nsp)

1.  `npm install -g nsp`
1.  to check for security issues run `nsp check --output summary`
1.  [documentation](https://www.npmjs.com/package/nsp)

## Snyk Security for Node.js

1.  `npm install -g snyk`
1.  `snyk auth`
1.  to test for vulnerabilities run `snyk test`
1.  follow the steps to fix issues
1.  [documentation](https://snyk.io/)

# bash_profile

1.  `vim ~/.bash_profile`
1.  paste the following config

```
# Show branch name in color
function parse_git_branch () {
  git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/ (\1)/'
}
RED="\[\033[0;31m\]"
YELLOW="\[\033[0;33m\]"
GREEN="\[\033[0;32m\]"
NO_COLOR="\[\033[0m\]"
PS1="$GREEN\u@\h$NO_COLOR:\w$YELLOW\$(parse_git_branch)$NO_COLOR\$ "
```

# .gitconfig

1.  `vim ~/.gitconfig`
1.  paste the following config

```
# This is Git's per-user configuration file.
[user]
  name = %YOUR_NAME%
  email = %YOUR_EMAIL%

[alias]
  co = checkout
  ci = commit
  st = status
  br = branch
  hist = log --pretty=format:\"%h %ad | %s%d [%an]\" --graph --date=short
  type = cat-file -t
  dump = cat-file -p
  unstage = reset HEAD --
  last = log -1 HEAD
```
