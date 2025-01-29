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
  const { Subject, CredentialType, Issuer } = data.instructions

  return (
    <>
      <SimpleRow label={t('subject')} data-test="subject">
        {Subject}
      </SimpleRow>

      <SimpleRow label={t('issuer')} data-test="issuer">
        {Issuer}
      </SimpleRow>

      <SimpleRow label={t('credential_type')} data-test="credential-type">
        {convertHexToString(CredentialType)}
      </SimpleRow>
    </>
  )
}

export { Simple }
