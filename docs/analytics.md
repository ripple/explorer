## Variables

| Name                 | Description                                                  | Values                                                       | Page                     |
|----------------------| ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------ |
| network              | Which named network we are viewing                           | `mainnet`, `testnet`, `devnet`, `amm-devnet`, `custom` , or more in the future | All pages                |
| entrypoint           | The URI the explorer connects to for data                    |                                                              | All pages                |
| transaction_type     | The `TransactionType` field on a transaction                 |                                                              | `/transactions/*`        |
| transaction_category | An explorer specific grouping of transactions                | `PAYMENT`, `DEX`, `NFT`, `ACCOUNT`, `PSUEDO`, `UNKNOWN`, or `XCHAIN` | `/transactions/*`        |
| transaction_action   | An explorer specific grouping of transactions                | `CREATE`, `MODIFY`, `FINISH`, `CANCEL`, or `SEND`            | `/transactions/*`        |
| tec_code             | The failure code for a transaction                           |                                                              | `/transactions/*`        |
| account_id           |                                                              |                                                              | `/accounts/*`            |
| issuer               | The issuer of a token                                        | The accountId of the issuer                                  | `/tokens/*`, `/nft`      |
| currency_code        |                                                              | Ex. USD or SOLO                                              | `/tokens/*`              |
| asset1               | The first asset of an AMM                                    | Formatted {currencyCode}.{issuer}                            | `/accounts/*` for an AMM |
| asset2               | The first second asset of an AMM                             | Formatted {currencyCode}.{issuer}                            | `/accounts/*` for an AMM |
| nftoken_id           |                                                              |                                                              | `/nft`                   |
| search_term          | The search term                                              |                                                              | All pages                |
| search_category      | The parsed category searched by as determined by parsing the value | Ex `accounts`, `transactions`                                | All pages                |
| validator            | Public key of the validator viewed                           |                                                              | `/validator`             |

## Events

| Name           | Description                                               | Variables                          | Page                                                           |
|----------------|-----------------------------------------------------------|------------------------------------|----------------------------------------------------------------|
| search         | User used the global search                               | `search_term` and `search_category` | All pages                                                      |
| mobile_menu    | User opens the menu                                       |                                    | All pages                                                      |
| network_switch | User switches networks                                    | network, endpoint                  | All pages                                                      |
| load_more      | User chooses to load more data                            |                                    | `/accounts/*/transactions`, `/nft/transactions/*`, `/tokens/*` |
| not_found      | When showing a soft 404. Previously used a path of `/404` |                                    |                                                                |

## Techniques

- Use the `screen_view` event once the data is available to make the call.  For example on the transaction page wait until we get the transaction back to know the `transactionType` instead of sending an event to say the page was visited and then to say we have all information needed.
- Send entire url path for page view events.  The details can be parsed out later.
- Use the AdSwerve browser plugin to debug analytics.
- It is okay to use the tracking id on all servers including local, dev, and staging servers.  The data can be trimmed down on Google's side.

## Tracking Code

Paste this code as high in the <head> of the page as possible:

```
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KCQZ3L8');</script>
<!-- End Google Tag Manager -->
```

Additionally, paste this code immediately after the opening **<body>** tag:

```
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KCQZ3L8"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```
