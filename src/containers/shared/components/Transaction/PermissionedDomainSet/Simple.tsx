import { useTranslation } from 'react-i18next'
import { type PermissionedDomainSet } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'
import { convertHexToString } from '../../../../../rippled/lib/utils'

const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<PermissionedDomainSet>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { Account, DomainID, AcceptedCredentials } = data.instructions

  return (
    <>
      {Account && (
        <SimpleRow label={t('account')} data-test="account">
          {Account}
        </SimpleRow>
      )}
      {DomainID && (
        <SimpleRow label={t('domain_id')} data-test="domain-id">
          {DomainID}
        </SimpleRow>
      )}
      {AcceptedCredentials && (
        <SimpleRow
          label={t('accepted_credentials')}
          data-test="accepted-credentials"
        >
          {AcceptedCredentials.map((credential) => (
            <div>{credential}</div>
          ))}
        </SimpleRow>
      )}
    </>
  )
}

export { Simple }
