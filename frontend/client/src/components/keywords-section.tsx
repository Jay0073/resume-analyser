import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface KeywordsSectionProps {
  keywords: {
    top_technical_skills: string[]
    top_soft_skills: string[]
    keywords_by_section: Record<string, string[]>
  }
  className?: string
}

export default function KeywordsSection({ keywords, className }: KeywordsSectionProps) {
  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>Keywords & Skills Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="top-skills" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="top-skills" data-testid="tab-top-skills">Top Skills</TabsTrigger>
            <TabsTrigger value="technical" data-testid="tab-technical">Technical</TabsTrigger>
            <TabsTrigger value="by-section" data-testid="tab-by-section">By Section</TabsTrigger>
          </TabsList>
          
          <TabsContent value="top-skills" className="space-y-6 mt-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-chart-1 border-b border-chart-1/20 pb-2">Top Technical Skills</h4>
              <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
                {keywords.top_technical_skills.map((skill, index) => (
                  <Badge key={index} variant="default" className="whitespace-nowrap" data-testid={`skill-technical-${index}`}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-chart-2 border-b border-chart-2/20 pb-2">Top Soft Skills</h4>
              <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
                {keywords.top_soft_skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="whitespace-nowrap" data-testid={`skill-soft-${index}`}>
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="technical" className="mt-6">
            <div className="flex flex-wrap gap-2 min-h-[3rem]">
              {keywords.top_technical_skills.map((skill, index) => (
                <Badge key={index} variant="outline" className="whitespace-nowrap" data-testid={`tech-skill-${index}`}>
                  {skill}
                </Badge>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="by-section" className="space-y-6 mt-6">
            {Object.entries(keywords.keywords_by_section).map(([section, sectionKeywords]) => (
              <div key={section} className="space-y-3">
                <h4 className="font-semibold border-b border-border pb-2">{section}</h4>
                <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
                  {sectionKeywords.slice(0, 10).map((keyword, index) => (
                    <Badge key={index} variant="outline" className="text-xs whitespace-nowrap" data-testid={`section-keyword-${section}-${index}`}>
                      {keyword}
                    </Badge>
                  ))}
                  {sectionKeywords.length > 10 && (
                    <Badge variant="secondary" className="text-xs whitespace-nowrap">
                      +{sectionKeywords.length - 10} more
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}