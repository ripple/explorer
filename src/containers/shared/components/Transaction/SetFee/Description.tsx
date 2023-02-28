import { Trans } from 'react-i18next'
import { TransactionDescriptionProps } from '../types'
import { parser } from './parser'
import { Amount } from '../../Amount'

export const Description = ({ data }: TransactionDescriptionProps) => {
  const { fee, reserve, increment } = parser(data.tx)

  return (
    <>
      <div data-test="fees-line">
        <Trans
          i18nKey="setfee_fees_description"
          components={{
            amount: <Amount value={fee} />,
          }}
        />
      </div>
      <div data-test="reserves-line">
        <Trans
          i18nKey="setfee_reserves_description"
          components={{
            base: <Amount value={reserve} />,
            increment: <Amount value={increment} />,
          }}
        />
      </div>
      <br />
      <div data-test="documentation-line">
        <Trans
          i18nKey="setfee_docs_description"
          components={[<a href="https://xrpl.org/fees.html">Placeholder</a>]}
        />
      </div>
    </>
  )
}
