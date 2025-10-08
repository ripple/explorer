import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

interface FlagsCardProps {
  account: any
}

const FlagsCard = ({ account }: FlagsCardProps) => {
  const { t } = useTranslation()

  const flags = useMemo<
    Array<{
      key: string
      title: string
      description: string
      enabled: boolean
    }>
  >(() => {
    const accountFlags: string[] = account.info?.flags ?? []

    return [
      {
        key: 'lsfGlobalFreeze',
        title: t('account_flag_title_lsf_global_freeze'),
        description: t('account_flag_description_lsf_global_freeze'),
        enabled: accountFlags.includes('lsfGlobalFreeze'),
      },
      {
        key: 'lsfDisableMaster',
        title: t('account_flag_title_lsf_disable_master'),
        description: t('account_flag_description_lsf_disable_master'),
        enabled: !accountFlags.includes('lsfDisableMaster'),
      },
      {
        key: 'lsfDefaultRipple',
        title: t('account_flag_title_lsf_default_ripple'),
        description: t('account_flag_description_lsf_default_ripple'),
        enabled: accountFlags.includes('lsfDefaultRipple'),
      },
      {
        key: 'lsfAllowTrustLineClawback',
        title: t('account_flag_title_lsf_allow_trustline_clawback'),
        description: t('account_flag_description_lsf_allow_trustline_clawback'),
        enabled: accountFlags.includes('lsfAllowTrustLineClawback'),
      },
      {
        key: 'lsfRequireDestTag',
        title: t('account_flag_title_lsf_require_destination_tag'),
        description: t('account_flag_description_lsf_require_destination_tag'),
        enabled: accountFlags.includes('lsfRequireDestTag'),
      },
      {
        key: 'lsfNoFreeze',
        title: t('account_flag_title_lsf_no_freeze'),
        description: t('account_flag_description_lsf_no_freeze'),
        enabled: accountFlags.includes('lsfNoFreeze'),
      },
      {
        key: 'lsfRequireAuth',
        title: t('account_flag_title_lsf_require_auth'),
        description: t('account_flag_description_lsf_require_auth'),
        enabled: accountFlags.includes('lsfRequireAuth'),
      },
      {
        key: 'lsfDisallowXRP',
        title: t('account_flag_title_lsf_disallow_xrp'),
        description: t('account_flag_description_lsf_disallow_xrp'),
        enabled: accountFlags.includes('lsfDisallowXRP'),
      },
      {
        key: 'lsfDisallowIncomingTrustline',
        title: t('account_flag_title_lsf_disallow_incoming_trustline'),
        description: t(
          'account_flag_description_lsf_disallow_incoming_trustline',
        ),
        enabled: accountFlags.includes('lsfDisallowIncomingTrustline'),
      },
      {
        key: 'lsfDisallowIncomingPayChannel',
        title: t('account_flag_title_lsf_disallow_incoming_pay_chan'),
        description: t(
          'account_flag_description_lsf_disallow_incoming_pay_chan',
        ),
        enabled: accountFlags.includes('lsfDisallowIncomingPayChannel'),
      },
      {
        key: 'lsfDisallowIncomingNFTokenOffer',
        title: t('account_flag_title_lsf_disallow_incoming_nft_token_offer'),
        description: t(
          'account_flag_description_lsf_disallow_incoming_nft_token_offer',
        ),
        enabled: accountFlags.includes('lsfDisallowIncomingNFTokenOffer'),
      },
      {
        key: 'asfAuthorizedNFTokenMinter',
        title: t('account_flag_title_asf_authorized_nft_token_minter'),
        description: t(
          'account_flag_description_asf_authorized_nft_token_minter',
        ),
        // No ledger flag exists for the AccountSet flag `asfAuthorizedNFTokenMinter`.
        // The NFTokenMinter field's presence or absence is sufficient to determine the flag's status.
        enabled: !!account.info?.nftMinter,
      },
      {
        key: 'lsfDisallowIncomingCheck',
        title: t('account_flag_title_lsf_disallow_incoming_check'),
        description: t('account_flag_description_lsf_disallow_incoming_check'),
        enabled: accountFlags.includes('lsfDisallowIncomingCheck'),
      },
      {
        key: 'lsfDepositAuth',
        title: t('account_flag_title_lsf_deposit_auth'),
        description: t('account_flag_description_lsf_deposit_auth'),
        enabled: accountFlags.includes('lsfDepositAuth'),
      },
      {
        key: 'asfAccountTxnID',
        title: t('account_flag_title_asf_account_txn_id'),
        description: t('account_flag_description_asf_account_txn_id'),
        // No ledger flag exists for the AccountSet flag `asfAccountTxnID`.
        // The AccountTxnID field's presence or absence is sufficient to determine the flag's status.
        enabled: !!account.info?.accountTransactionID,
      },
    ]
  }, [account.info, t])

  return (
    <div className="flags-card card">
      <div className="card-header">
        <div className="header-title">{t('account_page_flags')}</div>
      </div>
      <div className="flags-list">
        {flags.map((flag, i) => (
          <div className="flag-item" key={flag.key || i}>
            <div className="flag-meta">
              <div className="flag-title">{flag.title}</div>
              <div className="flag-desc">{flag.description}</div>
            </div>
            <div
              className={`flag-status ${flag.enabled ? 'enabled' : 'disabled'}`}
            >
              {flag.enabled
                ? t('account_page_flag_status_enabled')
                : t('account_page_flag_status_disabled')}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FlagsCard
