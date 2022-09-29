import React, { useState } from 'react'
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
  const [locations, setLocations] = useState([])
  const [unmapped, setUnmapped] = useState(0)

  const { data: nodes } = useQuery(['fetchData'], async () => fetchData(), {
    refetchInterval: FETCH_INTERVAL_NODES_MILLIS,
    refetchOnMount: true,
  })

  const fetchData = () => {
    const fetchedData = axios
      .get('/api/v1/nodes')
      .then((resp) => {
        const nodesWithLocations = resp.data.filter(
          (node: any) => 'lat' in node,
        )
        setUnmapped(resp.data.length - nodesWithLocations.length)
        setLocations(nodesWithLocations)
        return resp.data
      })
      .catch((e) => Log.error(e))
    return fetchedData
  }

  return (
    <div className="network-page">
      {
        // @ts-ignore - Work around for complex type assignment issues
        <Map locations={locations} />
      }
      <div className="stat">
        {nodes && (
          <>
            <span>{t('nodes_found')}: </span>
            <span>
              {localizeNumber(nodes.length, language)}
              {unmapped ? (
                <i>
                  {' '}
                  ({unmapped} {t('unmapped')})
                </i>
              ) : null}
            </span>
          </>
        )}
      </div>
      <div className="wrap">
        <NetworkTabs selected="nodes" />
        <NodesTable nodes={nodes} />
      </div>
    </div>
  )
}
