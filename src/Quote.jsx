const quotes = [
  "Success is the sum of small efforts repeated day in and day out.",
  "The expert in anything was once a beginner.",
  "Don't watch the clock; do what it does. Keep going.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Believe it. Build it.",
  "The future depends on what you do today.",
  "Discipline is the bridge between goals and accomplishment.",
  "You don't have to be great to start, but you have to start to be great.",
  "Small progress is still progress."
]

function Quote() {
  const today = new Date()
  const dayIndex = today.getDate() % quotes.length
  const todayQuote = quotes[dayIndex]

  return (
    <div className="quote-container">
      <p className="quote-text">"{todayQuote}"</p>
      <p className="quote-label">Today's Motivation</p>
    </div>
  )
}

export default Quote