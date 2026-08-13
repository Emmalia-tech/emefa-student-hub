function Dashboard({ stats }) {
  const progressPercent = Math.min((stats.hoursStudied / stats.goal) * 100, 100)

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Your Progress</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-number">{stats.hoursStudied}h</p>
          <p className="stat-label">Hours Studied</p>
        </div>

        <div className="stat-card">
          <p className="stat-number">{stats.topicsCompleted}</p>
          <p className="stat-label">Topics Completed</p>
        </div>

        <div className="stat-card">
          <p className="stat-number">{stats.currentStreak} 🔥</p>
          <p className="stat-label">Day Streak</p>
        </div>
      </div>

      <div className="progress-bar-section">
        <p className="progress-label">Weekly Goal: {stats.hoursStudied}h / {stats.goal}h</p>
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard