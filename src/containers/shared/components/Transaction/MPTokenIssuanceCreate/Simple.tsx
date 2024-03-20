import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { MPTokenIssuanceCreateInstructions } from './types'
import { useLanguage } from '../../../hooks'
import { localizeNumber } from '../../../utils'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<MPTokenIssuanceCreateInstructions>) => {
  const { issuanceID, metadata, assetScale, transferFee, maxAmount } = data.instructions
  const { t } = useTranslation()
  const language = useLanguage()
  const formattedFee =
    transferFee &&
    `${localizeNumber((transferFee / 1000).toPrecision(5), language, {
      minimumFractionDigits: 3,
    })}%`

  return (
    <>
      <SimpleRow label={t('mpt_issuance_id')} data-test="mpt-issuance-id">
          {issuanceID}
      </SimpleRow>
      {assetScale && <SimpleRow
        label={t('asset_scale')}
        className="dt"
        data-test="mpt-asset-scale"
      >
        {assetScale}
      </SimpleRow>}
      {transferFee && (
        <SimpleRow label={t('transfer_fee')} data-test="mpt-fee">
          {formattedFee}
        </SimpleRow>
      )}
      {maxAmount && <SimpleRow
        label={t('max_amount')}
        className="dt"
        data-test="mpt-max-amount"
      >
        {maxAmount}
      </SimpleRow>}

      {metadata && (
        <SimpleRow label={t('metadata')} className="dt" data-test="mpt-metadata">
          {metadata}
        </SimpleRow>
      )}
    </>
  )
}
