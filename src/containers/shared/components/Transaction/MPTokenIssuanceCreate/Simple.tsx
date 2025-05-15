import { useTranslation } from 'react-i18next'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { MPTokenIssuanceCreateInstructions } from './types'
import { useLanguage } from '../../../hooks'
import { isValidJsonString, localizeNumber } from '../../../utils'
import { MPTokenLink } from '../../MPTokenLink'
import { JsonView } from '../../JsonView'
import './styles.scss'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<MPTokenIssuanceCreateInstructions>) => {
  const { issuanceID, metadata, assetScale, transferFee, maxAmount } =
    data.instructions
  const { t } = useTranslation()
  const language = useLanguage()
  const formattedFee =
    transferFee &&
    `${localizeNumber((transferFee / 1000).toPrecision(5), language, {
      minimumFractionDigits: 3,
    })}%`

  return (
    <>
      {issuanceID && (
        <SimpleRow label={t('mpt_issuance_id')} data-testid="mpt-issuance-id">
          <MPTokenLink tokenID={issuanceID} />
        </SimpleRow>
      )}
      {assetScale && (
        <SimpleRow
          label={t('asset_scale')}
          className="dt"
          data-testid="mpt-asset-scale"
        >
          {assetScale}
        </SimpleRow>
      )}
      {transferFee && (
        <SimpleRow label={t('transfer_fee')} data-testid="mpt-fee">
          {formattedFee}
        </SimpleRow>
      )}
      {maxAmount && (
        <SimpleRow
          label={t('max_amount')}
          className="dt"
          data-testid="mpt-max-amount"
        >
          {maxAmount}
        </SimpleRow>
      )}
      {metadata && (
        <SimpleRow
          label={t('metadata')}
          className="dt"
          data-testid="mpt-metadata"
        >
          {isValidJsonString(metadata) ? (
            <JsonView data={JSON.parse(metadata)} />
          ) : (
            metadata
          )}
        </SimpleRow>
      )}
    </>
  )
}
