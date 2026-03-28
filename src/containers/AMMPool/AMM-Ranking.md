# AMM Ranking & AMM Pool Pages Revamp

I'm leading the AMM Ranking and AMM Pool Pages revamp project. The project involves both frontend and backend changes. We have completed the backend part and expose the following LOS/backend endpoints to retrieve AMM data (see https://los.dev.ripplex.io for API documentation):

1. `/v2/transactions`
2. `/dex-trades`
3. `/amms`
4. `/amms/{id}`
5. `/amms/historical-trends`

## API Examples

### Transactions

| Description | URL |
|---|---|
| RLUSD TXs | https://los.dev.ripplex.io/v2/transactions?token=524C555344000000000000000000000000000000.rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De&size=100 |
| RLUSD Payment TXs | https://los.dev.ripplex.io/v2/transactions?token=524C555344000000000000000000000000000000.rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De&size=100&type=Payment |
| RLUSD Transfer TXs | https://los.dev.ripplex.io/v2/transactions?token=524C555344000000000000000000000000000000.rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De&size=100&is_transfer=true |
| RLUSD TXs with DEX trades | https://los.dev.ripplex.io/v2/transactions?token=524C555344000000000000000000000000000000.rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De&size=100&has_dex_trade=true |

### DEX Trades

| Description | URL |
|---|---|
| RLUSD DEX trades | https://los.dev.ripplex.io/dex-trades?token=524C555344000000000000000000000000000000.rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De&size=100 |
| RLUSD AMM DEX trades | https://los.dev.ripplex.io/dex-trades?token=524C555344000000000000000000000000000000.rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De&size=100&type=amm |
| RLUSD OrderBook DEX trades | https://los.dev.ripplex.io/dex-trades?token=524C555344000000000000000000000000000000.rMxCKbEDwqr76QuheSUMdEGf4B9xJ8m5De&size=100&type=orderBook |
| AMM pool CRYPTO/XRP DEX trades | https://los.dev.ripplex.io/dex-trades?account=rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG&size=100 |

### Top AMMs

| Description | URL |
|---|---|
| Sorted by TVL (USD) descending | https://los.dev.ripplex.io/amms |
| Sorted by trading volume (USD) descending | https://los.dev.ripplex.io/amms?sort_field=trading_volume_usd |

### Get AMM

| Description | URL |
|---|---|
| AMM pool CRYPTO/XRP | https://los.dev.ripplex.io/amms/rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG |
| AMM pool (aggregated) | https://los.dev.ripplex.io/amms/aggregated |

### AMM Historical Trends

| Description | URL |
|---|---|
| All pools | https://los.dev.ripplex.io/amms/historical-trends |
| All pools — 1 week | https://los.dev.ripplex.io/amms/historical-trends?time_range=1W |
| All pools — 1 month | https://los.dev.ripplex.io/amms/historical-trends?time_range=1M |
| All pools — 6 months | https://los.dev.ripplex.io/amms/historical-trends?time_range=6M |
| All pools — 1 year | https://los.dev.ripplex.io/amms/historical-trends?time_range=1Y |
| All pools — 5 years | https://los.dev.ripplex.io/amms/historical-trends?time_range=5Y |
| CRYPTO/XRP pool | https://los.dev.ripplex.io/amms/historical-trends?amm_account_id=rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG |
| CRYPTO/XRP pool — 1 week | https://los.dev.ripplex.io/amms/historical-trends?time_range=1W&amm_account_id=rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG |
| CRYPTO/XRP pool — 1 month | https://los.dev.ripplex.io/amms/historical-trends?time_range=1M&amm_account_id=rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG |
| CRYPTO/XRP pool — 6 months | https://los.dev.ripplex.io/amms/historical-trends?time_range=6M&amm_account_id=rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG |
| CRYPTO/XRP pool — 1 year | https://los.dev.ripplex.io/amms/historical-trends?time_range=1Y&amm_account_id=rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG |
| CRYPTO/XRP pool — 5 years | https://los.dev.ripplex.io/amms/historical-trends?time_range=5Y&amm_account_id=rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG |

---

## AMM Pool/Object Page

I'm working on implementing the AMM Pool/Object page. The page will display detailed information about a specific AMM pool.

### Context

- My colleague is working on the AMM Ranking page and has opened a PR: https://github.com/ripple/explorer/pull/1295
  - Figma design: https://www.figma.com/design/RUfMjaArFHMdnoB2I1KwRX/XPPL.org-Explorer--AMM-?node-id=1618-93&p=f&m=dev
- Figma design for AMM Pool/Object Page: https://www.figma.com/design/RUfMjaArFHMdnoB2I1KwRX/XPPL.org-Explorer--AMM-?node-id=1583-2257&p=f&m=dev
- Technical design: https://ripplelabs.atlassian.net/wiki/spaces/DGE/pages/5178687489
  - The [Data Source](https://ripplelabs.atlassian.net/wiki/spaces/DGE/pages/5178687489/Technical+Design+-+AMM+Ranking+and+AMM+Pool+Pages#4.-Data-Sources) section describes the data we need to fetch for both pages.

### Page Sections

1. **Basic Information** — All info from `/amms/{id}` ([example](https://los.dev.ripplex.io/amms/rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG)), except `CreatedOn`. The created timestamp should be the timestamp of the first transaction (either `AMMCreate` or `AMMDeposit`) of the AMM account.

2. **Market Data** — Most info from `/amms/{id}` ([example](https://los.dev.ripplex.io/amms/rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG)), except the balance of the two assets and LP token balance, which come from the Clio `amm_info` RPC call. We need tooltips Volume (24H), Fees (24H) and APR (24H) fields. Reuse the Tooltip.tsx component.

3. **Auction** — Available from `amm_info`. USD values can be inferred from the pool's TVL USD.

4. **All AMM Transactions** — Use the `AccountTransactionTable` component with `account` = AMM account ID.

5. **Chart** — Data from `/amms/historical-trends` ([example](https://los.dev.ripplex.io/amms/historical-trends?amm_account_id=rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG)). Reuse chart components from the AMM Ranking page. We should show the exact TVL or volume values in a tooltip when hovering over the chart.

6. **DEX Trades** — Use the `DEXTradeTable` component with `account` = AMM account ID. Data from `/dex-trades` ([example](https://los.dev.ripplex.io/dex-trades?account=rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG&size=100&type=amm)).

7. **AMMDeposit** — Data from `/v2/transactions` ([example](https://los.dev.ripplex.io/v2/transactions?account=rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG&size=100&type=AMMDeposit)). We need a new component for this.

8. **AMMWithdraw** — Data from `/v2/transactions` ([example](https://los.dev.ripplex.io/v2/transactions?account=rLjUKpwUVmz3vCTmFkXungxwzdoyrWRsFG&size=100&type=AMMWithdraw)). Reuse the component we create for AMMDeposit.

9. **Top Holders** — Data from XRPLMeta using the AMM pool's LPT token, e.g., https://s1.xrplmeta.org/token/03B245BE580EC4F4386A751C084489EC4B514A2F:rhWTXC2m2gGGA9WozUaoMm6kLAVPb1tcS3/holders?limit=1000. Reuse the `HoldersTable` component.

---

## Migration Notes

- **Switch to v2 endpoints**: We currently use the v1 `/transactions` endpoint to fetch DEX trades and transfers for the IOU and MPT Token pages. We should migrate to `/v2/transactions` for transfers and `/dex-trades` for DEX trades.
- **Move shared components**: `HoldersTable`, `TransferTable`, and `DexTradeTable` currently live in the `Token/` folder. Move them to `shared/components` so they can be reused by the AMM Pool page (and other pages in the future).
