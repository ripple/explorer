import { FC } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useTranslation } from 'react-i18next'
import { transactionTypes } from '../../shared/components/Transaction'
import { DefaultSimple } from '../../shared/components/Transaction/DefaultSimple'

export const Simple: FC<{
  data: any
  type: string
}> = ({ data, type }) => {
  // Locate the component for the left side of the simple tab that is unique per TransactionType.
  const { t } = useTranslation()
  const SimpleComponent = transactionTypes[type]?.Simple
  if (SimpleComponent) {
    return (
      <ErrorBoundary
        fallback={
          <div className="error">
            <div>{t('component_error')}</div>
            <div>{t('try_detailed_raw')}</div>
          </div>
        }
      >
        <SimpleComponent data={data} />
      </ErrorBoundary>
    )
  }
  return <DefaultSimple data={data} />
}
