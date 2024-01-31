import ReactJson from 'react18-json-view'

import './json-view.scss'

export const JsonView = ({ data }: { data: any }) => (
  <ReactJson
    src={data}
    collapsed={5}
    collapseStringsAfterLength={65}
    customizeNode={(params) => {
      if (params.node === undefined)
        return { className: 'json-view--undefined' }
      return undefined
    }}
  />
)
