import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface BeforeAfterExamplesProps {
  examples: Array<{
    section: string
    original: string
    improved: string
    reason: string
  }>
  className?: string
}

export default function BeforeAfterExamples({ examples, className }: BeforeAfterExamplesProps) {
  return (
    <Card className={cn('shadow-lg rounded-2xl', className)}>
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-xl font-semibold">✨ Before & After Examples</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-12">
          {examples.map((example, index) => (
            <motion.div
              key={index}
              className="space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {/* Section label */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="px-3 py-1 text-sm font-medium tracking-wide" data-testid={`example-section-${index}`}>
                  {example.section}
                </Badge>
              </div>

              {/* Before / After */}
              <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-center">
                {/* Before */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span className="font-medium text-sm uppercase">Before</span>
                  </div>
                  <Card className="border-destructive/30 bg-destructive/5">
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed" data-testid={`example-original-${index}`}>
                        {example.original}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Arrow */}
                <div className="hidden md:flex justify-center">
                  <ArrowRight className="h-6 w-6 text-muted-foreground" />
                </div>

                {/* After */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-medium text-sm uppercase">After</span>
                  </div>
                  <Card className="border-green-300 bg-green-50 dark:bg-green-950/30">
                    <CardContent className="p-4">
                      <p className="text-sm leading-relaxed" data-testid={`example-improved-${index}`}>
                        {example.improved}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Reason */}
              <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/40 border border-muted-foreground/20">
                <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                <p className="text-sm text-muted-foreground leading-relaxed" data-testid={`example-reason-${index}`}>
                  <strong className="text-foreground">Why this works better:</strong> {example.reason}
                </p>
              </div>

              {/* Divider */}
              {index < examples.length - 1 && (
                <div className="relative flex items-center justify-center">
                  <hr className="w-full border-border" />
                  <span className="absolute px-3 text-xs text-muted-foreground bg-background">Next Example</span>
                </div>
              )}
            </motion.div>
          ))}

          {/* Empty state */}
          {examples.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium">Your resume is already polished! 🎉</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
