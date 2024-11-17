import { useState, useEffect } from 'react'
interface UserProgress {
  totalPoints: number;
  healthyChoices: number;
  unhealthyChoices: number;
  currentStreak: number;
  level: number;
}

interface ProgressProps {
  progress: UserProgress;
}

const ProgressDisplay: React.FC<ProgressProps> = ({ progress }) => {
  const [progressState, setProgressState] = useState(progress)

  useEffect(() => {
    setProgressState(progress)
  }, [progress])

  return (
    <div className="progress-container">
      <div className="progress-item">
        <span>Total Points:</span> {progressState.totalPoints}
      </div>
      <div className="progress-item">
        <span>Healthy Choices:</span> {progressState.healthyChoices}
      </div>
      <div className="progress-item">
        <span>Unhealthy Choices:</span> {progressState.unhealthyChoices}
      </div>
      <div className="progress-item">
        <span>Current Streak:</span> {progressState.currentStreak}
      </div>
      <div className="progress-item">
        <span>Level:</span> {progressState.level}
      </div>
    </div>
  )
}

export default ProgressDisplay