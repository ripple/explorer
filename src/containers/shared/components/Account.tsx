import React from 'react'
import { Link } from 'react-router-dom'

export interface AccountProps {
  link?: boolean
  account: string
}

export const Account = (props: AccountProps) => {
  const { link = true, account } = props
  return link ? (
    <Link className="account" title={account} to={`/accounts/${account}`}>
      {account}
    </Link>
  ) : (
    <span className="account" title={account}>
      {account}
    </span>
  )
}
