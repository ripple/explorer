# How Transactions Are Defined

Each transaction has its properties defined in `./{TransactionType}/index.ts`.

- **Description**: A React component that defines the "Description" portion of a transaction's "Detailed" tab.
- **Simple**: A React component that defines the left column of a transaction's "Simple" tab.
- **TableDetail**: A React component that defines the body of transaction on the account, ledger, token, or nft page.
- **parser**: A function which takes a transaction object and meta nodes. It returns additional properties to map onto a transaction.
  This is run when a transaction is received from the server and is useful for transforming complex properties derived from nodes.

This object is then provided in `./index.ts`

The transaction needs to have its display value defined in `/public/locales/en-US/translations.json` with the key
`"transaction_{TransactionType}"`.

## Old Style
Below is the new properties mapped to their old equivalents

- Description
  - [Description](../../../Transactions/Description/index.js) contains a collection of if/else statements
  - `/containers/Transactions/Description/{TransactionType}.jsx`
- Simple
  - [Simple](../../../Transactions/Simple/index.js) contains a switch statement
  - `/containers/Transactions/Simple/{TransactionType}.jsx`
- TableDetail 
  - [TxDetails](../TxDetails.tsx) contains a map of internal render functions for each transaction type
  - function named `render{TransactionType}`
- parser 
  - [txSummary]('../../../../../../rippled/lib/txSummary/index.js) a map of functions
  - `rippled/lib/txSummary/{TransactionType}.js`

These old wrapper files will largely be able to be removed and the lookup of what component to use can live in their parents.
