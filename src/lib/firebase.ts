import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: String(import.meta.env.VITE_FIREBASE_API_KEY ?? '').trim(),
  authDomain: String(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? '').trim(),
  projectId: String(import.meta.env.VITE_FIREBASE_PROJECT_ID ?? '').trim(),
  storageBucket: String(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? '').trim(),
  messagingSenderId: String(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '').trim(),
  appId: String(import.meta.env.VITE_FIREBASE_APP_ID ?? '').trim(),
}

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId,
)

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

export function getFirebase(): { auth: Auth; db: Firestore } | null {
  if (!isFirebaseConfigured) return null
  if (!app) {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
  }
  if (!auth || !db) return null
  return { auth, db }
}
