import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Helmet } from 'react-helmet-async'
import NetworkContext from '../shared/NetworkContext'
import { Validators } from './Validators'
import { UpgradeStatus } from './UpgradeStatus'
import { Nodes } from './Nodes'
import NoMatch from '../NoMatch'
import './css/style.scss'
import { useAnalytics } from '../shared/analytics'

export const Network = () => {
  const { trackScreenLoaded } = useAnalytics()
  const { t } = useTranslation()
  const { tab = 'nodes' } = useParams<{
    tab: 'upgrade-status' | 'validators' | 'nodes'
  }>()
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
    'upgrade-status': UpgradeStatus,
    validators: Validators,
    nodes: Nodes,
  }[tab]
  return (
    <>
      <Helmet title={t('network')} />
      <Body />
    </>
  )
}
