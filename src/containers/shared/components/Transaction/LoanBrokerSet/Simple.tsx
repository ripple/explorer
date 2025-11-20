import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { JsonView } from '../../JsonView'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const {
    vaultID,
    loanBrokerID,
    debtMaximum,
    dataFromHex,
    dataAsJson,
    managementFeeRatePercent,
    coverRateMinimumPercent,
    coverRateLiquidationPercent,
  } = data.instructions

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
      <SimpleRow label={t('debt_maximum')} data-testid="debt-maximum">
        {debtMaximum && debtMaximum.amount !== 0 ? (
          <Amount value={debtMaximum} />
        ) : (
          <span>{t('no_limit')}</span>
        )}
      </SimpleRow>
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
