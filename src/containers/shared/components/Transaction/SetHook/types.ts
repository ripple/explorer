interface HookGrant {
  HookGrant: {
    HookHash: string
    Authorize?: string
  }
}

interface HookParameter {
  HookParameter: {
    HookParameterName: string
    HookParameterValue: string
  }
}

export interface HookData {
  HookHash?: string
  CreateCode?: string
  Flags?: number
  HookOn?: string
  HookNamespace?: string
  HookApiVersion?: number
  HookParameters?: HookParameter[]
  HookGrants?: HookGrant[]
}

interface Hook {
  Hook: HookData
}

export interface SetHook {
  TransactionType: 'SetHook'
  Hooks: Hook[]
}

export interface SetHookInstructions {
  hooks: HookData[]
}
