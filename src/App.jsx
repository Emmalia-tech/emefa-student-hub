import { useState, useEffect } from 'react'
import Chatbot from './Chatbot'
import Dashboard from './Dashboard'
import Quote from './Quote'
import Timeline from './Timeline'

function getTodayString() {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

function calculateStreak(lastVisit, currentStreak) {
  const today = getTodayString()

  if (!lastVisit) {
    return 1
  }

  if (lastVisit === today) {
    return currentStreak
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayString = yesterday.toISOString().split('T')[0]

  if (lastVisit === yesterdayString) {
    return currentStreak + 1
  }

  return 1
}

function App() {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('emefaStats')
    const parsed = saved ? JSON.parse(saved) : {
      hoursStudied: 0,
      topicsCompleted: 0,
      currentStreak: 1,
      goal: 20,
      lastVisit: null
    }

    const newStreak = calculateStreak(parsed.lastVisit, parsed.currentStreak)

    return {
      ...parsed,
      currentStreak: newStreak,
      lastVisit: getTodayString()
    }
  })

  useEffect(() => {
    localStorage.setItem('emefaStats', JSON.stringify(stats))
  }, [stats])

  const addStudyActivity = () => {
    setStats(prev => ({
      ...prev,
      topicsCompleted: prev.topicsCompleted + 1,
      hoursStudied: prev.hoursStudied + 0.5
    }))
  }

  const updateGoal = (newGoal) => {
    setStats(prev => ({
      ...prev,
      goal: newGoal
    }))
  }

  return (
    <div className="landing">
      <nav className="navbar">
        <h1 className="logo">Emefa Student Hub</h1>
      </nav>

      <header className="hero">
        <h2>Your Journey to Academic Excellence Starts Here</h2>
        <p>Learn smarter, track your progress, and stay motivated — powered by AI.</p>
        <button className="cta-button">Get Started</button>
      </header>

      <Quote />
      <Dashboard stats={stats} updateGoal={updateGoal} />
      <Timeline />
      <Chatbot onActivity={addStudyActivity} />
    </div>
  )
}

export default App