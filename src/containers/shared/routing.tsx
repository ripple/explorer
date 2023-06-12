import { ReactNode, Ref } from 'react'
import { generatePath } from 'react-router'
import {
  NavLink as RouterLink,
  useParams as useRouterParams,
} from 'react-router-dom'

export interface RouteDefinition<T = {}> {
  path: string
  sampleParams?: T
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

export function useRouteParams<T extends RouteDefinition>(route: T) {
  return useRouterParams<NonNullable<(typeof route)['sampleParams']>>()
}

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
