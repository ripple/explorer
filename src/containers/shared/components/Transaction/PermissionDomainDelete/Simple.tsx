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
  const { Account, DomainID } = data.instructions

  return (
    <>
      {Account && (
        <SimpleRow label={t('account')} data-test="account">
          {Account}
        </SimpleRow>
      )}
      {DomainID && (
        <SimpleRow label={t('domain_id')} data-test="domain-id">
          {Account}
        </SimpleRow>
      )}
    </>
  )
}

export { Simple }
