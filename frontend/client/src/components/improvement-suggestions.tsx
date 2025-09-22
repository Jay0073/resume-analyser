import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Info, AlertCircle, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImprovementSuggestionsProps {
  suggestions: Array<{
    section: string
    suggestion: string
    severity: 'Low' | 'Medium' | 'High'
  }>
  className?: string
}

function getSeverityIcon(severity: string) {
  switch (severity) {
    case 'High': return <AlertTriangle className="h-4 w-4" />
    case 'Medium': return <AlertCircle className="h-4 w-4" />
    case 'Low': return <Info className="h-4 w-4" />
    default: return <Info className="h-4 w-4" />
  }
}

function getSeverityVariant(severity: string): 'default' | 'secondary' | 'destructive' {
  switch (severity) {
    case 'High': return 'destructive'
    case 'Medium': return 'default'
    case 'Low': return 'secondary'
    default: return 'secondary'
  }
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'High': return 'text-destructive'
    case 'Medium': return 'text-chart-2'
    case 'Low': return 'text-muted-foreground'
    default: return 'text-muted-foreground'
  }
}

export default function ImprovementSuggestions({ suggestions, className }: ImprovementSuggestionsProps) {
  const groupedSuggestions = suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.severity]) {
      acc[suggestion.severity] = []
    }
    acc[suggestion.severity].push(suggestion)
    return acc
  }, {} as Record<string, typeof suggestions>)

  const severityOrder: Array<'High' | 'Medium' | 'Low'> = ['High', 'Medium', 'Low']

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Improvement Suggestions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {severityOrder.map(severity => {
            const severitySuggestions = groupedSuggestions[severity]
            if (!severitySuggestions || severitySuggestions.length === 0) return null
            
            return (
              <div key={severity} className="space-y-4">
                <div className="flex items-center gap-3 border-b border-border pb-2">
                  <span className={getSeverityColor(severity)}>
                    {getSeverityIcon(severity)}
                  </span>
                  <h3 className="font-semibold">{severity} Priority</h3>
                  <Badge variant={getSeverityVariant(severity)} className="ml-auto">
                    {severitySuggestions.length}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  {severitySuggestions.map((suggestion, index) => (
                    <Alert key={index} className="border-l-4" style={{
                      borderLeftColor: severity === 'High' ? 'hsl(var(--destructive))' : 
                                      severity === 'Medium' ? 'hsl(var(--chart-2))' : 
                                      'hsl(var(--muted-foreground))'
                    }}>
                      <AlertDescription className="space-y-3">
                        <div className="flex items-start gap-2">
                          <Badge variant="outline" className="text-xs" data-testid={`suggestion-section-${severity}-${index}`}>
                            {suggestion.section}
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed" data-testid={`suggestion-text-${severity}-${index}`}>
                          {suggestion.suggestion}
                        </p>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </div>
            )
          })}
          
          {suggestions.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-chart-1" />
              <p className="text-lg font-medium">Great work! No major improvements needed.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}