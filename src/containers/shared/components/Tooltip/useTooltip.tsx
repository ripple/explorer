import {
  createContext,
  Dispatch,
  FC,
  MouseEvent,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from 'react'

export interface TooltipContextType {
  tooltip?: any
  setTooltip: Dispatch<SetStateAction<any | undefined>>
  hideTooltip: () => void
  showTooltip: (
    mode: string,
    event: MouseEvent<HTMLElement> | MouseEvent<SVGGElement>,
    data: any,
  ) => void
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
    event: MouseEvent<HTMLElement | SVGGElement>,
    data: any,
  ) => {
    setTooltip({
      data,
      mode,
      x: event.currentTarget?.offsetLeft ?? event.nativeEvent.offsetX,
      y: event.currentTarget?.offsetTop ?? event.nativeEvent.offsetY,
    })
  }

  const tooltipValues = useMemo(
    () => ({
      tooltip,
      setTooltip,
      hideTooltip,
      showTooltip,
    }),
    [tooltip],
  )

  return (
    <TooltipContext.Provider value={tooltipValues}>
      {children}
    </TooltipContext.Provider>
  )
}

export const useTooltip = (): TooltipContextType => useContext(TooltipContext)
