import { useState } from 'react'
import { db } from './firebase'
import { collection, addDoc, updateDoc, doc, query, where, orderBy, getDocs } from 'firebase/firestore'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'

const languageNames = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  ewe: 'Ewe',
  twi: 'Twi',
  ga: 'Ga',
  pt: 'Portuguese',
  de: 'German',
  it: 'Italian',
  ar: 'Arabic',
  sw: 'Swahili',
  zh: 'Chinese',
  hi: 'Hindi'
}

const speechLangCodes = {
  en: 'en-US',
  fr: 'fr-FR',
  es: 'es-ES',
  pt: 'pt-PT',
  de: 'de-DE',
  it: 'it-IT',
  ar: 'ar-SA',
  sw: 'sw-KE',
  zh: 'zh-CN',
  hi: 'hi-IN',
  twi: 'en-US',
  ewe: 'en-US',
  ga: 'en-US'
}

function Chatbot({ onActivity, t, user, language }) {
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

  const getLanguageInstruction = () => {
    return `Respond only in ${languageNames[language] || 'English'}, regardless of what language the question is asked in. `