import { useTranslation } from 'react-i18next'
import { type PermissionedDomainSet } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'

const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<PermissionedDomainSet>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { DomainID: domainID, AcceptedCredentials: acceptedCredentials } =
    data.instructions

  return (
    <>
      {domainID && (
        <SimpleRow label={t('domain_id')} data-test="domain-id">
          {domainID}
        </SimpleRow>
      )}

      <SimpleRow
        label={t('accepted_credentials')}
        data-test="accepted-credentials"
      >
        {acceptedCredentials.map((credential) => (
          <div>{credential}</div>
        ))}
      </SimpleRow>
    </>
  )
}

export { Simple }
