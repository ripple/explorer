import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { useLanguage } from '../../../hooks'
import { DATE_OPTIONS } from '../../../transactionUtils'
import { localizeDate } from '../../../utils'
import { MILLIS_PER_SECOND } from '../../../../../rippled/lib/convertRippleDate'

export const TableDetail = ({
  instructions: tx,
}: TransactionTableDetailProps) => {
  const { t } = useTranslation()
  const language = useLanguage()
  return (
    <>
      <div className="oracle-document-id">
        <span className="label">{t('oracle_document_id')}: </span>
        <span className="case-sensitive">{tx.oracleDocumentID}</span>
      </div>
      {tx.provider && (
        <div className="provider">
          <span className="label">{t('provider')}: </span>
          <span className="case-sensitive">{tx.provider}</span>
        </div>
      )}
      <div className="last-update-time">
        <span className="label">{t('last_update_time')}: </span>
        <span className="case-sensitive">
          {localizeDate(
            new Date(tx.lastUpdateTime * MILLIS_PER_SECOND),
            language,
            DATE_OPTIONS,
          )}
        </span>
      </div>
      {tx.assetClass && (
        <div className="asset-class">
          <span className="label">{t('asset_class')}: </span>
          <span className="case-sensitive">{tx.assetClass}</span>
        </div>
      )}
      {tx.priceDataSeries.map((priceDataObj, index) => (
        <>
          <>
            <span className="label">{t('trading_pair')} </span>
            <span className="case-sensitive">{priceDataObj.tradingPair}</span>
          </>

          {priceDataObj.assetPrice && (
            <>
              <span className="label">{t('asset_price')} </span>
              <span className="case-sensitive">{priceDataObj.assetPrice}</span>
            </>
          )}
          {index < tx.priceDataSeries.length - 1 && ', '}
        </>
      ))}
    </>
  )
}
