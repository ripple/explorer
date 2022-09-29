import React from 'react'
import axios from 'axios'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import NetworkTabs from './NetworkTabs'
import Map from './Map'
import NodesTable from './NodesTable'
import Log from '../shared/log'
import { FETCH_INTERVAL_NODES_MILLIS, localizeNumber } from '../shared/utils'
import { useLanguage } from '../shared/hooks'

export const Nodes = () => {
  const language = useLanguage()
  const { t } = useTranslation()

  const { data } = useQuery(['fetchNodesData'], async () => fetchData(), {
    refetchInterval: FETCH_INTERVAL_NODES_MILLIS,
  })

  const fetchData = () =>
    axios
      .get('/api/v1/nodes')
      .then((resp) => {
        const nodesWithLocations = resp.data.filter(
          (node: any) => 'lat' in node,
        )
        return {
          nodes: resp.data,
          unmapped: resp.data.length - nodesWithLocations.length,
          locations: nodesWithLocations,
        }
      })
      .catch((e) => Log.error(e))

  return (
    <div className="network-page">
      {
        // @ts-ignore - Work around for complex type assignment issues
        <Map locations={data?.locations} />
      }
      <div className="stat">
        {data?.nodes && (
          <>
            <span>{t('nodes_found')}: </span>
            <span>
              {localizeNumber(data?.nodes.length, language)}
              {data?.unmapped ? (
                <i>
                  {' '}
                  ({data?.unmapped} {t('unmapped')})
                </i>
              ) : null}
            </span>
          </>
        )}
      </div>
      <div className="wrap">
        <NetworkTabs selected="nodes" />
        <NodesTable nodes={data?.nodes} />
      </div>
    </div>
  )
}
