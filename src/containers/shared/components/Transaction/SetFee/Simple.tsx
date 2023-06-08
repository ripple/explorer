import { useTranslation } from 'react-i18next'
import { Amount } from '../../Amount'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { SetFeeInstructions } from './types'

export const Simple = ({
  data,
}: TransactionSimpleProps<SetFeeInstructions>) => {
  const { t } = useTranslation()
  const { fee, reserve, increment } = data.instructions

  return (
    <>
      <SimpleRow label={t('setfee_base_fee')} data-test="base-fee">
        <Amount value={fee} />
      </SimpleRow>
      <SimpleRow label={t('setfee_reserve')} data-test="reserve">
        <Amount value={reserve} />
      </SimpleRow>
      <SimpleRow
        label={t('setfee_reserve_increment')}
        data-test="reserve-increment"
      >
        <Amount value={increment} />
      </SimpleRow>
    </>
  )
}
