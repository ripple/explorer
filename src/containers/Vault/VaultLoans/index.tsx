import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import SocketContext from '../../shared/SocketContext'
import { getAccountObjects } from '../../../rippled/lib/rippled'
import { useAnalytics } from '../../shared/analytics'
import { Loader } from '../../shared/components/Loader'
import { BrokerTabs } from './BrokerTabs'
import { BrokerDetails } from './BrokerDetails'
import './styles.scss'

interface LoanBrokerData {
  index: string
  LedgerEntryType: string
  Account: string
  Owner: string
  VaultID: string
  Data?: string
  ManagementFeeRate?: number
  CoverAvailable?: string
  CoverRateMinimum?: number
  CoverRateLiquidation?: number
  DebtTotal?: string
  DebtMaximum?: string
  OwnerCount?: number
}

interface Props {
  vaultId: string
  vaultPseudoAccount: string
  assetCurrency?: string
}

export const VaultLoans = ({ vaultId, vaultPseudoAccount, assetCurrency }: Props) => {
  const { t } = useTranslation()
  const { trackException } = useAnalytics()
  const rippledSocket = useContext(SocketContext)
  const [selectedBrokerIndex, setSelectedBrokerIndex] = useState(0)

  const { data: loanBrokers, isFetching: loading } = useQuery<
    LoanBrokerData[] | undefined
  >(
    ['getVaultLoanBrokers', vaultPseudoAccount],
    async () => {
      const resp = await getAccountObjects(
        rippledSocket,
        vaultPseudoAccount,
        'loan_broker',
      )
      return resp?.account_objects?.filter(
        (obj: LoanBrokerData) => obj.VaultID === vaultId,
      )
    },
    {
      enabled: !!vaultPseudoAccount,
      onError: (e: any) => {
        trackException(
          `Vault loans ${vaultPseudoAccount} --- ${JSON.stringify(e)}`,
        )
      },
    },
  )

  if (loading) {
    return (
      <div className="vault-loans-section">
        <h2 className="vault-loans-title">{t('loans')}</h2>
        <div className="vault-loans-divider" />
        <Loader />
      </div>
    )
  }

  if (!loanBrokers || loanBrokers.length === 0) {
    // TODO: If there are no loan brokers, what is the expected behavior?
    return null
  }

  console.log('loanBrokers data: ', loanBrokers)

  const selectedBroker = loanBrokers[selectedBrokerIndex]

  return (
    <div className="vault-loans-section">
      <h2 className="vault-loans-title">{t('loans')}</h2>
      <div className="vault-loans-divider" />
      <BrokerTabs
        brokers={loanBrokers}
        selectedIndex={selectedBrokerIndex}
        onSelect={setSelectedBrokerIndex}
      />
      {selectedBroker && (
        <BrokerDetails broker={selectedBroker} currency={assetCurrency} />
      )}
    </div>
  )
}
