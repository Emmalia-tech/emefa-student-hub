import { useState, useEffect } from 'react'
import Chatbot from './Chatbot'
import Dashboard from './Dashboard'
import Quote from './Quote'

function App() {
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('emefaStats')
    return saved ? JSON.parse(saved) : {
      hoursStudied: 0,
      topicsCompleted: 0,
      currentStreak: 1,
      goal: 20
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
      <Chatbot onActivity={addStudyActivity} />
    </div>
  )
}

export default App