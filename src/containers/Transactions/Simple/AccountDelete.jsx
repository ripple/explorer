import React from 'react'
import PropTypes from 'prop-types'
import AccountTransactionsTable from '../../Accounts/AccountTransactionsTable'

const AccountDelete = (props) => {
  const { t, data } = props
  const { account } = data.instructions
  return (
    <>
      <div className="row">
        <div style={{ width: '100%', textAlign: 'center' }}>
          Account History
        </div>
      </div>
      <div className="row">
        <AccountTransactionsTable accountId={account} t={t} />
      </div>
    </>
  )
}
AccountDelete.propTypes = {
  data: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
  ).isRequired,
  t: PropTypes.func.isRequired,
}

export default AccountDelete
