import { useTranslation } from 'react-i18next'
import { buildHookFlags } from '../../../transactionUtils'
import { Account } from '../../Account'
import { SimpleGroup } from '../SimpleGroup'
import { SimpleRow } from '../SimpleRow'
import { TransactionSimpleProps } from '../types'
import { HookData, SetHookInstructions } from './types'
import { hookOnToTxList } from './utils'

export const Simple = ({
  data,
}: TransactionSimpleProps<SetHookInstructions>) => {
  const { hooks } = data.instructions
  const { t } = useTranslation()

  const renderHook = (hook: HookData) => (
    <SimpleGroup title={t('hook')} key={hook.HookHash || hook.CreateCode}>
      <SimpleRow label={t('hash')} data-testid="hook-hash">
        {hook.HookHash ?? 'undefined'}
      </SimpleRow>
      {hook.HookOn && (
        <SimpleRow label={t('triggered_on')} data-testid="hook-on">
          {/* // TODO: use the transaction badges here instead of just text */}
          {hookOnToTxList(hook.HookOn)?.join(', ') ?? <em>None</em>}
        </SimpleRow>
      )}
      {hook.HookGrants && (
        <SimpleRow label={t('grant')} data-testid="hook-grant">
          {hook.HookGrants.map((hookGrant) => {
            const grant = hookGrant.HookGrant
            return (
              <div className="grant" key={grant.HookHash}>
                <div className="hash">{grant.HookHash}</div>
                {grant.Authorize && <Account account={grant.Authorize} />}
              </div>
            )
          })}
        </SimpleRow>
      )}
      {hook.HookNamespace && (
        <SimpleRow label={t('namespace')} data-testid="hook-namespace">
          {hook.HookNamespace}
        </SimpleRow>
      )}
      {hook.Flags && (
        <SimpleRow label={t('flags')} data-testid="hook-flags">
          <em>{buildHookFlags(hook.Flags).join(', ')}</em>
        </SimpleRow>
      )}
      {hook.HookApiVersion != null && (
        <SimpleRow label={t('api_version')} data-testid="hook-api-version">
          {hook.HookApiVersion}
        </SimpleRow>
      )}
    </SimpleGroup>
  )

  return <>{hooks.map(renderHook)}</>
}
