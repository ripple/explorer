import { useState } from 'react'
import { useQuery } from 'react-query'

function getStorageValue<T>(key: string, defaultValue: T): T | undefined {
  // getting stored value
  const saved = localStorage.getItem(key)
  const initial = saved && JSON.parse(saved)
  return initial || defaultValue
}

export const useLocalStorage = <T>(
  key: string,
  defaultValue: T,
): [T | undefined, Function] => {
  const [value, setValue] = useState<T | undefined>(() =>
    getStorageValue(key, defaultValue),
  )

  useQuery(['local-storage', key, value], () => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value))
    return null
  })

  return [value, setValue]
}
