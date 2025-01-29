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
  const {
    Account: account,
    Subject: subject,
    CredentialType: credentialType,
    Issuer: issuer,
  } = data.instructions

  return (
    <>
      <SimpleRow label={t('subject')} data-test="subject">
        {subject || account}
      </SimpleRow>

      {issuer && (
        <SimpleRow label={t('issuer')} data-test="issuer">
          {issuer || account}
        </SimpleRow>
      )}

      <SimpleRow label={t('credential_type')} data-test="credential-type">
        {convertHexToString(credentialType)}
      </SimpleRow>
    </>
  )
}

export { Simple }
