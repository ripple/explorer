import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { MILLIS_PER_SECOND } from '../../../../../rippled/lib/convertRippleDate'
import { localizeDate } from '../../../utils'
import { DATE_OPTIONS } from '../../../transactionUtils'
import { useLanguage } from '../../../hooks'

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
      <SimpleRow label={t('oracle_document_id')} data-test="oracle-document-id">
        {oracleDocumentID}
      </SimpleRow>

      {provider && (
        <SimpleRow label={t('provider')} data-test="provider">
          {provider}
        </SimpleRow>
      )}

      {uri && (
        <SimpleRow label={t('uri')} data-test="uri">
          {uri}
        </SimpleRow>
      )}

      <SimpleRow label={t('last_update_time')} data-test="last-update-time">
        {localizeDate(
          new Date(lastUpdateTime * MILLIS_PER_SECOND),
          language,
          DATE_OPTIONS,
        )}
      </SimpleRow>

      {assetClass && (
        <SimpleRow label={t('asset_class')} data-test="asset-class">
          {assetClass}
        </SimpleRow>
      )}

      <SimpleRow label={t('trading_pairs')} data-test="trading-pairs">
        {priceDataSeries.map((priceDataObj) => (
          <div className="amount list" data-test="amount">
            {priceDataObj.assetPrice ?? t('deleted')}
            <div className="one-line">{priceDataObj.tradingPair}</div>
          </div>
        ))}
      </SimpleRow>
    </>
  )
}
