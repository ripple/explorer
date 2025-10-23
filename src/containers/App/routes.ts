import { RouteDefinition } from '../shared/routing'

export const ACCOUNT_ROUTE: RouteDefinition<{
  id?: string
  tab?: 'assets' | 'transactions'
  assetType?: 'issued' | 'nfts' | 'mpts'
}> = {
  path: '/accounts/:id/:tab?/:assetType?',
}

export const LEDGERS_ROUTE: RouteDefinition = {
  path: '/',
}

export const LEDGER_ROUTE: RouteDefinition<{
  identifier: number | string
}> = {
  path: `/ledgers/:identifier`,
}

export const NODES_ROUTE: RouteDefinition = {
  path: '/network/nodes',
}

export const VALIDATORS_ROUTE: RouteDefinition<{
  tab?: 'uptime' | 'voting'
}> = {
  path: '/network/validators/:tab?',
}

export const UPGRADE_STATUS_ROUTE: RouteDefinition = {
  path: '/network/upgrade-status',
}

export const NFT_ROUTE: RouteDefinition<{
  id: string
  tab?: 'transactions' | 'buy-offers' | 'sell-offers'
}> = {
  path: '/nft/:id/:tab?',
}

export const TOKEN_ROUTE: RouteDefinition<{
  token: string
}> = {
  path: `/token/:token`,
}

export const TRANSACTION_ROUTE: RouteDefinition<{
  identifier: string
  tab?: 'simple' | 'detailed' | 'raw'
}> = {
  path: `/transactions/:identifier/:tab?`,
}

export const ENTRY_ROUTE: RouteDefinition<{
  id: string
  tab?: 'simple' | 'raw'
}> = {
  path: `/entry/:id/:tab?`,
}

export const VALIDATOR_ROUTE: RouteDefinition<{
  identifier: string
  tab?: 'details' | 'history' | 'voting'
}> = {
  path: `/validators/:identifier/:tab?`,
}

export const AMENDMENTS_ROUTE: RouteDefinition = {
  path: '/amendments',
}

export const TOKENS_ROUTE: RouteDefinition = {
  path: '/tokens',
}

export const AMENDMENT_ROUTE: RouteDefinition<{
  identifier: string
}> = {
  path: `/amendment/:identifier`,
}

export const MPT_ROUTE: RouteDefinition<{
  id: string
}> = {
  path: '/mpt/:id',
}
