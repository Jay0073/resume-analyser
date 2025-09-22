import AnalyticsCharts from '../analytics-charts'

export default function AnalyticsChartsExample() {
  const mockAnalytics = {
    action_verbs: {
      count: 28,
      unique_count: 18,
      usage_frequency: [
        { verb: "Developed", count: 4 },
        { verb: "Built", count: 2 },
        { verb: "Improved", count: 2 }
      ]
    },
    readability: {
      grade_level: "College Graduate",
      score_explanation: "Your resume is clear, concise, and easy for recruiters to scan quickly."
    },
    resume_length: {
      pages: 1,
      words: 312,
      sentiment: "Ideal"
    }
  }

  return (
    <div className="p-6">
      <AnalyticsCharts analytics={mockAnalytics} />
    </div>
  )
}