import { generatePath } from 'react-router'
import {
  NavLink as RouterLink,
  useParams as useRouterParams,
} from 'react-router-dom'
import { FC } from 'react'

export interface RouteDefinition<T = {}> {
  path: string
  sampleParams?: T
}

export function useParams<T extends RouteDefinition>(route: T) {
  return useRouterParams<NonNullable<(typeof route)['sampleParams']>>()
}

export interface LinkProps<T extends RouteDefinition<unknown>> {
  to: T
  params?: T['sampleParams']
  [key: string]: any
}

export function build<T>(route: RouteDefinition<T>, params: T) {
  const path =
    (process.env.VITE_ENVIRONMENT === 'custom'
      ? `/${window.location.pathname.split('/')[1]}`
      : '') + route.path
  return generatePath(
    path,
    params && Object.fromEntries(Object.entries(params)),
  )
}

export const ExplorerLink: FC<LinkProps<RouteDefinition>> = ({
  to,
  children,
  params,
  ...rest
}) => {
  const path = build(to, params)

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <RouterLink to={path} {...rest}>
      {children}
    </RouterLink>
  )
}

export { ExplorerLink as Link }
