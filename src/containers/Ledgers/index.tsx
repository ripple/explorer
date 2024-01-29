import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useTranslation } from 'react-i18next'
import { LedgerMetrics } from './LedgerMetrics'
import { Ledgers } from './Ledgers'
import { useAnalytics } from '../shared/analytics'
import { TooltipProvider } from '../shared/components/Tooltip'
import { SelectedValidatorProvider } from './useSelectedValidator'
import { StreamsProvider } from '../shared/components/Streams/StreamsProvider'
import { VHSValidatorsProvider } from '../shared/components/VHSValidators/VHSValidatorsProvider'

export const LedgersPage = () => {
  const { trackScreenLoaded } = useAnalytics()
  const [paused, setPaused] = useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    trackScreenLoaded()
    return () => {
      window.scrollTo(0, 0)
    }
  }, [trackScreenLoaded])

  const pause = () => setPaused(!paused)

  return (
    <div className="ledgers-page">
      <Helmet title={t('ledgers')} />
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
    </div>
  )
}
