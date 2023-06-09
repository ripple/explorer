import { RouteDefinition } from '../shared/routing'

export const ACCOUNT: RouteDefinition<{
  id?: string
  tab?: 'assets' | 'transactions'
  assetType?: 'issued' | 'nfts'
}> = {
  path: '/accounts/:id?/:tab?/:assetType?',
}

export const LEDGERS: RouteDefinition = {
  path: '/',
}

export const LEDGER: RouteDefinition<{
  identifier: number | string
}> = {
  path: `/ledgers/:identifier`,
}

export const NETWORK: RouteDefinition<{
  tab?: 'nodes' | 'validators' | 'upgrade-status'
}> = {
  path: '/network/:tab?',
}

export const NFT: RouteDefinition<{
  id: string
  tab?: 'transactions' | 'buy-offers' | 'sell-offers'
}> = {
  path: '/nft/:id/:tab?',
}

export const PAYSTRING: RouteDefinition<{
  id?: string
}> = {
  path: '/paystrings/:id?',
}

export const TOKEN: RouteDefinition<{
  identifier: string
  currency: string
}> = {
  path: `/token/:currency.:id`,
}

export const TRANSACTION: RouteDefinition<{
  identifier: string
  tab?: 'simple' | 'detail' | 'raw'
}> = {
  path: `/transactions/:identifier?/:tab?`,
}

export const VALIDATOR: RouteDefinition<{
  identifier: string
  tab?: 'details' | 'history'
}> = {
  path: `/validators/:identifier/:tab?`,
}
