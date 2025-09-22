import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface ScoreDisplayProps {
  scores: {
    overall: number
    ats_friendliness: number
    layout_and_formatting: number
    impact_and_quantification: number
  }
  className?: string
}

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-chart-1'
  if (score >= 60) return 'text-chart-2'
  return 'text-destructive'
}

function getScoreBadgeVariant(score: number): 'default' | 'secondary' | 'destructive' {
  if (score >= 80) return 'default'
  if (score >= 60) return 'secondary' 
  return 'destructive'
}

export default function ScoreDisplay({ scores, className }: ScoreDisplayProps) {
  const scoreItems = [
    { label: 'ATS Friendliness', value: scores.ats_friendliness, description: 'How well your resume passes automated screening' },
    { label: 'Layout & Formatting', value: scores.layout_and_formatting, description: 'Visual appeal and professional structure' },
    { label: 'Impact & Quantification', value: scores.impact_and_quantification, description: 'Measurable achievements and concrete results' }
  ]

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overall Score */}
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Overall Resume Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-6xl font-bold mb-2">
            <span className={getScoreColor(scores.overall * 10)} data-testid="score-overall">
              {scores.overall}
            </span>
            <span className="text-2xl text-muted-foreground">/10</span>
          </div>
          <Badge variant={getScoreBadgeVariant(scores.overall * 10)} className="text-sm">
            {scores.overall >= 8 ? 'Excellent' : scores.overall >= 6 ? 'Good' : 'Needs Improvement'}
          </Badge>
        </CardContent>
      </Card>

      {/* Detailed Scores */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scoreItems.map((item, index) => (
          <Card key={index} className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium leading-tight">{item.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-center">
                <span className={cn("text-3xl font-bold", getScoreColor(item.value))} data-testid={`score-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                  {item.value}%
                </span>
              </div>
              <Progress value={item.value} className="h-2" />
              <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}