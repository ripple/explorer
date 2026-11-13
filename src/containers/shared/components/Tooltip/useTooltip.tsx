import {
  createContext,
  Dispatch,
  FC,
  FocusEvent,
  MouseEvent,
  PropsWithChildren,
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
    event:
      | MouseEvent<HTMLElement>
      | MouseEvent<SVGGElement>
      | FocusEvent<HTMLElement>,
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

export const TooltipProvider: FC<PropsWithChildren> = ({ children }) => {
  const [tooltip, setTooltip] = useState<any>()
  const hideTooltip = () => setTooltip(undefined)
  const showTooltip = (
    mode: string,
    event: MouseEvent<HTMLElement | SVGGElement> | FocusEvent<HTMLElement>,
    data: any,
    positionOverride?: { x: number; y: number },
  ) => {
    // The SVGGElement branch is only reachable for a MouseEvent (a FocusEvent's
    // currentTarget is always an HTMLElement), so the native event there is a
    // DOM MouseEvent even though the union type can't express that.
    const nativeMouseEvent = event.nativeEvent as globalThis.MouseEvent
    setTooltip({
      data,
      mode,
      x:
        positionOverride?.x ??
        (event.currentTarget instanceof HTMLElement
          ? event.currentTarget.offsetLeft
          : nativeMouseEvent.offsetX),
      y:
        positionOverride?.y ??
        (event.currentTarget instanceof HTMLElement
          ? event.currentTarget.offsetTop
          : nativeMouseEvent.offsetY),
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
