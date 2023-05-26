# How Transactions Are Defined

Each transaction has its properties defined in `./src/containers/shared/components/Transaction/{TransactionType}/index.ts`.

- **Description**: A React component that defines the "Description" portion of a transaction's "Detailed" tab.
- **Simple**: A React component that defines the left column of a transaction's "Simple" tab.
- **TableDetail**: A React component that defines the body of transaction on the account, ledger, token, or nft page.
- **action**: A TransactionCategory value used to determine shape color of the transaction.
- **category**: A TransactionCategory value used to determine the color of the transaction.
- **parser**: A function which takes a transaction object and meta nodes. It returns additional properties to map onto a transaction.
  This is run when a transaction is received from the server and is useful for transforming complex properties derived from nodes.

This object is then provided in `./index.ts`

The transaction needs to have its display value defined in `/public/locales/en-US/translations.json` with the key
`"transaction_{TransactionType}"`.

The helper methods `getAction` and `getCategory` are available to find out how a transaction is defined and falls back to "UNKNOWN".
