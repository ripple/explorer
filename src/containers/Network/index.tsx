import { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import NetworkContext from '../shared/NetworkContext'
import { Validators } from './Validators'
import { UpgradeStatus } from './UpgradeStatus'
import { Nodes } from './Nodes'
import NoMatch from '../NoMatch'
import { analytics, ANALYTIC_TYPES } from '../shared/utils'
import './css/style.scss'

interface NetworkProps {
  match: {
    path: string
    params: {
      identifier: string
      tab: string
    }
  }
}
const Network = (props: NetworkProps) => {
  const { t } = useTranslation()
  const { match } = props
  const { params } = match
  const { tab = 'nodes' } = params
  const network = useContext(NetworkContext)
  useEffect(() => {
    document.title = `${t('xrpl_explorer')} | ${t('network')}`
    analytics(ANALYTIC_TYPES.pageview, {
      title: 'network',
      path: `/network/${tab || 'nodes'}`,
    })
  })

  if (network === null) {
    return (
      <NoMatch
        title="network_cannot_crawled"
        hints={['check_crawl_existed', 'peer_crawled_context']}
        isError={false}
      />
    )
  }

  if (tab === 'upgrade-status') {
    return <UpgradeStatus />
  }
  if (tab === 'validators') {
    return <Validators />
  }
  return <Nodes />
}

export default Network
