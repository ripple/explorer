import { Trans } from 'react-i18next'
import { TransactionDescriptionProps } from '../types'
import { Account } from '../../Account'

export const Description = ({ data }: TransactionDescriptionProps) => {
  const Signers = data.tx.BatchSigners
  function renderSigners() {
    return Signers.map((signer, index) => (
      <span key={signer.BatchSigner.Account}>
        <Account account={signer.BatchSigner.Account} />
        {index < Signers.length - 1 && ', '}
      </span>
    ))
  }
  return (
    <div data-testid="desc">
      <Trans
        i18nKey="batch_description"
        components={{
          SignerList: <>{renderSigners()}</>,
        }}
      />
    </div>
  )
}
