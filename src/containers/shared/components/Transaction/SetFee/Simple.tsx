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
      <SimpleRow label={t('setfee_base_fee')} data-testid="base-fee">
        <Amount value={fee} />
      </SimpleRow>
      <SimpleRow label={t('setfee_reserve')} data-testid="reserve">
        <Amount value={reserve} />
      </SimpleRow>
      <SimpleRow
        label={t('setfee_reserve_increment')}
        data-testid="reserve-increment"
      >
        <Amount value={increment} />
      </SimpleRow>
    </>
  )
}
