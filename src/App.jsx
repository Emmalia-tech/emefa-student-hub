import { useState, useEffect } from 'react'
import Chatbot from './Chatbot'
import Dashboard from './Dashboard'
import Quote from './Quote'
import Timeline from './Timeline'
import { translations } from './translations'
import banner from './assets/banner.jpg'

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
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('emefaLanguage') || 'en'
  })

  const t = translations[language]

  useEffect(() => {
    localStorage.setItem('emefaLanguage', language)
  }, [language])

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
        <select
          className="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
          <option value="ewe">Eʋegbe</option>
          <option value="twi">Twi</option>
          <option value="ga">Ga</option>
          <option value="pt">Português</option>
          <option value="de">Deutsch</option>
          <option value="it">Italiano</option>
          <option value="ar">العربية</option>
          <option value="sw">Kiswahili</option>
          <option value="zh">中文</option>
          <option value="hi">हिन्दी</option>
        </select>
      </nav>

      <header className="hero">
  <div className="hero-content">
    <h2>{t.heroTitle}</h2>
    <p>{t.heroSubtitle}</p>
    <button className="cta-button">{t.getStarted}</button>
  </div>
  <img src={banner} alt="Emefa" className="hero-banner" />
</header>

      <Quote />
      <Dashboard stats={stats} updateGoal={updateGoal} t={t} />
      <Timeline t={t} />
      <Chatbot onActivity={addStudyActivity} t={t} />
    </div>
  )
}

export default App