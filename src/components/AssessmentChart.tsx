/**
 * 评估结果可视化图表组件
 */

import { Card, CardContent } from '@/components/ui/card'
import type { AssessmentResult } from '@/types/assessment'

interface AssessmentChartProps {
  assessment: AssessmentResult
}

/**
 * 简单的柱状图组件
 */
export function AssessmentChart({ assessment }: AssessmentChartProps) {
  const dimensions = [
    { name: '清晰度', value: assessment.clarity, color: 'bg-blue-500' },
    { name: '逻辑性', value: assessment.logic, color: 'bg-green-500' },
    { name: '完整性', value: assessment.completeness, color: 'bg-purple-500' },
    { name: '通俗性', value: 11 - assessment.terminology, color: 'bg-orange-500' },
  ]

  const maxValue = 10

  return (
    <Card>
      <CardContent className="pt-4 sm:pt-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">详细评分</h3>
        <div className="space-y-3 sm:space-y-4">
          {dimensions.map((dim, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="font-medium">{dim.name}</span>
                <span className="text-muted-foreground">{dim.value}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 sm:h-3 overflow-hidden">
                <div
                  className={`${dim.color} h-full rounded-full transition-all duration-500 ease-out`}
                  style={{ width: `${(dim.value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * 雷达图组件（简化版）
 */
export function AssessmentRadar({ assessment }: AssessmentChartProps) {
  const dimensions = [
    { name: '清晰度', value: assessment.clarity },
    { name: '逻辑性', value: assessment.logic },
    { name: '完整性', value: assessment.completeness },
    { name: '通俗性', value: 11 - assessment.terminology },
  ]

  const maxValue = 10
  const size = 200
  const center = size / 2
  const radius = size / 2 - 20

  // 计算雷达图顶点坐标
  const points = dimensions.map((dim, index) => {
    const angle = (index * 2 * Math.PI) / dimensions.length - Math.PI / 2
    const value = (dim.value / maxValue) * radius
    const x = center + value * Math.cos(angle)
    const y = center + value * Math.sin(angle)
    return { x, y, name: dim.name, value: dim.value }
  })

  // 生成多边形路径
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z'

  return (
    <Card>
      <CardContent className="pt-4 sm:pt-6">
        <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-center">能力雷达图</h3>
        <div className="flex justify-center overflow-x-auto">
          <svg width={size} height={size} className="overflow-visible max-w-full" viewBox={`0 0 ${size} ${size}`}>
            {/* 背景网格 */}
            {[0.5, 1].map((scale) => (
              <circle
                key={scale}
                cx={center}
                cy={center}
                r={radius * scale}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            ))}
            
            {/* 维度轴线 */}
            {dimensions.map((_, index) => {
              const angle = (index * 2 * Math.PI) / dimensions.length - Math.PI / 2
              const x2 = center + radius * Math.cos(angle)
              const y2 = center + radius * Math.sin(angle)
              return (
                <line
                  key={index}
                  x1={center}
                  y1={center}
                  x2={x2}
                  y2={y2}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                />
              )
            })}

            {/* 数据多边形 */}
            <path
              d={pathData}
              fill="rgba(59, 130, 246, 0.2)"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
            />

            {/* 数据点 */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="rgb(59, 130, 246)"
                />
                {/* 标签 */}
                <text
                  x={point.x}
                  y={point.y - 10}
                  textAnchor="middle"
                  className="text-[10px] sm:text-xs fill-gray-700 font-medium"
                >
                  {point.value}
                </text>
                {/* 维度名称 */}
                <text
                  x={point.x + (point.x - center > 0 ? 15 : -15)}
                  y={point.y + (point.y - center > 0 ? 15 : -5)}
                  textAnchor={point.x > center ? 'start' : 'end'}
                  className="text-[10px] sm:text-xs fill-gray-600"
                >
                  {point.name}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}

