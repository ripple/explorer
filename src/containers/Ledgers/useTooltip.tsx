import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useState,
} from 'react'

export interface TooltipContextType {
  tooltip?: any
  setTooltip: Dispatch<SetStateAction<any | undefined>>
}

export const TooltipContext = createContext<TooltipContextType>({
  tooltip: undefined,
  setTooltip: (validator: SetStateAction<any | undefined>) => validator,
})

export const TooltipProvider: FC = ({ children }) => {
  const [tooltip, setTooltip] = useState<any>()

  return (
    <TooltipContext.Provider value={{ tooltip, setTooltip }}>
      {children}
    </TooltipContext.Provider>
  )
}

export const useTooltip = (): TooltipContextType => useContext(TooltipContext)
