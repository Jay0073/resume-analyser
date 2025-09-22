import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AnalyticsChartsProps {
  analytics: {
    action_verbs: {
      count: number
      unique_count: number
      usage_frequency: Array<{ verb: string; count: number }>
    }
    readability: {
      grade_level: string
      score_explanation: string
    }
    resume_length: {
      pages: number
      words: number
      sentiment: string
    }
  }
  className?: string
}

function getSentimentColor(sentiment: string): string {
  switch (sentiment.toLowerCase()) {
    case 'ideal': return 'text-chart-1'
    case 'good': return 'text-chart-1'
    case 'too short': return 'text-chart-2'
    case 'too long': return 'text-destructive'
    default: return 'text-muted-foreground'
  }
}

function getSentimentVariant(sentiment: string): 'default' | 'secondary' | 'destructive' {
  switch (sentiment.toLowerCase()) {
    case 'ideal': return 'default'
    case 'good': return 'default'
    case 'too short': return 'secondary'
    case 'too long': return 'destructive'
    default: return 'secondary'
  }
}

export default function AnalyticsCharts({ analytics, className }: AnalyticsChartsProps) {
  const maxVerbCount = Math.max(...analytics.action_verbs.usage_frequency.map(v => v.count))

  return (
    <div className={cn("space-y-6", className)}>
      {/* Action Verbs - Full width */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Action Verbs Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-3xl font-bold text-chart-1" data-testid="verbs-total">{analytics.action_verbs.count}</span>
                <p className="text-sm text-muted-foreground">Total Count</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-3xl font-bold text-chart-2" data-testid="verbs-unique">{analytics.action_verbs.unique_count}</span>
                <p className="text-sm text-muted-foreground">Unique Verbs</p>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium mb-3">Most Used</p>
              <div className="space-y-2">
                {analytics.action_verbs.usage_frequency.slice(0, 3).map((verb, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm font-medium min-w-0 flex-1 truncate" data-testid={`verb-${index}`}>{verb.verb}</span>
                    <Progress 
                      value={(verb.count / maxVerbCount) * 100} 
                      className="w-20 h-2" 
                    />
                    <span className="text-xs text-muted-foreground min-w-fit">{verb.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Readability and Resume Length */}
      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">Readability</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col justify-center">
            <div className="text-center space-y-4">
              <Badge variant="outline" className="text-base px-4 py-2" data-testid="readability-grade">
                {analytics.readability.grade_level}
              </Badge>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {analytics.readability.score_explanation}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-lg">Resume Length</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Pages</span>
                <span className="text-2xl font-bold text-chart-1" data-testid="length-pages">{analytics.resume_length.pages}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Words</span>
                <span className="text-2xl font-bold text-chart-2" data-testid="length-words">{analytics.resume_length.words}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-muted-foreground">Assessment</span>
                <Badge 
                  variant={getSentimentVariant(analytics.resume_length.sentiment)}
                  data-testid="length-sentiment"
                  className="text-sm"
                >
                  {analytics.resume_length.sentiment}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}