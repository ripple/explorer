import React from 'react'
import { Account } from '../../shared/components/Account'

const render = (t, action, node, index) => {
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
    </li>
  )
}

export default render
