import ImprovementSuggestions from '../improvement-suggestions'

export default function ImprovementSuggestionsExample() {
  const mockSuggestions = [
    {
      section: "Skills",
      suggestion: "Categorize skills into more specific sections (e.g., Programming Languages, Databases, Frameworks, Tools).",
      severity: "Medium" as const
    },
    {
      section: "Skills",
      suggestion: "Review and correct the spelling of 'Programming lanugages'.",
      severity: "Low" as const
    },
    {
      section: "Summary",
      suggestion: "Quantify your achievements in your summary to make it more impactful.",
      severity: "Medium" as const
    }
  ]

  return (
    <div className="p-6">
      <ImprovementSuggestions suggestions={mockSuggestions} />
    </div>
  )
}