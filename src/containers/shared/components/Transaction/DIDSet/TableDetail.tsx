import { useTranslation } from 'react-i18next'
import { TransactionTableDetailProps } from '../types'
import { DIDSet } from './types'
import { convertHexToString } from '../../../../../rippled/lib/utils'

export const TableDetail = ({
  instructions,
}: TransactionTableDetailProps<DIDSet>) => {
  const { t } = useTranslation()
  const { URI, DIDDocument } = instructions
  return (
    <div className="didSet">
      {URI && (
        <div className="uri">
          <span className="label">{t('uri')}: </span>
          <span className="lower">{convertHexToString(URI)}</span>
        </div>
      )}
      {URI && (
        <div className="did-document">
          <span className="label">{t('did_document')}: </span>
          <span className="lower">{convertHexToString(DIDDocument)}</span>
        </div>
      )}
    </div>
  )
}
