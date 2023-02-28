import { TransactionDescriptionProps } from '../types'
import { parser } from './parser'
import { Amount } from '../../Amount'

export const Description = ({ data }: TransactionDescriptionProps) => {
  const { fee, base, increment } = parser(data.tx)

  return (
    <>
      <div data-test="fees-line">
        Future transactions will require a minimum fee of <Amount value={fee} />
        .
      </div>
      <div data-test="reserves-line">
        Accounts must now hold a base of <Amount value={base} /> and an
        additional <Amount value={increment} /> for each additional object that
        account owns.
      </div>
      <br />
      <div data-test="documentation-line">
        Visit the docs: <a href="https://xrpl.org/fees.html">Fees</a>
      </div>
    </>
  )
}
