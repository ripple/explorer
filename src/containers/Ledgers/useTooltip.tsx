import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react'

export interface TooltipContextType {
  tooltip?: string
  setTooltip: Dispatch<SetStateAction<string | undefined>>
}

export const TooltipContext = createContext<TooltipContextType>({
  tooltip: undefined,
  setTooltip: (validator: SetStateAction<string | undefined>) => validator,
})

export const TooltipProvider: FC = ({ children }) => {
  const [tooltip, setTooltip] = useState<string>()

  return (
    <TooltipContext.Provider value={{ tooltip, setTooltip }}>
      {children}
    </TooltipContext.Provider>
  )
}

export const useTooltip = (): TooltipContextType => useContext(TooltipContext)
