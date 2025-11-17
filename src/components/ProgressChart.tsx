/**
 * 学习进度图表组件
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { KnowledgeRecord } from '@/types/knowledge'

interface ProgressChartProps {
  records: KnowledgeRecord[]
}

/**
 * 简单的折线图组件，显示评分趋势
 */
export function ProgressChart({ records }: ProgressChartProps) {
  // 过滤出有评估结果的记录，按时间排序
  const validRecords = records
    .filter(r => r.assessment)
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
    .slice(-10) // 只显示最近10条记录

  if (validRecords.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            暂无评估记录，完成训练后即可查看进度
          </p>
        </CardContent>
      </Card>
    )
  }

  const maxScore = 10
  const chartHeight = 200
  const chartWidth = 100
  const padding = 20

  // 计算每个点的坐标
  const points = validRecords.map((record, index) => {
    const x = padding + (index * (chartWidth - 2 * padding)) / (validRecords.length - 1 || 1)
    const y = chartHeight - padding - ((record.assessment!.overall / maxScore) * (chartHeight - 2 * padding))
    return { x, y, score: record.assessment!.overall, date: record.createdAt }
  })

  // 生成路径
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  // 计算平均分
  const avgScore = validRecords.reduce((sum, r) => sum + r.assessment!.overall, 0) / validRecords.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">学习进度趋势</CardTitle>
        <p className="text-sm text-muted-foreground">
          最近 {validRecords.length} 次训练的平均分：<span className="font-semibold text-blue-600">{avgScore.toFixed(1)}</span> 分
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ height: chartHeight + 40 }}>
          <svg width="100%" height={chartHeight} className="overflow-visible">
            {/* 背景网格 */}
            {[0, 0.5, 1].map((scale) => (
              <line
                key={scale}
                x1={padding}
                y1={padding + scale * (chartHeight - 2 * padding)}
                x2={chartWidth}
                y2={padding + scale * (chartHeight - 2 * padding)}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray={scale === 0.5 ? "4 4" : "0"}
              />
            ))}

            {/* 坐标轴标签 */}
            <text x={padding - 5} y={padding} className="text-xs fill-gray-500" textAnchor="end">
              10
            </text>
            <text x={padding - 5} y={chartHeight - padding} className="text-xs fill-gray-500" textAnchor="end">
              0
            </text>

            {/* 折线 */}
            <path
              d={pathData}
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 数据点 */}
            {points.map((point, index) => (
              <g key={index}>
                <circle
                  cx={point.x}
                  cy={point.y}
                  r="4"
                  fill="rgb(59, 130, 246)"
                  className="hover:r-6 transition-all cursor-pointer"
                />
                {/* 悬停显示分数 */}
                <title>
                  {point.score} 分 - {new Date(point.date).toLocaleDateString()}
                </title>
              </g>
            ))}
          </svg>

          {/* X轴标签 */}
          <div className="flex justify-between mt-2 text-xs text-muted-foreground px-5">
            {validRecords.map((record, index) => (
              <span key={index} className="transform -rotate-45 origin-left">
                {new Date(record.createdAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

/**
 * 评分分布统计
 */
export function ScoreDistribution({ records }: ProgressChartProps) {
  const validRecords = records.filter(r => r.assessment)
  
  if (validRecords.length === 0) {
    return null
  }

  // 统计各分数段的数量
  const distribution = {
    excellent: validRecords.filter(r => r.assessment!.overall >= 8).length,
    good: validRecords.filter(r => r.assessment!.overall >= 6 && r.assessment!.overall < 8).length,
    needImprove: validRecords.filter(r => r.assessment!.overall < 6).length,
  }

  const total = validRecords.length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">评分分布</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-600">优秀 (8-10分)</span>
              <span className="text-sm text-muted-foreground">
                {distribution.excellent} 次 ({((distribution.excellent / total) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(distribution.excellent / total) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-yellow-600">良好 (6-8分)</span>
              <span className="text-sm text-muted-foreground">
                {distribution.good} 次 ({((distribution.good / total) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(distribution.good / total) * 100}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-red-600">需改进 (&lt;6分)</span>
              <span className="text-sm text-muted-foreground">
                {distribution.needImprove} 次 ({((distribution.needImprove / total) * 100).toFixed(1)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(distribution.needImprove / total) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

