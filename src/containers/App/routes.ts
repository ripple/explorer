import { Route } from '../shared/routing'

export const ACCOUNT: Route<{
  id: string
  tab?: 'assets' | 'transactions'
  assetType?: 'issued' | 'nfts'
}> = {
  path: '/accounts/:id?/:tab?/:assetType?',
}

export const LEDGERS: Route = {
  path: '/',
}

export const LEDGER: Route<{
  identifier: number | string
}> = {
  path: `/ledgers/:identifier`,
}

export const NETWORK: Route<{
  tab?: 'nodes' | 'validators' | 'upgrade-status'
}> = {
  path: '/network/:tab?',
}

export const NFT: Route<{
  id: string
  tab?: 'transactions' | 'buy-offers' | 'sell-offers'
}> = {
  path: '/nft/:id/:tab?',
}

export const PAYSTRING: Route<{
  id?: string
}> = {
  path: '/paystrings/:id?',
}

export const TOKEN: Route<{
  identifier: string
  currency: string
}> = {
  path: `/token/:currency.:id`,
}

export const TRANSACTION: Route<{
  identifier: string
  tab?: 'simple' | 'detail' | 'raw'
}> = {
  path: `/transactions/:identifier/:tab?`,
}

export const VALIDATOR: Route<{
  identifier: string
  tab?: 'details' | 'history'
}> = {
  path: `/validators/:identifier/:tab?`,
}

export const routes: { [key: string]: Route } = {
  ledger: LEDGER,
  transaction: TRANSACTION,
  validator: VALIDATOR,
}
