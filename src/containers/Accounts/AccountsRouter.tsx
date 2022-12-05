import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import AMMAccounts from 'containers/Accounts/AMM/AMMAccounts/index'
import { connect } from 'react-redux'
import SocketContext from '../shared/SocketContext'
import { getAccountInfo } from '../../rippled/lib/rippled'
import flags from '../shared/flags'
import NoMatch from '../NoMatch'
import Accounts from './index'
import { ERROR_MESSAGES } from './Errors'
import Loader from '../shared/components/Loader'

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
  const [error, setError] = useState<any>()
  const [comp, setComp] = useState<any>()
  useEffect(() => {
    getAccountInfo(rippledSocket, accountId)
      .then((data: any) => {
        if (data.Flags & flags.accountInfo.lsfAMM) {
          setComp(<AMMAccounts />)
        } else {
          setComp(<Accounts />)
        }
      })
      .catch((e) => {
        if (e.code === 404) {
          setError(e)
        }
      })
  }, [accountId, rippledSocket])

  if (error !== undefined) {
    if (error.code === 404) {
      return renderError(error)
    }
  }

  return comp || <Loader />
}

export default connect(() => ({}))(AccountsRouter)
