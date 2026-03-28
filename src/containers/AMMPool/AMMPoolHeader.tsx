import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import Currency from '../shared/components/Currency'
import { FormattedBalance } from './types'

interface AMMPoolHeaderProps {
  asset1: FormattedBalance | null
  asset2: FormattedBalance | null
}

export const AMMPoolHeader: FC<AMMPoolHeaderProps> = ({ asset1, asset2 }) => {
  const { t } = useTranslation()

  return (
    <div className="amm-pool-header">
      <div className="amm-pool-header-left">
        <h1 className="amm-pool-title">{t('amm_pool')}</h1>
        {asset1 && asset2 && (
          <span className="amm-pool-token-badge">
            <Currency
              currency={asset1.currency}
              issuer={asset1.issuer}
              link
              shortenIssuer
            />
            <span className="badge-separator">/</span>
            <Currency
              currency={asset2.currency}
              issuer={asset2.issuer}
              link={asset2.currency !== 'XRP'}
              shortenIssuer
            />
          </span>
        )}
      </div>
    </div>
  )
}
