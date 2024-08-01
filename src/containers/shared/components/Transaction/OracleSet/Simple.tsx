import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { MILLIS_PER_SECOND } from '../../../../../rippled/lib/convertRippleDate'
import { localizeDate } from '../../../utils'
import { DATE_OPTIONS } from '../../../transactionUtils'
import { useLanguage } from '../../../hooks'
import Currency from '../../Currency'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps) => {
  const { t } = useTranslation()
  const language = useLanguage()
  const {
    oracleDocumentID,
    provider,
    uri,
    lastUpdateTime,
    assetClass,
    priceDataSeries,
  } = data.instructions
  return (
    <>
      <SimpleRow
        label={t('oracle_document_id')}
        data-testid="oracle-document-id"
      >
        {oracleDocumentID}
      </SimpleRow>

      {provider && (
        <SimpleRow label={t('provider')} data-testid="provider">
          {provider}
        </SimpleRow>
      )}

      {uri && (
        <SimpleRow label={t('uri')} data-testid="uri">
          {uri}
        </SimpleRow>
      )}

      <SimpleRow label={t('last_update_time')} data-testid="last-update-time">
        {localizeDate(
          new Date(lastUpdateTime * MILLIS_PER_SECOND),
          language,
          DATE_OPTIONS,
        )}
      </SimpleRow>

      {assetClass && (
        <SimpleRow label={t('asset_class')} data-testid="asset-class">
          {assetClass}
        </SimpleRow>
      )}

      <SimpleRow label={t('trading_pairs')} data-testid="trading-pairs">
        {priceDataSeries.map((priceDataObj) => (
          <div className="amount list" data-testid="amount">
            {priceDataObj.assetPrice ?? t('deleted')}
            <div className="one-line">
              <Currency currency={priceDataObj.baseAsset} />/
              <Currency currency={priceDataObj.quoteAsset} />
            </div>
          </div>
        ))}
      </SimpleRow>
    </>
  )
}
