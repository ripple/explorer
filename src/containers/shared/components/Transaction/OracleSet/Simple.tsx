import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { SimpleGroup } from '../SimpleGroup'
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
      {priceDataSeries.map((priceDataObj, index) => (
        <SimpleGroup data-test={`price-data-${index}`}>
          <SimpleRow
            label={t('trading_pair')}
            data-test={`trading-pair-${index}`}
          >
            {priceDataObj.tradingPair}
          </SimpleRow>

          {priceDataObj.assetPrice && (
            <SimpleRow
              label={t('asset_price')}
              data-test={`asset-price-${index}`}
            >
              {priceDataObj.assetPrice}
            </SimpleRow>
          )}
        </SimpleGroup>
      ))}
    </>
  )
}
