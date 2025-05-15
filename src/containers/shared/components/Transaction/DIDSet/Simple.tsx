import { useTranslation } from 'react-i18next'
import type { DIDSet } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { convertHexToString } from '../../../../../rippled/lib/utils'

const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<DIDSet>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { URI, DIDDocument, Data } = data.instructions

  return (
    <>
      {URI && (
        <SimpleRow label={t('uri')} data-testid="uri">
          {convertHexToString(URI)}
        </SimpleRow>
      )}
      {DIDDocument && (
        <SimpleRow label={t('did_document')} data-testid="did-document">
          {convertHexToString(DIDDocument)}
        </SimpleRow>
      )}
      {Data && (
        <SimpleRow label={t('data')} data-testid="data">
          {convertHexToString(Data)}
        </SimpleRow>
      )}
    </>
  )
}

export { Simple }
