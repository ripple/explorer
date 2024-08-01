import { useTranslation } from 'react-i18next'
import { Account } from '../../Account'
import { TransactionDescriptionProps } from '../types'
import { SignerListSet } from './types'

export const Description = ({
  data,
}: TransactionDescriptionProps<SignerListSet>) => {
  const { tx } = data
  const { t } = useTranslation()
  return tx.SignerQuorum === 0 ? (
    <div>{t('unset_signer_list_description')}</div>
  ) : (
    <>
      <div>
        {t('set_signer_list_description', { quorum: tx.SignerQuorum })}:
      </div>
      <ul className="signers">
        {tx.SignerEntries?.map((d) => (
          <li key={d.SignerEntry.Account} data-testid="signer">
            <Account account={d.SignerEntry.Account} />
            <span className="label">{` - ${t('weight')}: `}</span>
            <span>{d.SignerEntry.SignerWeight}</span>
          </li>
        ))}
      </ul>
    </>
  )
}
