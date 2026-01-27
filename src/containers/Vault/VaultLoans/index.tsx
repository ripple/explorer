import { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery, useQueries } from 'react-query'
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

interface AssetInfo {
  currency: string
  issuer?: string
  mpt_issuance_id?: string
}

interface Props {
  vaultId: string
  vaultPseudoAccount: string
  assetCurrency?: string
  displayCurrency: string
  asset?: AssetInfo
}

export const VaultLoans = ({
  vaultId,
  vaultPseudoAccount,
  assetCurrency,
  displayCurrency,
  asset,
}: Props) => {
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
          `Error fetching Loan Brokers for account ${vaultPseudoAccount} --- ${JSON.stringify(e)}`,
        )
      },
    },
  )

  // Fetch loan counts for each broker - must be called before any early returns
  const loanCountQueries = useQueries(
    (loanBrokers ?? []).map((broker) => ({
      queryKey: ['getBrokerLoanCount', broker.Account, broker.index],
      queryFn: async () => {
        const resp = await getAccountObjects(
          rippledSocket,
          broker.Account,
          'loan',
        )
        const loans = resp?.account_objects?.filter(
          (obj: any) => obj.LoanBrokerID === broker.index,
        )
        return { brokerId: broker.index, count: loans?.length ?? 0 }
      },
      enabled: !!broker.Account && !!broker.index,
    })),
  )

  // Build a map of broker ID to loan count
  const loanCountMap: Record<string, number> = {}
  loanCountQueries.forEach((query) => {
    if (query.data) {
      loanCountMap[query.data.brokerId] = query.data.count
    }
  })

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
    return (
      <div className="vault-loans-section">
        <h2 className="vault-loans-title">{t('loans')}</h2>
        <div className="vault-loans-divider" />
        <div className="no-loan-brokers-message">
          {t('no_loan_brokers_message')}
        </div>
      </div>
    )
  }

  const selectedBroker = loanBrokers[selectedBrokerIndex]

  return (
    <div className="vault-loans-section">
      <h2 className="vault-loans-title">{t('loans')}</h2>
      <div className="vault-loans-divider" />
      <BrokerTabs
        brokers={loanBrokers}
        selectedIndex={selectedBrokerIndex}
        onSelect={setSelectedBrokerIndex}
        loanCountMap={loanCountMap}
      />
      {selectedBroker && (
        <BrokerDetails
          broker={selectedBroker}
          currency={assetCurrency}
          displayCurrency={displayCurrency}
          asset={asset}
        />
      )}
    </div>
  )
}
