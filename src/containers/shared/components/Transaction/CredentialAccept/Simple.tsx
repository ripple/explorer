import { useTranslation } from 'react-i18next'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { convertHexToString } from '../../../../../rippled/lib/utils'

const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<CredentialAccept>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { URI, DIDDocument, Attestation } = data.instructions

  return (
    <>
      {URI && (
        <SimpleRow label={t('uri')} data-test="uri">
          {convertHexToString(URI)}
        </SimpleRow>
      )}
      {DIDDocument && (
        <SimpleRow label={t('did_document')} data-test="did-document">
          {convertHexToString(DIDDocument)}
        </SimpleRow>
      )}
      {Attestation && (
        <SimpleRow label={t('attestation')} data-test="attestation">
          {convertHexToString(Attestation)}
        </SimpleRow>
      )}
    </>
  )
}

export { Simple }
