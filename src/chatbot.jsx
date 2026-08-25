import { useState } from 'react'
import { db } from './firebase'
import { collection, addDoc, updateDoc, doc, query, where, orderBy, getDocs } from 'firebase/firestore'

function Chatbot({ onActivity, t, user }) {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I\'m your AI study assistant. Ask me anything about your coursework.' }
  ])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const startNewConversation = () => {
    setMessages([
      { sender: 'bot', text: 'Hi! I\'m your AI study assistant. Ask me anything about your coursework.' }
    ])
    setConversationId(null)
    setShowHistory(false)
  }

  const loadHistory = async () => {
    if (!user) return
    setLoadingHistory(true)

    try {
      const q = query(
        collection(db, 'conversations'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      const conversations = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }))
      setHistory(conversations)
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setLoadingHistory(false)
    }
  }

  const openHistoryPanel = () => {
    setShowHistory(true)
    loadHistory()
  }

  const loadConversation = (conversation) => {
    setMessages(conversation.messages)
    setConversationId(conversation.id)
    setShowHistory(false)
  }

  const saveConversation = async (updatedMessages) => {
    if (!user) return

    try {
      if (conversationId) {
        const convRef = doc(db, 'conversations', conversationId)
        await updateDoc(convRef, {
          messages: updatedMessages,
          updatedAt: new Date().toISOString()
        })
      } else {
        const docRef = await addDoc(collection(db, 'conversations'), {
          userId: user.uid,
          messages: updatedMessages,
          title: updatedMessages[1]?.text?.slice(0, 40) || 'New conversation',
          createdAt: new Date().toISOString()
        })
        setConversationId(docRef.id)
      }
    } catch (error) {
      console.error('Error saving conversation:', error)
    }
  }

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
        const cleanReply = data.reply
          .replace(/\*\*/g, '')
          .replace(/#{1,6}\s?/g, '')
          .replace(/\*/g, '')
        const finalMessages = [...messages, userMessage, { sender: 'bot', text: cleanReply }]
        setMessages(prev => [...prev, { sender: 'bot', text: cleanReply }])
        saveConversation(finalMessages)
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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const isImage = file.type.startsWith('image/')

    if (!isImage) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Right now I can only analyze images. Text file support is coming soon!' }])
      return
    }

    const fileMessage = { sender: 'user', text: `📎 Uploaded: ${file.name}` }
    setMessages(prev => [...prev, fileMessage])
    onActivity()
    setIsLoading(true)

    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result.split(',')[1])
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Please analyze this image and describe what you see. If it contains text or a question, help explain or answer it.',
          imageBase64: base64,
          imageMimeType: file.type
        })
      })

      const data = await response.json()

      if (data.error) {
        setMessages(prev => [...prev, { sender: 'bot', text: `Error: ${data.error}` }])
      } else {
        const cleanReply = data.reply
          .replace(/\*\*/g, '')
          .replace(/#{1,6}\s?/g, '')
          .replace(/\*/g, '')
        const finalMessages = [...messages, fileMessage, { sender: 'bot', text: cleanReply }]
        setMessages(prev => [...prev, { sender: 'bot', text: cleanReply }])
        saveConversation(finalMessages)
      }
    } catch (error) {
      setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I had trouble analyzing that image.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <span>{t.aiAssistant}</span>
        {user && (
          <div className="chatbot-header-actions">
            <button onClick={openHistoryPanel} className="history-button">History</button>
            <button onClick={startNewConversation} className="new-chat-button">New Chat</button>
          </div>
        )}
      </div>

      {showHistory && (
        <div className="history-panel">
          <div className="history-panel-header">
            <span>Past Conversations</span>
            <button onClick={() => setShowHistory(false)} className="close-history">✕</button>
          </div>
          {loadingHistory && <p className="history-loading">Loading...</p>}
          {!loadingHistory && history.length === 0 && (
            <p className="history-empty">No saved conversations yet.</p>
          )}
          {!loadingHistory && history.map((conv) => (
            <div key={conv.id} className="history-item" onClick={() => loadConversation(conv)}>
              <p className="history-item-title">{conv.title}</p>
              <p className="history-item-date">{new Date(conv.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

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