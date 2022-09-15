import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
  Label,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts'
import {
  ValueType,
  NameType,
} from 'recharts/src/component/DefaultTooltipContent'
import { GREY, BLUE, RED, GREEN, PURPLE } from '../shared/utils'
import './css/barchart.scss'

interface Props {
  data: any[]
  stableVersion: string | null
}

interface BarCoordinates {
  x: number
  y: number
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  const { t } = useTranslation()
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label">{t('version_display', { version: label })}</p>
        <p className="value">
          {t('nodes_count', { count: payload ? payload[0].payload.count : 0 })}
        </p>
      </div>
    )
  }
  return null
}

const renderLegend = (stableVersion: string | null, t: any) => (
  <div className="legend">
    <div className="legend-text">
      <span>{t('current_stable_version')}:</span>
      <span style={{ color: GREEN }}>
        {' '}
        {t('stable_version', { stableVersion })}{' '}
      </span>
    </div>
  </div>
)

const stableColorCode = (dataLabel: string, stableVersion: string) => {
  if (dataLabel === stableVersion) return GREEN
  if (dataLabel < stableVersion) return RED
  return BLUE
}

const BarChartVersion = (props: Props) => {
  const { data, stableVersion } = props
  const { t } = useTranslation()
  const [posData, setposData] = useState<BarCoordinates>({ x: 0, y: 0 })
  const [showTooltip, setShowTooltip] = useState(false)
  return (
    <div className="barchart">
      <ResponsiveContainer height={532} width="95%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <XAxis
            dataKey="label"
            angle={-65}
            dy={30}
            dx={-7}
            height={90}
            tickLine={false}
            minTickGap={-1}
            stroke={GREY}
            interval={0}
          />
          <YAxis
            className="yAxis"
            tickLine={false}
            tickFormatter={(tick) => `${tick}%`}
            stroke={GREY}
          >
            <Label
              className="y-label"
              value={t('%_of_total_nodes')}
              angle={-90}
              position="insideTop"
              dx={45}
              dy={65}
            />
          </YAxis>
          <Bar
            dataKey="value"
            barSize={30}
            fill={PURPLE}
            radius={[4, 4, 0, 0]}
            onMouseOver={(barRegion) => {
              setposData({ x: barRegion.x, y: barRegion.y })
            }}
            onMouseEnter={() => {
              setShowTooltip(true)
            }}
            onMouseLeave={() => {
              setShowTooltip(false)
            }}
          >
            {stableVersion &&
              data.map((_entry, index) => (
                <Cell
                  fill={stableColorCode(data[index].label, stableVersion)}
                />
              ))}
          </Bar>
          <Legend
            align="right"
            verticalAlign="top"
            content={renderLegend(stableVersion, t)}
          />
          {showTooltip ? (
            <Tooltip
              content={<CustomTooltip />}
              cursor={false}
              position={{
                x: posData.x - 40,
                y: posData.y - 70,
              }}
              offset={-10}
            />
          ) : null}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChartVersion
