import { MouseEventHandler } from 'react'
import { RouteLink } from '../routing'
import { ACCOUNT_ROUTE } from '../../App/routes'

export interface AccountProps {
  account: string
  link?: boolean
  tag?: number
  onClick?: MouseEventHandler<HTMLElement>
}

export const Account = (props: AccountProps) => {
  const { account, link = true, tag, onClick } = props
  const parts = account.split(':')
  const computedTag = tag || parts[1]

  return (
    <>
      {link ? (
        <RouteLink
          className="account"
          data-testid="account"
          title={parts[0]}
          to={ACCOUNT_ROUTE}
          params={{ id: parts[0] }}
          onClick={onClick}
        >
          {parts[0]}
        </RouteLink>
      ) : (
        <span className="account" data-testid="account" title={parts[0]}>
          {parts[0]}
        </span>
      )}
      {computedTag && (
        <span className="dt" data-testid="dt">
          :{computedTag}
        </span>
      )}
    </>
  )
}
