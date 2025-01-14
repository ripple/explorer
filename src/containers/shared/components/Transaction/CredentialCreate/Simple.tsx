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
  const { Account, Subject, CredentialType, Expiration, URI } =
    data.instructions

  return (
    <>
      {Account && (
        <SimpleRow label={t('account')} data-test="account">
          {convertHexToString(Account)}
        </SimpleRow>
      )}
      {Subject && (
        <SimpleRow label={t('subject')} data-test="subject">
          {convertHexToString(Subject)}
        </SimpleRow>
      )}
      {CredentialType && (
        <SimpleRow label={t('credential_type')} data-test="credential-type">
          {convertHexToString(CredentialType)}
        </SimpleRow>
      )}
      {Expiration && (
        <SimpleRow label={t('expiration')} data-test="expiration">
          {convertHexToString(Expiration)}
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
