import { SetHook, SetHookInstructions } from './types'

export const parser = (tx: SetHook, meta: any): SetHookInstructions => {
  const hooks = tx.Hooks.map((hook) => hook.Hook)
  const affectedNodes = meta.AffectedNodes.filter(
    (node: any) =>
      node.CreatedNode?.LedgerEntryType === 'Hook' ||
      (node.ModifiedNode?.LedgerEntryType === 'Hook' &&
        !!node.ModifiedNode?.PreviousFields?.Hooks),
  )
  const hashes = affectedNodes.flatMap(
    (node: any) =>
      (
        node.ModifiedNode?.FinalFields ?? node.CreatedNode?.NewFields
      )?.Hooks?.map((hook: any) => hook.Hook.HookHash),
  )
  // TODO: there may be bugs here when a `HookHash` is already specified in a hook
  // It's difficult to understand what situation that would be in, so this is left here for now
  hashes.forEach((element, index) => {
    if (hooks[index] != null) hooks[index].HookHash = element
  })

  return { hooks: hooks.filter((hook) => hook.CreateCode || hook.HookHash) }
}
