const routes = [
  {
    path: '/',
    title: 'home',
  },
  {
    title: 'explorer',
    children: [
      {
        path: '/ledgers',
        title: 'ledgers',
      },
      {
        path: '/transactions',
        title: 'transactions',
      },
    ],
  },
  {
    path: '/nodes',
    title: 'network',
  },
]

export default routes
