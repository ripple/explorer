import React from 'react'
import { Link } from 'react-router-dom'

export interface AccountProps {
  link?: boolean
  account: string
}

export const Account = (props: AccountProps) => {
  const { link = true, account } = props
  const parts = account.split(':')

  return (
    <>
      {link ? (
        <Link className="account" title={parts[0]} to={`/accounts/${parts[0]}`}>
          {parts[0]}
        </Link>
      ) : (
        <span className="account" title={parts[0]}>
          {parts[0]}
        </span>
      )}
      {parts[1] && <span className="dt">:{parts[1]}</span>}
    </>
  )
}
