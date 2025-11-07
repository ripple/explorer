import { useTranslation } from 'react-i18next'
import { convertHexToString } from '../../../../../rippled/lib/utils'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { formatAmount } from '../../../../../rippled/lib/txSummary/formatAmount'
import { isValidJsonString, ONE_TENTH_BASIS_POINT } from '../../../utils'
import { JsonView } from '../../JsonView'
import { LoanBrokerSet } from './types'
import { parsePercent } from '../../../NumberFormattingUtils'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<LoanBrokerSet>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const {
    VaultID,
    LoanBrokerID,
    ManagementFeeRate,
    DebtMaximum,
    CoverRateMinimum,
    CoverRateLiquidation,
    Data,
  } = data.instructions

  const dataFromHex = convertHexToString(Data)

  return (
    <>
      <SimpleRow label={t('vault_id')} data-testid="vault-id">
        {VaultID}
      </SimpleRow>
      {LoanBrokerID && (
        <SimpleRow label={t('loan_broker_id')} data-testid="loan-broker-id">
          {LoanBrokerID}
        </SimpleRow>
      )}
      {ManagementFeeRate !== undefined && (
        <SimpleRow
          label={t('management_fee_rate')}
          data-testid="management-fee-rate"
        >
          {parsePercent(ManagementFeeRate / ONE_TENTH_BASIS_POINT)}
        </SimpleRow>
      )}
      {DebtMaximum !== undefined && (
        <SimpleRow label={t('debt_maximum')} data-testid="debt-maximum">
          <Amount value={formatAmount(DebtMaximum)} />
        </SimpleRow>
      )}
      {CoverRateMinimum !== undefined && (
        <SimpleRow
          label={t('cover_rate_minimum')}
          data-testid="cover-rate-minimum"
        >
          {parsePercent(CoverRateMinimum / ONE_TENTH_BASIS_POINT)}
        </SimpleRow>
      )}
      {CoverRateLiquidation !== undefined && (
        <SimpleRow
          label={t('cover_rate_liquidation')}
          data-testid="cover-rate-liquidation"
        >
          {parsePercent(CoverRateLiquidation / ONE_TENTH_BASIS_POINT)}
        </SimpleRow>
      )}
      {dataFromHex && (
        <SimpleRow label={t('data')} className="dt" data-testid="data">
          {isValidJsonString(dataFromHex) ? (
            <JsonView data={JSON.parse(dataFromHex)} />
          ) : (
            convertHexToString(dataFromHex)
          )}
        </SimpleRow>
      )}
    </>
  )
}
