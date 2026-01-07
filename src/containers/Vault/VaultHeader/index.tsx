import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Loader } from '../../shared/components/Loader'
import SocketContext from '../../shared/SocketContext'
import { getVault } from '../../../rippled/lib/rippled'
import { useAnalytics } from '../../shared/analytics'
import { Details } from './Details'
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

  if (loading) {
    return <Loader />
  }

  if (!data) {
    return null
  }

  return (
    <div className="vault-section">
      <h2 className="vault-section-title">{t('vault')}</h2>
      <div className="vault-section-divider" />
      <Details data={data} vaultId={vaultId} />
    </div>
  )
}
