import { useTranslation } from 'react-i18next'
import { type CredentialDelete } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { convertHexToString } from '../../../../../rippled/lib/utils'

const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<CredentialDelete>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { Account, Subject, CredentialType, Issuer } = data.instructions

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
      {Issuer && (
        <SimpleRow label={t('issuer')} data-test="issuer">
          {convertHexToString(Issuer)}
        </SimpleRow>
      )}
      {CredentialType && (
        <SimpleRow label={t('credential_type')} data-test="credential-type">
          {convertHexToString(CredentialType)}
        </SimpleRow>
      )}
    </>
  )
}

export { Simple }
