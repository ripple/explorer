import { RouteLink } from '../routing'
import { ACCOUNT } from '../../App/routes'

export interface AccountProps {
  account: string
  link?: boolean
  tag?: number
}

export const Account = (props: AccountProps) => {
  const { account, link = true, tag } = props
  const parts = account.split(':')
  const computedTag = tag || parts[1]

  return (
    <>
      {link ? (
        <RouteLink
          className="account"
          title={parts[0]}
          to={ACCOUNT}
          params={{ id: parts[0] }}
        >
          {parts[0]}
        </RouteLink>
      ) : (
        <span className="account" title={parts[0]}>
          {parts[0]}
        </span>
      )}
      {computedTag && <span className="dt">:{computedTag}</span>}
    </>
  )
}
