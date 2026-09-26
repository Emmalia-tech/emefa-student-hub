import { useState, useEffect } from 'react'
import Chatbot from './Chatbot'
import Dashboard from './Dashboard'
import Quote from './Quote'
import Timeline from './Timeline'
import { translations } from './translations'
import { auth, googleProvider } from './firebase'
import { signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from 'firebase/auth'
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
  const [user, setUser] = useState(null)
  const [authError, setAuthError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
    })

    getRedirectResult(auth).catch((error) => {
      console.error('Redirect sign-in error:', error)
      setAuthError(error.message)
    })

    return () => unsubscribe()
  }, [])

  const handleSignIn = () => {
    setAuthError(null)
    signInWithRedirect(auth, googleProvider).catch((error) => {
      console.error('Sign-in error:', error)
      setAuthError(error.message)
    })
  }

  const handleSignOut = () => {
    signOut(auth)
  }

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

  const scrollToChatbot = () => {
    const el = document.getElementById('chatbot-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="landing">
      <nav className="navbar">
        <h1 className="logo">Emefa Student Hub</h1>
        <div className="navbar-right">
          {user ? (
            <div className="user-info">
              <img src={user.photoURL} alt={user.displayName} className="user-avatar" />
              <span className="user-name">{user.displayName}</span>
              <button onClick={handleSignOut} className="sign-out-button">Sign Out</button>
            </div>
          ) : (
            <button onClick={handleSignIn} className="sign-in-button">Sign in with Google</button>
          )}
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
        </div>
      </nav>

      {authError && (
        <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '10px 20px', fontSize: '13px', textAlign: 'center' }}>
          Sign-in error: {authError}
        </div>
      )}

      <header className="hero">
        <div className="hero-content">
          <h2>{t.heroTitle}</h2>
          <p>{t.heroSubtitle}</p>
          <button className="cta-button" onClick={scrollToChatbot}>{t.getStarted}</button>
        </div>
        <img src={banner} alt="Emefa" className="hero-banner" />
      </header>

      <Quote />
      <Dashboard stats={stats} updateGoal={updateGoal} t={t} />
      <Timeline t={t} />
      <div id="chatbot-section">
        <Chatbot onActivity={addStudyActivity} t={t} user={user} language={language} />
      </div>
    </div>
  )
}

export default App