import {
  createContext,
  Dispatch,
  FC,
  MouseEvent,
  SetStateAction,
  useContext,
  useState,
} from 'react'

export interface TooltipContextType {
  tooltip?: any
  setTooltip: Dispatch<SetStateAction<any | undefined>>
  hideTooltip: () => void
  showTooltip: (mode: string, event: MouseEvent<HTMLElement>, data: any) => void
}

export const TooltipContext = createContext<TooltipContextType>({
  tooltip: undefined,
  setTooltip: (tt: SetStateAction<any | undefined>) => tt,
  hideTooltip: () => {},
  showTooltip: () => {},
})

export const TooltipProvider: FC = ({ children }) => {
  const [tooltip, setTooltip] = useState<any>()
  const hideTooltip = () => setTooltip(undefined)
  const showTooltip = (
    mode: string,
    event: MouseEvent<HTMLElement>,
    data: any,
  ) => {
    setTooltip({
      data,
      mode,
      x: event.currentTarget.offsetLeft,
      y: event.currentTarget.offsetTop,
    })
  }

  return (
    <TooltipContext.Provider
      value={{ tooltip, setTooltip, hideTooltip, showTooltip }}
    >
      {children}
    </TooltipContext.Provider>
  )
}

export const useTooltip = (): TooltipContextType => useContext(TooltipContext)
