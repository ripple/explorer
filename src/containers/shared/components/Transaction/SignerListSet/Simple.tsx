import { useTranslation } from 'react-i18next'
import { Account } from '../../Account'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { SignerListSetInstructions } from './types'

export const Simple = ({
  data,
}: TransactionSimpleProps<SignerListSetInstructions>) => {
  const { quorum, maxSigners, signers } = data.instructions
  const { t } = useTranslation()

  return signers?.length ? (
    <>
      <SimpleRow label={t('signers')} data-testid="signers">
        <ul className="signers">
          {signers.map((d) => (
            <li key={d.account}>
              <Account account={d.account} />
              <span className="label">{` ${t('weight')}: `}</span>
              <small>{d.weight}</small>
            </li>
          ))}
        </ul>
      </SimpleRow>
      <SimpleRow label={t('quorum')} data-testid="quorum">
        {quorum}
        <span className="label"> {t('out_of')} </span>
        {maxSigners}
      </SimpleRow>
    </>
  ) : (
    <SimpleRow label="" className="unset">
      {t('unset_signer_list')}
    </SimpleRow>
  )
}
