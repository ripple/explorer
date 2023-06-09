import { generatePath } from 'react-router'
import { Link as RouterLink } from 'react-router-dom'
import { ReactNode, Ref } from 'react'

export interface RouteDefinition<T = {}> {
  path: string
  legacy?: boolean
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

export function build<T>(route: RouteDefinition<T>, params: T) {
  const path =
    (process.env.VITE_ENVIRONMENT === 'custom'
      ? window.location.pathname.split('/')
      : '') + route.path
  return generatePath(
    path,
    params && Object.fromEntries(Object.entries(params)),
  )
}

export function ExplorerLink<T extends {} = {}>({
  to,
  children,
  params,
  innerRef,
  ...rest
}: LinkProps<RouteDefinition<T>>) {
  const path = params ? build(to, params) : to.path

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <RouterLink innerRef={innerRef} to={path} {...rest}>
      {children}
    </RouterLink>
  )
}

export { ExplorerLink as Link }
