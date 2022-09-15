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
import {
  GREY,
  BLUE,
  RED,
  GREEN,
  PURPLE,
  CHART_HEIGHT,
  CHART_MARGIN,
  CHART_YAXIS_LABEL,
  BAR_SIZE,
  BAR_RADIUS,
  CHART_XAXIS,
  BAR_TOOLTIPS,
} from '../shared/utils'
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
      <ResponsiveContainer height={CHART_HEIGHT} width="95%">
        <BarChart data={data} margin={CHART_MARGIN}>
          <XAxis
            dataKey="label"
            angle={CHART_XAXIS.angle}
            dy={CHART_XAXIS.dy}
            dx={CHART_XAXIS.dx}
            height={CHART_XAXIS.height}
            tickLine={CHART_XAXIS.tickLine}
            minTickGap={CHART_XAXIS.minTickGap}
            stroke={GREY}
            interval={CHART_XAXIS.interval}
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
              angle={CHART_YAXIS_LABEL.angle}
              position={CHART_YAXIS_LABEL.position as any}
              dx={CHART_YAXIS_LABEL.dx}
              dy={CHART_YAXIS_LABEL.dy}
            />
          </YAxis>
          <Bar
            dataKey="value"
            barSize={BAR_SIZE}
            fill={PURPLE}
            radius={BAR_RADIUS as any}
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
              cursor={BAR_TOOLTIPS.cursor}
              position={{
                x: posData.x - BAR_TOOLTIPS.posX,
                y: posData.y - BAR_TOOLTIPS.posY,
              }}
              offset={BAR_TOOLTIPS.offset}
            />
          ) : null}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChartVersion
