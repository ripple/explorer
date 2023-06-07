import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router'
import { Helmet } from 'react-helmet-async'
import NetworkContext from '../shared/NetworkContext'
import { Validators } from './Validators'
import { UpgradeStatus } from './UpgradeStatus'
import { Nodes } from './Nodes'
import NoMatch from '../NoMatch'
import { analytics, ANALYTIC_TYPES } from '../shared/utils'
import './css/style.scss'

export const Network = () => {
  const { t } = useTranslation()
  const { tab = 'nodes' } = useParams<{
    tab: 'upgrade-status' | 'validators' | 'nodes'
  }>()
  const network = useContext(NetworkContext)
  useEffect(() => {
    analytics(ANALYTIC_TYPES.pageview, {
      title: 'network',
      path: `/network/${tab || 'nodes'}`,
    })
  })

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
