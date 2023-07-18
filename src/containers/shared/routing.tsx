import { ReactNode, Ref } from 'react'
import { generatePath } from 'react-router'
import {
  NavLink as RouterLink,
  useParams as useRouterParams,
} from 'react-router-dom'

/**
 * A definition for a react-router route that allows for typed routes
 *
 * @example
 * export const ACCOUNT_ROUTE: RouteDefinition<{
 *   id?: string
 *   tab?: 'assets' | 'transactions'
 *   assetType?: 'issued' | 'nfts'
 * }> = {
 *   path: '/accounts/:id?/:tab?/:assetType?',
 * }
 */
export interface RouteDefinition<T = {}> {
  path: string // react-router style path with replacements ex. "/ledgers/:identifier"
  sampleParams?: T // A phantom field used for typing the parameters on `NavigationLink` and `buildPath`.
}

/**
 * Produce a link path. In `custom` network mode it will prepend the rippled entrypoint
 * @param route
 * @param params
 */
export function buildPath<T>(route: RouteDefinition<T>, params: T) {
  const path =
    (process.env.VITE_ENVIRONMENT === 'custom'
      ? `/${window.location.pathname.split('/')[1]}`
      : '') + route.path
  return generatePath(
    path,
    params && Object.fromEntries(Object.entries(params)),
  )
}

/**
 * A wrapper for `useRouterParams` that returns a typed object of the routes params
 * @param route
 */
export function useRouteParams<T extends RouteDefinition>(route: T) {
  return useRouterParams<NonNullable<(typeof route)['sampleParams']>>()
}

export interface LinkProps<
  T extends RouteDefinition,
  K extends T['sampleParams'] = T['sampleParams'],
> {
  children?: ReactNode
  to: T
  params?: K
  innerRef?: Ref<HTMLAnchorElement>
  [key: string]: any
}

/**
 * A wrapper for `Link` that provides a typed interface for params and uses `buildPath` to build the url/
 * @param to
 * @param children
 * @param params
 * @param rest All other parameters pass through
 */
export function ExplorerLink<T extends {} = {}>({
  to,
  children,
  params,
  ...rest
}: LinkProps<RouteDefinition<T>>) {
  const path = buildPath(to, params || {})

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <RouterLink to={path} {...rest}>
      {children}
    </RouterLink>
  )
}

export { ExplorerLink as RouteLink }
