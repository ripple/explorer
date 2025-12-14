import { useTranslation } from 'react-i18next'
import { JsonView } from '../../../shared/components/JsonView'

interface MetadataProps {
  decodedMPTMetadata: Record<string, unknown> | string
}

export const Metadata = ({
  decodedMPTMetadata,
}: MetadataProps): JSX.Element => {
  const { t } = useTranslation()
  const isString = typeof decodedMPTMetadata === 'string'

  return (
    <div className="header-box metadata-box">
      <div className="header-box-title">{t('metadata')}</div>
      <div className="header-box-contents metadata-json">
        {isString ? (
          <div className="metadata-string">{decodedMPTMetadata}</div>
        ) : (
          <JsonView data={decodedMPTMetadata} showExpandButton />
        )}
      </div>
    </div>
  )
}
