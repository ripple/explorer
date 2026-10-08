import { useEffect, useRef } from 'react'

/**
 * Runs `handler` each time a query reports a new error.
 *
 * TanStack Query v5 removed the `onError` option from `useQuery`. Pass the
 * query's `error` here to keep the same side effects (logging, analytics,
 * setting component error state).
 */
export const useOnQueryError = (
  error: unknown,
  handler: (error: any) => void,
) => {
  const handlerRef = useRef(handler)
  handlerRef.current = handler

  useEffect(() => {
    if (error) {
      handlerRef.current(error)
    }
  }, [error])
}
