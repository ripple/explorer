import { useTranslation } from 'react-i18next'
import { type CredentialAccept } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { convertHexToString } from '../../../../../rippled/lib/utils'

const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<CredentialAccept>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { Account, Issuer, CredentialType } = data.instructions

  return (
    <>
      {Account && (
        <SimpleRow label={t('account')} data-test="account">
          {Account}
        </SimpleRow>
      )}
      {Issuer && (
        <SimpleRow label={t('issuer')} data-test="issuer">
          {Issuer}
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
