## How Transactions Are Defined

Each transaction has its properties defined in `./{TransactionName}/index.ts`.

- **Description**: A React component that defines the "Description" portion of a transaction's "Detailed" tab.
- **Simple**: A React component that defines the left column of a transaction's "Simple" tab.
- **TableDetail**: A React component that defines the body of transaction on the account, ledger, token, or nft page.
- **mapper**: A function which takes a transaction object and returns additional properties to map onto a transaction.

  This is run when a transaction is received from the server and is useful for transforming complex properties derived
  from nodes.

This object is then provided in `./index.ts`

The transaction needs to have its display value defined in `/public/locales/en-US/translations.json` with the key
`"transaction_{TransactionName}"`.
