import { useTranslation } from 'react-i18next'
import type { SetRegularKey } from 'xrpl'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'

export const Simple = ({ data }: TransactionSimpleProps<SetRegularKey>) => {
  const { RegularKey: key } = data.instructions
  const { t } = useTranslation()
  let label = ''
  let value = t('unset_regular_key')
  let className: string | undefined = 'unset'

  if (key) {
    className = undefined
    label = t('regular_key')
    value = key
  }
  return (
    <SimpleRow label={label} className={className}>
      {value}
    </SimpleRow>
  )
}
