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
  const {
    Subject: subject,
    CredentialType: credentialType,
    Expiration: expiration,
    URI: uri,
  } = data.instructions

  return (
    <>
      <SimpleRow label={t('subject')} data-test="subject">
        {subject}
      </SimpleRow>

      <SimpleRow label={t('credential_type')} data-test="credential-type">
        {convertHexToString(credentialType)}
      </SimpleRow>

      {expiration && (
        <SimpleRow label={t('expiration')} data-test="expiration">
          {expiration}
        </SimpleRow>
      )}
      {uri && (
        <SimpleRow label={t('uri')} data-test="uri">
          {convertHexToString(uri)}
        </SimpleRow>
      )}
    </>
  )
}

export { Simple }
