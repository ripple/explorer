import { useTranslation } from 'react-i18next'
import { type CredentialCreate } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { convertHexToString } from '../../../../../rippled/lib/utils'

const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<CredentialCreate>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { Subject, CredentialType, Expiration, URI } = data.instructions

  return (
    <>
      <SimpleRow label={t('subject')} data-test="subject">
        {Subject}
      </SimpleRow>

      <SimpleRow label={t('credential_type')} data-test="credential-type">
        {convertHexToString(CredentialType)}
      </SimpleRow>

      {Expiration && (
        <SimpleRow label={t('expiration')} data-test="expiration">
          {Expiration}
        </SimpleRow>
      )}
      {URI && (
        <SimpleRow label={t('uri')} data-test="uri">
          {convertHexToString(URI)}
        </SimpleRow>
      )}
    </>
  )
}

export { Simple }
