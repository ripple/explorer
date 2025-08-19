import { useEffect, useState } from 'react'
import { LedgerMetrics } from './LedgerMetrics'
import { Ledgers } from './Ledgers'
import { useAnalytics } from '../shared/analytics'
import { TooltipProvider } from '../shared/components/Tooltip'
import { SelectedValidatorProvider } from './useSelectedValidator'
import { StreamsProvider } from '../shared/components/Streams'
import { VHSValidatorsProvider } from '../shared/components/VHSValidators'

export const LedgersPage = () => {
  const { trackScreenLoaded } = useAnalytics()
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    trackScreenLoaded()
    return () => {
      window.scrollTo(0, 0)
    }
  }, [trackScreenLoaded])

  const pause = () => setPaused(!paused)

  return (
    <StreamsProvider>
      <VHSValidatorsProvider>
        <SelectedValidatorProvider>
          <TooltipProvider>
            <LedgerMetrics onPause={() => pause()} paused={paused} />
          </TooltipProvider>
          <TooltipProvider>
            <Ledgers paused={paused} />
          </TooltipProvider>
        </SelectedValidatorProvider>
      </VHSValidatorsProvider>
    </StreamsProvider>
  )
}
