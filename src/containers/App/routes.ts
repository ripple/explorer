import { RouteDefinition } from '../shared/routing'

import { NavigationMenuAnyRoute } from '../Header/NavigationMenu'

export const ACCOUNT_ROUTE: RouteDefinition<{
  id?: string
  tab?: 'assets' | 'transactions'
  assetType?: 'issued' | 'nfts'
}> = {
  path: '/accounts/:id?/:tab?/:assetType?',
}

export const LEDGERS_ROUTE: RouteDefinition = {
  path: '/',
}

export const LEDGER_ROUTE: RouteDefinition<{
  identifier: number | string
}> = {
  path: `/ledgers/:identifier`,
}

export const NETWORK_ROUTE: RouteDefinition<{
  tab?: 'nodes' | 'validators' | 'upgrade-status'
}> = {
  path: '/network/:tab?',
}

export const NFT_ROUTE: RouteDefinition<{
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
  token: string
}> = {
  path: `/token/:token`,
}

export const TOP_TOKENS: RouteDefinition<{}> = {
  path: `/tokens/top`,
}

export const TRANSACTION: RouteDefinition<{
  identifier: string
  tab?: 'simple' | 'detailed' | 'raw'
}> = {
  path: `/transactions/:identifier?/:tab?`,
}

export const VALIDATOR: RouteDefinition<{
  identifier: string
  tab?: 'details' | 'history'
}> = {
  path: `/validators/:identifier/:tab?`,
}

const isNetwork = (path) =>
  path.indexOf('/network') === 0 || path.indexOf('/validators') === 0

// NOTE: for submenus, remove `path` field and add `children` array of objects
export const navigationConfig: NavigationMenuAnyRoute[] = [
  {
    route: LEDGERS_ROUTE,
    title: 'explorer',
    current: (path: string) => !isNetwork(path),
  },
  {
    route: NETWORK_ROUTE,
    title: 'network',
    current: (path: string) => isNetwork(path),
  },
  {
    link: 'https://xrpl.org',
    title: 'xrpl_org',
  },
  {
    link: 'https://github.com/ripple/explorer',
    title: 'github',
  },
]
