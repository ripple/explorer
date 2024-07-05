import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { useLanguage } from '../../../hooks'
import { DATE_OPTIONS } from '../../../transactionUtils'
import { localizeDate } from '../../../utils'
import { MILLIS_PER_SECOND } from '../../../../../rippled/lib/convertRippleDate'
import Currency from '../../Currency'

export const TableDetail = ({
  instructions: tx,
}: TransactionTableDetailProps) => {
  const { t } = useTranslation()
  const language = useLanguage()
  return (
    <div data-testid="table-detail">
      <div className="oracle-document-id">
        <span className="label">{t('oracle_document_id')}: </span>
        <span className="case-sensitive">{tx.oracleDocumentID}</span>
      </div>
      {tx.provider && (
        <>
          <span className="label">{t('provider')}: </span>
          <span className="case-sensitive">{tx.provider}</span>
        </>
      )}
      {tx.assetClass && (
        <>
          <span className="label">{t('asset_class')}: </span>
          <span className="case-sensitive">{tx.assetClass}</span>
        </>
      )}
      <span className="label">{t('last_update_time')}: </span>
      <span className="case-sensitive">
        {localizeDate(
          new Date(tx.lastUpdateTime * MILLIS_PER_SECOND),
          language,
          DATE_OPTIONS,
        )}
      </span>
      <div className="trading-pair">
        <span className="label">{t('trading_pairs')}: </span>
        {tx.priceDataSeries.map((priceDataObj, index) => (
          <>
            <>
              <span className="case-sensitive">
                {priceDataObj.assetPrice ?? t('deleted')}
              </span>
              <span className="case-sensitive no-space">
                <Currency currency={priceDataObj.baseAsset} />/
                <Currency currency={priceDataObj.quoteAsset} />
              </span>
            </>
            {index < tx.priceDataSeries.length - 1 && ', '}
          </>
        ))}
      </div>
    </div>
  )
}
