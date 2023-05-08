import { NavigationMenuRoute } from './NavigationMenu'

// NOTE: for submenus, remove `path` field and add `children` array of objects
export const routesConfig: NavigationMenuRoute[] = [
  {
    path: '/',
    title: 'explorer',
  },
  {
    path: '/network',
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
