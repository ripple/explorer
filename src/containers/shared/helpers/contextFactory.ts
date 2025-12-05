import { createContext, useContext } from 'react'

type NameProps = {
  hook: string
  provider: string
}

export const contextFactory = <T>(
  { hook, provider }: NameProps,
  initialState?: T,
) => {
  const Context = createContext<T | undefined>(initialState)

  const useContextFactory = (): T => {
    const context = useContext(Context)

    if (context === undefined) {
      throw new Error(`${hook} must be used in a child of ${provider}`)
    }
    return context
  }

  return [Context, useContextFactory] as const
}
