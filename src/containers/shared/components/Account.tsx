import { MouseEventHandler, ReactNode } from 'react'
import { RouteLink } from '../routing'
import { ACCOUNT_ROUTE } from '../../App/routes'

export interface AccountProps {
  account: string
  link?: boolean
  tag?: number
  onClick?: MouseEventHandler<HTMLElement>
  displayText?: ReactNode
}

export const Account = (props: AccountProps) => {
  const { account, link = true, tag, onClick, displayText } = props
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
          {displayText ?? parts[0]}
        </RouteLink>
      ) : (
        <span className="account" data-testid="account" title={parts[0]}>
          {displayText ?? parts[0]}
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
