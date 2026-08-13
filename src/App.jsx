import Chatbot from './Chatbot'

function App() {
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

      <Chatbot />
    </div>
  )
}

export default App