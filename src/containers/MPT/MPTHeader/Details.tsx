import { useTranslation } from 'react-i18next'
import './styles.scss'
import { useLanguage } from '../../shared/hooks'
import { localizeNumber } from '../../shared/utils'
import { MPTIssuanceFormattedInfo } from '../../shared/Interfaces'
import { TokenTableRow } from '../../shared/components/TokenTableRow'
import { convertHexToBigInt } from '../../../containers/shared/utils'

interface Props {
  data: MPTIssuanceFormattedInfo
}

export const Details = ({ data }: Props) => {
  const {
    assetScale,
    maxAmt,
    outstandingAmt,
    transferFee,
    sequence,
    metadata,
  } = data
  const { t } = useTranslation()
  const language = useLanguage()
  const formattedFee =
    transferFee &&
    `${localizeNumber((transferFee / 1000).toPrecision(5), language, {
      minimumFractionDigits: 3,
    })}%`

  return (
    <table className="token-table">
      <tbody>
        {assetScale && (
          <TokenTableRow label={t('asset_scale')} value={assetScale} />
        )}
        {maxAmt && <TokenTableRow label={t('max_amount')} value={maxAmt} />}
        {outstandingAmt && (
          <TokenTableRow
            label={t('outstanding_amount')}
            value={outstandingAmt}
          />
        )}
        <TokenTableRow label={t('transfer_fee')} value={formattedFee ?? '0%'} />
        <TokenTableRow label={t('sequence_number_short')} value={sequence} />
        {metadata && <TokenTableRow label={t('metadata')} value={metadata} />}
      </tbody>
    </table>
  )
}
