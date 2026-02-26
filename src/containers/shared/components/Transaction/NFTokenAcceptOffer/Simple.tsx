import { useTranslation } from 'react-i18next'
import { Account } from '../../Account'
import { SimpleRow } from '../SimpleRow'
import { Amount } from '../../Amount'
import { NFTokenAcceptOfferInstructions } from './types'
import { TransactionSimpleComponent, TransactionSimpleProps } from '../types'
import { NFTokenLink } from '../../NFTokenLink'
import { ENTRY_ROUTE } from '../../../../App/routes'
import { RouteLink } from '../../../routing'

export const Simple: TransactionSimpleComponent = ({
  data,
}: TransactionSimpleProps<NFTokenAcceptOfferInstructions>) => {
  const { acceptedOfferIDs, amount, tokenID, seller, buyer } = data.instructions
  const { t } = useTranslation()

  return (
    <>
      {acceptedOfferIDs.map((offer) => (
        <SimpleRow
          label={t('offer_index')}
          className="dt"
          data-testid="offer-id"
        >
          <RouteLink to={ENTRY_ROUTE} params={{ id: offer }}>
            {offer}
          </RouteLink>
        </SimpleRow>
      ))}
      {amount && seller && buyer && tokenID && (
        <>
          <SimpleRow label={t('seller')} data-testid="seller">
            <Account account={seller} />
          </SimpleRow>
          <SimpleRow label={t('buyer')} data-testid="buyer">
            <Account account={buyer} />
          </SimpleRow>
          <SimpleRow
            label={t('token_id')}
            className="dt"
            data-testid="token-id"
          >
            <NFTokenLink tokenID={tokenID} />
          </SimpleRow>
          <SimpleRow label={t('amount')} data-testid="amount">
            <Amount value={amount} displayIssuer />
          </SimpleRow>
        </>
      )}
    </>
  )
}
