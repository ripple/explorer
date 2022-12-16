import { useState, useEffect } from 'react'

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

  useEffect(() => {
    // storing input name
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue]
}
