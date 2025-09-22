import ScoreDisplay from '../score-display'

export default function ScoreDisplayExample() {
  const mockScores = {
    overall: 7.8,
    ats_friendliness: 90,
    layout_and_formatting: 75,
    impact_and_quantification: 90
  }

  return (
    <div className="p-6">
      <ScoreDisplay scores={mockScores} />
    </div>
  )
}