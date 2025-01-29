import { useTranslation } from 'react-i18next'
import { type CredentialAccept } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { convertHexToString } from '../../../../../rippled/lib/utils'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<CredentialAccept>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { Issuer, CredentialType } = data.instructions

  return (
    <>
      <SimpleRow label={t('issuer')} data-test="issuer">
        {Issuer}
      </SimpleRow>

      <SimpleRow label={t('credential_type')} data-test="credential-type">
        {convertHexToString(CredentialType)}
      </SimpleRow>
    </>
  )
}
