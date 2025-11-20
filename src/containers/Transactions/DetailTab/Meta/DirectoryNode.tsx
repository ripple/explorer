import { TFunction } from 'i18next'
import { Account } from '../../../shared/components/Account'

const render = (
  t: TFunction<'translations', undefined>,
  action: string,
  node: any,
  index: number,
) => {
  const fields = node.FinalFields || node.NewFields
  return (
    <li key={`directory_${index}`} className="meta-line">
      {t(
        fields.Owner
          ? 'transaction_owned_directory'
          : 'transaction_unowned_directory',
        {
          action,
        },
      )}
      {fields.Owner && (
        <span>
          {' '}
          <Account account={fields.Owner} />
        </span>
      )}
      {fields.DomainID && (
        <span>
          {t('pertaining_to_the_Permissioned_Domain')}: {fields.DomainID}
        </span>
      )}
    </li>
  )
}

export default render
