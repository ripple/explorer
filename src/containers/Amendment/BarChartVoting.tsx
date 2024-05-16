import { useState } from 'react'
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
  // Text,
  // Cell,
} from 'recharts'
import {
  BLACK_600,
  GREEN_400,
  GREY_0,
  GREY_600,
  GREY_800,
  MAGENTA_700,
} from '../shared/utils'

interface Props {
  data: any
}

type ValueType = number | string | Array<number | string>
type NameType = number | string

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<ValueType, NameType>) => {
  const { t } = useTranslation()
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label">{label}</p>
        <p className="value">
          {t('yeas_count', {
            yeas_count: payload ? payload[0].payload.yeas : 0,
          })}
        </p>
        <p className="value">
          {t('yeas_percent', {
            yeas_percent: payload
              ? payload[0].payload.yeas_percent.toFixed(2)
              : 0,
          })}
        </p>
        <p className="value">
          {t('nays_count', {
            nays_count: payload ? payload[0].payload.nays : 0,
          })}
        </p>
        <p className="value">
          {t('nays_percent', {
            nays_percent: payload
              ? payload[0].payload.nays_percent.toFixed(2)
              : 0,
          })}
        </p>
      </div>
    )
  }
  return null
}

const CustomLegend = () => {
  const { t } = useTranslation()
  return (
    <div className="custom-legend">
      <div className="legend-color">
        <div className="segment">
          <span className="icon yea" />
          <span className="text">{t('yeas')}</span>
        </div>
        <div className="segment">
          <span className="icon nay" />
          <span className="text">{t('nays')}</span>
        </div>
      </div>
    </div>
  )
}

export const BarChartVoting = ({ data }: Props) => {
  const { t } = useTranslation()
  const [showTooltips, setShowTooltips] = useState(false)

  return (
    <div className="barchart" title="barchart">
      <CustomLegend />
      <ResponsiveContainer height={532} width="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <XAxis
            dataKey="label"
            dy={12}
            height={90}
            tickLine={false}
            minTickGap={-1}
            stroke={BLACK_600}
            interval={0}
            tick={{ fill: GREY_0 }}
          />
          <YAxis
            className="yAxis"
            tickLine={false}
            stroke={BLACK_600}
            tick={{ fill: GREY_0 }}
          >
            <Label
              className="y-label"
              value={t('%_of_validators')}
              angle={-90}
              position="insideTop"
              dx={45}
              dy={55}
              style={{ fill: GREY_0 }}
            />
          </YAxis>
          <Bar
            dataKey="yeas_percent"
            barSize={30}
            fill={GREEN_400}
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
            onMouseOver={() => setShowTooltips(true)}
            onMouseLeave={() => setShowTooltips(false)}
          />
          <Bar
            dataKey="nays_percent"
            barSize={30}
            fill={MAGENTA_700}
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
            onMouseOver={() => setShowTooltips(true)}
            onMouseLeave={() => setShowTooltips(false)}
          />
          <Tooltip
            content={CustomTooltip}
            cursor={false}
            offset={-10}
            wrapperStyle={{
              backgroundColor: GREY_600,
              borderRadius: 8,
              border: `1px solid ${GREY_800}`,
              opacity: showTooltips ? '100%' : '0',
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
