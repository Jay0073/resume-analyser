import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Calendar, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CareerTimelineProps {
  timeline: Array<{
    company: string
    role: string
    start_date: string
    end_date: string
    duration_months: number | null
    achievements: string[]
  }>
  className?: string
}

function formatDate(dateStr: string): string {
  if (dateStr.toLowerCase() === 'present') return 'Present'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  } catch {
    return dateStr
  }
}

function getDuration(months: number | null): string {
  if (!months) return ''
  if (months < 12) return `${months} month${months > 1 ? 's' : ''}`
  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`
  return `${years}y ${remainingMonths}m`
}

export default function CareerTimeline({ timeline, className }: CareerTimelineProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Career Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {timeline.map((job, index) => (
            <div key={index} className="relative">
              {/* Timeline connector */}
              {index < timeline.length - 1 && (
                <div className="absolute left-3 top-16 h-[calc(100%+2rem)] w-0.5 bg-border" />
              )}
              
              <div className="flex gap-6">
                {/* Timeline dot */}
                <div className="relative flex-shrink-0 mt-1">
                  <div className="w-6 h-6 bg-chart-1 rounded-full flex items-center justify-center">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                </div>
                
                {/* Content */}
                <div className="flex-1 space-y-4 pb-2">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-semibold text-lg" data-testid={`job-role-${index}`}>{job.role}</h3>
                      <Badge variant="outline" className="font-medium" data-testid={`job-company-${index}`}>{job.company}</Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span data-testid={`job-dates-${index}`}>
                        {formatDate(job.start_date)} - {formatDate(job.end_date)}
                      </span>
                      {job.duration_months && (
                        <span data-testid={`job-duration-${index}`}>• {getDuration(job.duration_months)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {job.achievements.map((achievement, achievementIndex) => (
                      <div key={achievementIndex} className="flex items-start gap-3 text-sm leading-relaxed">
                        <CheckCircle className="h-4 w-4 text-chart-1 mt-1 flex-shrink-0" />
                        <span data-testid={`job-achievement-${index}-${achievementIndex}`} className="text-foreground">
                          {achievement}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}