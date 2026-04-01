import { useTranslation } from 'react-i18next'
import { useContext } from 'react'
import { useQuery } from 'react-query'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { JsonView } from '../../JsonView'
import SocketContext from '../../../SocketContext'
import { getVaultAsset } from '../utils/vaultUtils'
import { formatAmountWithAsset } from '../../../../../rippled/lib/txSummary/formatAmount'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const rippledSocket = useContext(SocketContext)
  const {
    vaultID,
    loanBrokerID,
    debtMaximumRaw,
    dataFromHex,
    dataAsJson,
    managementFeeRatePercent,
    coverRateMinimumPercent,
    coverRateLiquidationPercent,
  } = data.instructions

  // Fetch Vault asset information to format DebtMaximum correctly
  const { data: vaultAsset } = useQuery(
    ['vaultAsset', vaultID],
    () => getVaultAsset(rippledSocket, vaultID),
    {
      enabled: !!vaultID && !!rippledSocket,
    },
  )

  // Format DebtMaximum with correct currency
  const debtMaximum =
    vaultAsset && debtMaximumRaw !== undefined
      ? formatAmountWithAsset(debtMaximumRaw, vaultAsset)
      : undefined

  return (
    <>
      <SimpleRow label={t('vault_id')} data-testid="vault-id">
        {vaultID}
      </SimpleRow>
      {loanBrokerID && (
        <SimpleRow label={t('loan_broker_id')} data-testid="loan-broker-id">
          {loanBrokerID}
        </SimpleRow>
      )}
      {managementFeeRatePercent && (
        <SimpleRow
          label={t('management_fee_rate')}
          data-testid="management-fee-rate"
        >
          {managementFeeRatePercent}
        </SimpleRow>
      )}
      {debtMaximumRaw !== undefined && (
        <SimpleRow label={t('debt_maximum')} data-testid="debt-maximum">
          {debtMaximumRaw === '0' ? (
            <span>{t('no_limit')}</span>
          ) : (
            debtMaximum && <Amount value={debtMaximum} />
          )}
        </SimpleRow>
      )}
      {coverRateMinimumPercent && (
        <SimpleRow
          label={t('cover_rate_minimum')}
          data-testid="cover-rate-minimum"
        >
          {coverRateMinimumPercent}
        </SimpleRow>
      )}
      {coverRateLiquidationPercent && (
        <SimpleRow
          label={t('cover_rate_liquidation')}
          data-testid="cover-rate-liquidation"
        >
          {coverRateLiquidationPercent}
        </SimpleRow>
      )}
      {dataFromHex && (
        <SimpleRow label={t('data')} className="dt" data-testid="data">
          {dataAsJson ? <JsonView data={dataAsJson} /> : dataFromHex}
        </SimpleRow>
      )}
    </>
  )
}
