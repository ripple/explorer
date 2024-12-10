import { buildPath } from '../shared/routing'
import { NavigationMenuAnyRoute } from '../Header/NavigationMenu'
import {
  AMENDMENTS_ROUTE,
  LEDGERS_ROUTE,
  NODES_ROUTE,
  UPGRADE_STATUS_ROUTE,
  VALIDATORS_ROUTE,
  VALIDATOR_ROUTE,
} from './routes'

const isNetwork = (path) =>
  path.indexOf(buildPath(VALIDATOR_ROUTE, { identifier: '' })) === 0 ||
  path.indexOf(buildPath(NODES_ROUTE, {})) === 0 ||
  path.indexOf(buildPath(UPGRADE_STATUS_ROUTE, {})) === 0 ||
  path.indexOf(buildPath(AMENDMENTS_ROUTE, {})) === 0

// NOTE: for submenus, remove `path` field and add `children` array of objects
export const navigationConfig: NavigationMenuAnyRoute[] = [
  {
    route: LEDGERS_ROUTE,
    title: 'explorer',
    current: (path: string) => !isNetwork(path),
  },
  {
    title: 'network',
    current: (path: string) => isNetwork(path),
    children: [
      {
        route: NODES_ROUTE,
        title: 'nodes',
      },
      {
        route: VALIDATORS_ROUTE,
        title: 'validators',
      },
      {
        route: UPGRADE_STATUS_ROUTE,
        title: 'upgrade_status',
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
]
