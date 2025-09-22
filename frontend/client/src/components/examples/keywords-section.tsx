import KeywordsSection from '../keywords-section'

export default function KeywordsSectionExample() {
  const mockKeywords = {
    top_technical_skills: ["React", "Python", "MongoDB", "TensorFlow", "JavaScript"],
    top_soft_skills: ["Problem solving", "Communication skills", "Active listening"],
    keywords_by_section: {
      "Summary": ["Web development", "MERN technologies", "Machine learning", "Problem solving"],
      "Skills": ["Python", "C++", "React", "MySQL", "Git", "HTML", "CSS"],
      "Work Experience": ["Web Developer Intern", "MERN stack", "UI responsiveness", "User engagement"]
    }
  }

  return (
    <div className="p-6">
      <KeywordsSection keywords={mockKeywords} />
    </div>
  )
}