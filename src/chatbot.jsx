import { useState } from 'react'

function Chatbot({ onActivity, t }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I\'m your AI study assistant. Ask me anything about your coursework.' }
  ])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (input.trim() === '') return

    const userMessage = { sender: 'user', text: input }
    const currentInput = input
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    onActivity()

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput })
      })

      const data = await response.json()

      if (data.error) {
        setMessages(prev => [...prev, { sender: 'bot', text: `Error: ${data.error}` }])
      } else {
        setMessages(prev => [...prev, { sender: 'bot', text: data.reply }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, something went wrong. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
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

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const fileMessage = { sender: 'user', text: `📎 Uploaded: ${file.name}` }
    setMessages(prev => [...prev, fileMessage])
    onActivity()

    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'bot', text: `I received "${file.name}". File analysis coming soon!` }])
    }, 500)
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">{t.aiAssistant}</div>

      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        {isLoading && (
          <div className="message bot">Thinking...</div>
        )}
      </div>

      <div className="chatbot-input-area">
        <label className="upload-button">
          📎
          <input type="file" onChange={handleFileUpload} hidden />
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder={t.typeQuestion}
        />
        <button onClick={handleVoiceInput} className="mic-button">
          {isListening ? '🔴' : '🎤'}
        </button>
        <button onClick={handleSend}>{t.send}</button>
      </div>
    </div>
  )
}

export default Chatbot