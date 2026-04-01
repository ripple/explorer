// Union type for all possible node types - using any to handle the different field structures
export type MetaNode = any

// Render function signatures for Meta components
export type MetaRenderFunction = (
  t: any,
  language: string,
  action: string,
  node: MetaNode,
  index: number,
) => JSX.Element

export type MetaRenderFunctionWithTx = (
  t: any,
  language: string,
  action: string,
  node: MetaNode,
  index: number,
  tx: any,
) => JSX.Element

export type DirectoryNodeRenderFunction = (
  t: any,
  action: string,
  node: MetaNode,
  index: number,
) => JSX.Element
