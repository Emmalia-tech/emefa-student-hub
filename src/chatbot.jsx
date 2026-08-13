import { useState } from 'react'

function Chatbot() {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I\'m your AI study assistant. Ask me anything about your coursework.' }
  ])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)

  const handleSend = () => {
    if (input.trim() === '') return

    const userMessage = { sender: 'user', text: input }
    setMessages([...messages, userMessage])
    setInput('')

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: 'This is a placeholder reply. AI responses coming soon!' }])
    }, 500)
  }

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Try Chrome.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
    }

    recognition.start()
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">Emefa AI Assistant</div>

      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chatbot-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your question..."
        />
        <button onClick={handleVoiceInput} className="mic-button">
          {isListening ? '🔴' : '🎤'}
        </button>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}

export default Chatbot