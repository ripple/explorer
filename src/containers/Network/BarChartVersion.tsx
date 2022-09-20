import React from 'react'
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
} from 'recharts'
import {
  ValueType,
  NameType,
} from 'recharts/src/component/DefaultTooltipContent'
import { GREY, PURPLE } from '../shared/utils'
import './css/barchart.scss'

interface Props {
  data: any[]
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

const BarChartVersion = (props: Props) => {
  const { data } = props
  const { t } = useTranslation()
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
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={false}
            offset={-10}
            wrapperStyle={{ backgroundColor: 'white', borderRadius: 8 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BarChartVersion
