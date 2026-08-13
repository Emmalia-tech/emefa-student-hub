import { useState } from 'react'
import Chatbot from './Chatbot'
import Dashboard from './Dashboard'

function App() {
  const [stats, setStats] = useState({
    hoursStudied: 0,
    topicsCompleted: 0,
    currentStreak: 1,
    goal: 20
  })

  const addStudyActivity = () => {
    setStats(prev => ({
      ...prev,
      topicsCompleted: prev.topicsCompleted + 1,
      hoursStudied: prev.hoursStudied + 0.5
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

      <Dashboard stats={stats} />
      <Chatbot onActivity={addStudyActivity} />
    </div>
  )
}

export default App