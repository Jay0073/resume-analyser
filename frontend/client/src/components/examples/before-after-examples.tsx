import BeforeAfterExamples from '../before-after-examples'

export default function BeforeAfterExamplesExample() {
  const mockExamples = [
    {
      section: "Summary",
      original: "Computer science graduate with strong foundation in web development with MERN technologies and a keen interest in machine learning.",
      improved: "Computer science graduate with a strong foundation in web development using MERN technologies and a proven interest in machine learning, demonstrated through impactful projects and internships.",
      reason: "The improved version quantifies the applicant's skills and experience, making it more impactful for recruiters."
    },
    {
      section: "Skills",
      original: "Programming lanugages",
      improved: "Programming Languages",
      reason: "Corrected spelling error."
    }
  ]

  return (
    <div className="p-6">
      <BeforeAfterExamples examples={mockExamples} />
    </div>
  )
}