import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'
import './vault.scss'

export const Vault = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()

  return (
    <div className="vault-page">
      <div className="vault-header">
        <h1>{t('vault_id')}</h1>
        <div className="vault-id">{id}</div>
      </div>
      <div className="vault-content">
        <p>Vault detail page coming soon.</p>
      </div>
    </div>
  )
}

