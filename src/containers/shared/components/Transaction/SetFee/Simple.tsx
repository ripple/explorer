import { Amount } from '../../Amount'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { SetFeeInstructions } from './types'

export const Simple = ({
  data,
}: TransactionSimpleProps<SetFeeInstructions>) => {
  const { fee, base, increment } = data.instructions

  return (
    <>
      <SimpleRow label="Base Fee" data-test="base-fee">
        <Amount value={fee} />
      </SimpleRow>
      <SimpleRow label="Reserve" data-test="reserve">
        <Amount value={base} />
      </SimpleRow>
      <SimpleRow label="Reserve Increment" data-test="reserve-increment">
        <Amount value={increment} />
      </SimpleRow>
    </>
  )
}
