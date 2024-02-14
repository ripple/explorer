import { useLayoutEffect, useState } from 'react'

/**
 * A hook that prevents a value from being updated until it is unpaused.
 * @param value - The value that is applied when paused is false
 * @param paused - Should the value be updated
 */
export function usePreviousWithPausing<T = any[]>(
  value: T,
  paused: boolean,
): T | undefined {
  const [val, setVal] = useState<T>()

  useLayoutEffect(() => {
    if (!paused) {
      setVal(value)
    }
  }, [paused, value]) // this code will run when the value of 'value' changes

  return val // in the end, return the current ref value.
}
