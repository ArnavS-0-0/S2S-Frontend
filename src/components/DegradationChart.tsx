import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { DegradationPoint } from '../pages/Analysis'

type DegradationChartProps = {
  data: DegradationChartPoint[]
}

type DegradationChartPoint = DegradationPoint

export function DegradationChart({ data }: DegradationChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid stroke="#1f2b27" strokeDasharray="3 3" />
        <XAxis
          dataKey="cycle"
          stroke="#94a3b8"
          tickLine={false}
          axisLine={{ stroke: '#1f2b27' }}
          tickMargin={8}
          fontSize={11}
        />
        <YAxis
          stroke="#94a3b8"
          tickLine={false}
          axisLine={{ stroke: '#1f2b27' }}
          tickMargin={8}
          fontSize={11}
          unit="%"
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#020817',
            borderRadius: 8,
            border: '1px solid rgba(148,163,184,0.4)',
            fontSize: 12,
          }}
          labelStyle={{ color: '#e2e8f0', marginBottom: 4 }}
        />
        <Line
          type="monotone"
          dataKey="capacity"
          stroke="#63b87f"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

