import { RouteDefinition } from '../shared/routing'

import { NavigationMenuAnyRoute } from '../Header/NavigationMenu'

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

// NOTE: for submenus, remove `path` field and add `children` array of objects
export const navigationConfig: NavigationMenuAnyRoute[] = [
  {
    route: LEDGERS,
    title: 'explorer',
    current: (path: string) => path.indexOf('/network') !== 0,
  },
  {
    route: NETWORK,
    title: 'network',
    current: (path: string) => path.indexOf('/network') === 0,
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
