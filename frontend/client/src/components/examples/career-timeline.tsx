import CareerTimeline from '../career-timeline'

export default function CareerTimelineExample() {
  const mockTimeline = [
    {
      company: "Centennial Infotech",
      role: "Web Developer Intern",
      start_date: "2025-01",
      end_date: "Present",
      duration_months: null,
      achievements: [
        "Contributed to multiple MERN stack projects and improving UI responsiveness by 25%",
        "Boosted user engagement by 15%",
        "Optimized application performance, achieving a 20% reduction in page load times"
      ]
    },
    {
      company: "Motion Cut",
      role: "Frontend Intern",
      start_date: "2024-11",
      end_date: "2024-12",
      duration_months: 2,
      achievements: [
        "Developed responsive components using HTML/CSS/JavaScript/Tailwind CSS, enhancing user interfaces and boosting user experience metrics by 30%"
      ]
    }
  ]

  return (
    <div className="p-6">
      <CareerTimeline timeline={mockTimeline} />
    </div>
  )
}