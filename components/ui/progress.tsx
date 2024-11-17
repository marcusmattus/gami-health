import { useState, useEffect } from 'react'

interface ProgressProps {
  totalPoints: number
  healthyChoices: number
  unhealthyChoices: number
  currentStreak: number
  level: number
}

const Progress: React.FC<ProgressProps> = ({ totalPoints, healthyChoices, unhealthyChoices, currentStreak, level }) => {
  const [progress, setProgress] = useState({
    totalPoints,
    healthyChoices,
    unhealthyChoices,
    currentStreak,
    level
  })

  useEffect(() => {
    setProgress({
      totalPoints,
      healthyChoices,
      unhealthyChoices,
      currentStreak,
      level
    })
  }, [totalPoints, healthyChoices, unhealthyChoices, currentStreak, level])

  return (
    <div className="progress-container">
      <div className="progress-item">
        <span>Total Points:</span> {progress.totalPoints}
      </div>
      <div className="progress-item">
        <span>Healthy Choices:</span> {progress.healthyChoices}
      </div>
      <div className="progress-item">
        <span>Unhealthy Choices:</span> {progress.unhealthyChoices}
      </div>
      <div className="progress-item">
        <span>Current Streak:</span> {progress.currentStreak}
      </div>
      <div className="progress-item">
        <span>Level:</span> {progress.level}
      </div>
    </div>
  )
}

export default Progress