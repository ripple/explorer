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
    positionOverride?: { x: number; y: number },
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
    positionOverride?: { x: number; y: number },
  ) => {
    setTooltip({
      data,
      mode,
      x:
        positionOverride?.x ??
        (event.currentTarget instanceof HTMLElement
          ? event.currentTarget.offsetLeft
          : event.nativeEvent.offsetX),
      y:
        positionOverride?.y ??
        (event.currentTarget instanceof HTMLElement
          ? event.currentTarget.offsetTop
          : event.nativeEvent.offsetY),
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
