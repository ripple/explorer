import { useTranslation } from 'react-i18next'
import { type PermissionedDomainDelete } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'

const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<PermissionedDomainDelete>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { DomainID: domainID } = data.instructions

  return (
    <SimpleRow label={t('domain_id')} data-testid="domain-id">
      {domainID}
    </SimpleRow>
  )
}

export { Simple }
