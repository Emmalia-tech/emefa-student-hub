import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyCCNHyBzOE7asEvejdetR_bZHXHZSnRBto",
  authDomain: "emefa-student-hub.firebaseapp.com",
  projectId: "emefa-student-hub",
  storageBucket: "emefa-student-hub.firebasestorage.app",
  messagingSenderId: "489011008814",
  appId: "1:489011008814:web:a1a791e5c4a66cb313d6bf"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()