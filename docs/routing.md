## Typed Routes

The explorer uses some enhancements to `react-router` to provide type checking to routes.

### `RouteDefinition`

`useRouteParams` and `RouteLink` take these objects to provide type checking for params.

In the future these objects can provide a common way to support legacy routes.

ex.
```
export const ACCOUNT_ROUTE: RouteDefinition<{
    id?: string
    tab?: 'assets' | 'transactions'
    assetType?: 'issued' | 'nfts'
}> = {
    path: '/accounts/:id?/:tab?/:assetType?',
}
```

### `useRouteParams`

A new hook which takes a `RouteDefinition` and wraps `react-router`'s `useRouteParams`.  This will derive the type of the params from the definition.

ex. `const { id = '', assetType = 'issued' } = useRouteParams(ACCOUNT_ROUTE)`

### `RouteLink`

A wrapper for `react-router`'s `Link` that takes a `RouteDefinition` and an object of params that will be type checked.

Ex. `<RouteLink to={ACCOUNT_ROUTE} params={{ id: owner }}>{owner}</RouteLink>`

Example that will fail to compile `<RouteLink to={ACCOUNT_ROUTE} params={{ something: owner }}>{owner}</RouteLink>`
