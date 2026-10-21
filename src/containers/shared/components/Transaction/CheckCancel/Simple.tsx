import { useTranslation } from 'react-i18next'
import type { CheckCancel } from 'xrpl'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { shortenCheckID } from '../../../utils'

export const Simple: TransactionSimpleComponent = (
  props: TransactionSimpleProps<CheckCancel>,
) => {
  const { t } = useTranslation()
  const { data } = props
  const { CheckID: checkID } = data.instructions

  return (
    <SimpleRow label={t('check_id')} data-testid="check-id">
      {shortenCheckID(checkID)}
    </SimpleRow>
  )
}
