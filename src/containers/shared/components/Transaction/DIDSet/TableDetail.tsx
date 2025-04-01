import { useTranslation } from 'react-i18next'
import type { DIDSet } from 'xrpl'
import { TransactionTableDetailProps } from '../types'
import { convertHexToString } from '../../../../../rippled/lib/utils'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<DIDSet>) => {
  const { t } = useTranslation()
  const { URI, DIDDocument, Data } = instructions
  return (
    <div className="didSet">
      {URI && (
        <div className="uri">
          <span className="label">{t('uri')}: </span>
          <span className="case-sensitive">{convertHexToString(URI)}</span>
        </div>
      )}
      {DIDDocument && (
        <div className="did-document">
          <span className="label">{t('did_document')}: </span>
          <span className="case-sensitive">
            {convertHexToString(DIDDocument)}
          </span>
        </div>
      )}
      {Data && (
        <div className="data">
          <span className="label">{t('data')}: </span>
          <span className="case-sensitive">{convertHexToString(Data)}</span>
        </div>
      )}
    </div>
  )
}
