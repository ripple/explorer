import { useTranslation } from 'react-i18next'
import { type PermissionedDomainDelete } from 'xrpl'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { SimpleRow } from '../SimpleRow'

const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<PermissionedDomainDelete>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { DomainID } = data.instructions

  return (
    <SimpleRow label={t('domain_id')} data-test="domain-id">
      {DomainID}
    </SimpleRow>
  )
}

export { Simple }
