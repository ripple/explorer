import { SetHook, SetHookInstructions } from './types'

export const parser = (tx: SetHook, meta: any): SetHookInstructions => {
  const txHookData = tx.Hooks.map((hook) => hook.Hook)
  const hooks = txHookData.filter((hook) => hook.CreateCode || hook.HookHash)
  const affectedNodes = meta.AffectedNodes.filter(
    (node: any) =>
      node.CreatedNode?.LedgerEntryType === 'Hook' ||
      (node.ModifiedNode?.LedgerEntryType === 'Hook' &&
        !!node.ModifiedNode?.PreviousFields.Hooks),
  )
  const hashes = affectedNodes.flatMap((node: any) =>
    (node.ModifiedNode?.FinalFields ?? node.CreatedNode?.NewFields)?.Hooks?.map(
      (hook: any) => hook.Hook.HookHash,
    ),
  )
  hashes.forEach((element, index) => {
    if (hooks[index] != null) hooks[index].HookHash = element
  })
  return { hooks }
}
