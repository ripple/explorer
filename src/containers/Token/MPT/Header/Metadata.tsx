import { useTranslation } from 'react-i18next'
import { JsonView } from '../../../shared/components/JsonView'

interface MetadataProps {
  decodedMetadata: Record<string, unknown>
}

export const Metadata = ({ decodedMetadata }: MetadataProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <div className="header-box metadata-box">
      <div className="header-box-title">{t('mpt_page.metadata')}</div>
      <div className="header-box-contents metadata-json">
        <JsonView data={decodedMetadata} showExpandButton />
      </div>
    </div>
  )
}
