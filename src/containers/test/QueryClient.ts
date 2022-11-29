import { queryClient } from '../shared/QueryClient'

queryClient.setDefaultOptions({
  queries: {
    ...queryClient.defaultQueryOptions(),
    cacheTime: 0,
  },
})

export { queryClient as testQueryClient }
