import { buildPath } from '../shared/routing'
import { NavigationMenuAnyRoute } from '../Header/NavigationMenu'
import {
  AMENDMENTS_ROUTE,
  LEDGERS_ROUTE,
  NODES_ROUTE,
  TOKENS_ROUTE,
  UPGRADE_STATUS_ROUTE,
  VALIDATORS_ROUTE,
  VAULTS_ROUTE,
} from './routes'

const isNetwork = (path) =>
  path.indexOf(buildPath(VALIDATORS_ROUTE, {})) === 0 ||
  path.indexOf(buildPath(NODES_ROUTE, {})) === 0 ||
  path.indexOf(buildPath(UPGRADE_STATUS_ROUTE, {})) === 0 ||
  path.indexOf(buildPath(AMENDMENTS_ROUTE, {})) === 0

const isLedgers = (path: string) => path === '/'

const isTokens = (path) => path.indexOf(buildPath(TOKENS_ROUTE, {})) === 0

const isVaults = (path) => path.indexOf(buildPath(VAULTS_ROUTE, {})) === 0

// NOTE: for submenus, remove `path` field and add `children` array of objects
export const navigationConfig: NavigationMenuAnyRoute[] = [
  {
    route: LEDGERS_ROUTE,
    title: 'explorer',
    current: (path: string) => isLedgers(path),
  },
  process.env.VITE_ENVIRONMENT === 'mainnet' && {
    route: TOKENS_ROUTE,
    title: 'tokens',
    current: (path: string) => isTokens(path),
  },
  (process.env.VITE_ENVIRONMENT === 'mainnet' ||
    process.env.VITE_ENVIRONMENT === 'devnet' ||
    process.env.VITE_ENVIRONMENT === 'testnet') && {
    route: VAULTS_ROUTE,
    title: 'vaults',
    current: (path: string) => isVaults(path),
  },
  {
    title: 'network',
    current: (path: string) => isNetwork(path),
    children: [
      {
        route: NODES_ROUTE,
        title: 'nodes',
        current: (path: string) => isNetwork(path),
      },
      {
        route: VALIDATORS_ROUTE,
        title: 'validators',
        current: (path: string) => isNetwork(path),
      },
      {
        route: UPGRADE_STATUS_ROUTE,
        title: 'upgrade_status',
        current: (path: string) => isNetwork(path),
      },
      {
        route: AMENDMENTS_ROUTE,
        title: 'amendments',
        current: (path: string) => isNetwork(path),
      },
    ],
  },
  {
    link: 'https://xrpl.org',
    title: 'xrpl_org',
  },
  {
    link: 'https://github.com/ripple/explorer',
    title: 'github',
  },
].filter(Boolean) as NavigationMenuAnyRoute[]
