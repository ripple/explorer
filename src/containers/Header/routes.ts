import { NavigationMenuRoute } from './NavigationMenu'
import { LEDGERS, NETWORK } from '../App/routes'

// NOTE: for submenus, remove `path` field and add `children` array of objects
export const routesConfig: NavigationMenuRoute[] = [
  {
    route: LEDGERS,
    title: 'explorer',
  },
  {
    route: NETWORK,
    title: 'network',
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
