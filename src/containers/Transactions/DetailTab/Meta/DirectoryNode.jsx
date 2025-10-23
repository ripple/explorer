import { Trans } from 'react-i18next'
import { Account } from '../../../shared/components/Account'
import { RouteLink } from '../../../shared/routing'
import { ENTRY_ROUTE } from '../../../App/routes'

const render = (t, action, node, index) => {
  const fields = node.FinalFields || node.NewFields
  return (
    <li key={`directory_${index}`} className="meta-line">
      <Trans
        i18nKey={
          fields.Owner
            ? 'transaction_owned_directory'
            : 'transaction_unowned_directory'
        }
        values={{ action }}
        components={{
          Link: (
            <RouteLink to={ENTRY_ROUTE} params={{ id: node.LedgerIndex }}>
              {/* The inner text will be replaced by the content of <Link></Link> in translations.json */}
            </RouteLink>
          ),
        }}
      />
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
