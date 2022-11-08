import { useParams } from 'react-router'
import React, { useContext, useEffect, useState } from 'react'
import { isValidClassicAddress } from 'ripple-address-codec'
import AMMAccounts from 'containers/Accounts/AMM/AMMAccounts/index'
import { connect } from 'react-redux'
import SocketContext from '../shared/SocketContext'
import { getAccountInfo } from '../../rippled/lib/rippled'
import flags from '../shared/flags'
import NoMatch from '../NoMatch'
import { BAD_REQUEST, NOT_FOUND } from '../shared/utils'
import Accounts from './index'

const ERROR_MESSAGES: { [key: string]: any } = {}
ERROR_MESSAGES[NOT_FOUND] = {
  title: 'account_not_found',
  hints: ['check_account_id'],
}
ERROR_MESSAGES[BAD_REQUEST] = {
  title: 'invalid_xrpl_address',
  hints: ['check_account_id'],
}
ERROR_MESSAGES.default = {
  title: 'generic_error',
  hints: ['not_your_fault'],
}

const getErrorMessage = (error: any) =>
  ERROR_MESSAGES[error] || ERROR_MESSAGES.default

function renderError(error: any) {
  const message = getErrorMessage(error.code)
  return (
    <div className="accounts-page">
      <NoMatch title={message.title} hints={message.hints} />
    </div>
  )
}

const AccountsRouter = () => {
  const { id: accountId } = useParams<{ id: string }>()
  const rippledSocket = useContext(SocketContext)
  const [info, setInfo] = useState<{ Flags: number }>({ Flags: 0 })
  const [error, setError] = useState<any>()
  useEffect(() => {
    if (isValidClassicAddress(accountId)) {
      getAccountInfo(rippledSocket, accountId)
        .then((data: any) => {
          setInfo(data)
        })
        .catch((e) => {
          if (e.code === 404) {
            setError(e)
          }
        })
    }
  }, [accountId, rippledSocket])

  if (error !== undefined) {
    if (error.code === 404) {
      return renderError(error)
    }
  }

  if (info.Flags & flags.accountInfo.lsfAMM) {
    return <AMMAccounts />
  }

  return <Accounts />
}

export default connect((state) => ({
  error: undefined,
  s: state,
}))(AccountsRouter)
