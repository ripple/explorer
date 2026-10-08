import { queryClient } from '../shared/QueryClient'

queryClient.setDefaultOptions({
  queries: {
    ...queryClient.getDefaultOptions().queries,
    gcTime: 0,
  },
})

export { queryClient as testQueryClient }
