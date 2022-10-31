import React from 'react'
import PropTypes from 'prop-types'
import { ACCOUNT_FLAGS } from '../../shared/transactionUtils'
import DomainLink from '../../shared/components/DomainLink'
import { Account } from '../../shared/components/Account'

const AccountSet = (props) => {
  const { data, t } = props
  const {
    domain,
    email_hash: email,
    message_key: messageKey,
    set_flag: setFlag,
    clear_flag: clearFlag,
    nftoken_minter: nftokenMinter,
  } = data.instructions

  return (
    <>
      {domain && (
        <div className="row">
          <div className="label">{t('domain')}</div>
          <div className="value">
            <DomainLink decode domain={domain} />
          </div>
        </div>
      )}
      {email && (
        <div className="row">
          <div className="label">{t('email_hash')}</div>
          <div className="value">{email}</div>
        </div>
      )}
      {messageKey && (
        <div className="row">
          <div className="label">{t('message_key')}</div>
          <div className="value">{messageKey}</div>
        </div>
      )}
      {setFlag && (
        <div className="row">
          <div className="label">{t('set_flag')}</div>
          <div className="value flag">{ACCOUNT_FLAGS[setFlag] || setFlag}</div>
        </div>
      )}
      {clearFlag && (
        <div className="row">
          <div className="label">{t('clearFlag')}</div>
          <div className="value flag">
            {ACCOUNT_FLAGS[clearFlag] || clearFlag}
          </div>
        </div>
      )}
      {nftokenMinter && (
        <div className="row">
          <div className="label">{t('nftoken_minter')}</div>
          <div className="value">
            <Account account={nftokenMinter} />
          </div>
        </div>
      )}
      {Object.keys(data.instructions).length === 0 && (
        <div className="row empty">{t('no_account_settings')}</div>
      )}
    </>
  )
}

AccountSet.propTypes = {
  t: PropTypes.func.isRequired,
  data: PropTypes.shape({
    instructions: PropTypes.shape({
      domain: PropTypes.string,
      email_hash: PropTypes.string,
      message_key: PropTypes.string,
      set_flag: PropTypes.string,
      clear_flag: PropTypes.string,
      nftoken_minter: PropTypes.string,
    }),
  }).isRequired,
}

export default AccountSet
