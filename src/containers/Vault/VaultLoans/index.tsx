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
      const allBrokers: LoanBrokerData[] = []
      let marker: string | undefined

      do {
        // eslint-disable-next-line no-await-in-loop
        const resp = await getAccountObjects(
          rippledSocket,
          vaultPseudoAccount,
          'loan_broker',
          marker,
        )

        if (!resp?.account_objects) {
          break
        }

        const vaultBrokers = resp.account_objects.filter(
          (obj: LoanBrokerData) => obj.VaultID === vaultId,
        )
        allBrokers.push(...vaultBrokers)
        marker = resp.marker
      } while (marker)

      return allBrokers
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

  // Fetch loans for each broker - must be called before any early returns
  // This data is shared with BrokerDetails to avoid duplicate API calls
  // Paginates through all results using marker
  const brokerLoansQueries = useQueries(
    (loanBrokers ?? []).map((broker) => ({
      queryKey: ['getBrokerLoans', broker.Account, broker.index],
      queryFn: async () => {
        const allLoans: any[] = []
        let marker: string | undefined

        do {
          // eslint-disable-next-line no-await-in-loop
          const resp = await getAccountObjects(
            rippledSocket,
            broker.Account,
            'loan',
            marker,
          )

          if (!resp?.account_objects) {
            break
          }

          const brokerLoans = resp.account_objects.filter(
            (obj: any) => obj.LoanBrokerID === broker.index,
          )
          allLoans.push(...brokerLoans)
          marker = resp.marker
        } while (marker)

        return { brokerId: broker.index, loans: allLoans }
      },
      enabled: !!broker.Account && !!broker.index,
    })),
  )

  // Build maps of broker ID to loans and loan counts
  const brokerLoansMap: Record<string, any[]> = {}
  const loanCountMap: Record<string, number> = {}
  brokerLoansQueries.forEach((query) => {
    if (query.data) {
      brokerLoansMap[query.data.brokerId] = query.data.loans
      loanCountMap[query.data.brokerId] = query.data.loans.length
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
          loans={brokerLoansMap[selectedBroker.index]}
        />
      )}
    </div>
  )
}
