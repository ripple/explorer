import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Loader } from '../../shared/components/Loader'
import SocketContext from '../../shared/SocketContext'
import { Tooltip, TooltipInstance } from '../../shared/components/Tooltip'
import { getVault } from '../../../rippled/lib/rippled'
import { useAnalytics } from '../../shared/analytics'
import { Details } from './Details'
import { Account } from '../../shared/components/Account'
import './styles.scss'

interface Props {
  vaultId: string
  setError: (error: number | null) => void
}

export const VaultHeader = (props: Props) => {
  const { t } = useTranslation()
  const { vaultId, setError } = props
  const rippledSocket = useContext(SocketContext)
  const { trackException } = useAnalytics()
  const [tooltip, setTooltip] = useState<TooltipInstance | undefined>(undefined)

  const { data, isFetching: loading } = useQuery(
    ['getVault', vaultId],
    async () => getVault(rippledSocket, vaultId),
    {
      onError: (e: any) => {
        trackException(`Vault ${vaultId} --- ${JSON.stringify(e)}`)
        setError(e.code)
      },
    },
  )

  const showTooltip = (event: any, d: any) => {
    setTooltip({
      data: d,
      mode: 'vaultId',
      x: event.currentTarget.offsetLeft,
      y: event.currentTarget.offsetTop,
    })
  }

  const hideTooltip = () => {
    setTooltip(undefined)
  }

  const renderHeaderContent = () => {
    const owner = data?.Owner
    return (
      <div className="section vault-header-container">
        <div className="vault-info-container">
          <div className="values">
            <div className="title">{t('owner')}</div>
            <div className="value">
              <div className="vault-owner">
                <Account account={owner} />
              </div>
            </div>
          </div>
        </div>
        <div className="vault-bottom-container">
          <div className="details">
            <h2>{t('details')}</h2>
            <Details data={data} vaultId={vaultId} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="vault-token-header">
      <div className="section">
        {!loading && (
          <div className="vault-box-header">
            <div className="token-title">
              {t('vault_id')}
              <div className="badge">{t('vault')}</div>
            </div>
            <div
              className="title-content"
              onMouseOver={(e) => showTooltip(e, { vaultId })}
              onFocus={() => {}}
              onMouseLeave={hideTooltip}
            >
              {vaultId}
            </div>
          </div>
        )}
      </div>
      <div className="box-content">
        {loading ? <Loader /> : data && renderHeaderContent()}
      </div>
      <Tooltip tooltip={tooltip} />
    </div>
  )
}
