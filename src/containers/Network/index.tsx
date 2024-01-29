import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Helmet } from 'react-helmet-async'
import { NETWORK_ROUTE } from '../App/routes'
import { useAnalytics } from '../shared/analytics'
import { useRouteParams } from '../shared/routing'
import NetworkContext from '../shared/NetworkContext'
import { Validators } from './Validators'
import { UpgradeStatus } from './UpgradeStatus'
import { Nodes } from './Nodes'
import NoMatch from '../NoMatch'
import './css/style.scss'
import { StreamsProvider } from '../shared/components/Streams/StreamsProvider'
import { VHSValidatorsProvider } from '../shared/components/VHSValidators/VHSValidatorsProvider'

export const ValidatorsPage = () => (
  <StreamsProvider>
    <VHSValidatorsProvider>
      <Validators />
    </VHSValidatorsProvider>
  </StreamsProvider>
)

export const UpgradeStatusPage = () => (
  <StreamsProvider>
    <VHSValidatorsProvider>
      <UpgradeStatus />
    </VHSValidatorsProvider>
  </StreamsProvider>
)

export const Network = () => {
  const { trackScreenLoaded } = useAnalytics()
  const { t } = useTranslation()
  const { tab = 'nodes' } = useRouteParams(NETWORK_ROUTE)
  const network = useContext(NetworkContext)

  useEffect(() => {
    trackScreenLoaded()
  }, [tab, trackScreenLoaded])

  if (network === null) {
    return (
      <NoMatch
        title="network_cannot_be_crawled"
        hints={['check_crawl_existed', 'peer_crawled_context']}
        isError={false}
      />
    )
  }

  const Body = {
    'upgrade-status': UpgradeStatusPage,
    validators: ValidatorsPage,
    nodes: Nodes,
  }[tab]
  return (
    <>
      <Helmet title={t('network')} />
      <Body />
    </>
  )
}
