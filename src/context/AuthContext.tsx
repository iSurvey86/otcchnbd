'use client'

import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCustomToken,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { bumpUserStat, logEvent, upsertUser } from '../lib/analytics'
import { GUEST_LIMIT, isAdminEmail, LOGIN_COPY } from '../lib/config'
import { getFirebaseAuth, isFirebaseConfigured } from '../lib/firebase'
import { guestRemaining, readGuestAnswered, writeGuestAnswered } from '../lib/quota'

export interface AnswerMeta {
  questionId: string
  section: string
  topicId: string
  mode: 'practice' | 'exam'
  correct: boolean
  choice: number
  answer: number
  prompt: string
  choiceText?: string
  answerText?: string
  sector?: string
  trackId?: string
  topicTitle?: string
  index?: number
  total?: number
  /** false = đổi đáp án thi thử, vẫn ghi log nhưng không tính hạn khách */
  countTowardQuota?: boolean
}

export interface ExamSubmitMeta {
  attemptId: string
  score: number
  lawScore: number
  skillScore: number
  correctCount: number
  questionCount: number
  totalMax: number
  passMark: number
  passed: boolean
  timedOut: boolean
  sector?: string
  trackId?: string
}

export interface PracticeSessionMeta {
  topicId?: string | null
  topicTitle?: string | null
  sector?: string
  trackId?: string | null
  correct?: number
  total?: number
}

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAdmin: boolean
  isConfigured: boolean
  guestAnswered: number
  guestLimit: number
  remaining: number
  loginOpen: boolean
  loginMessage: string
  signingIn: boolean
  authError: string | null
  signInGoogle: () => Promise<void>
  requestEmailOtp: (email: string) => Promise<boolean>
  verifyEmailOtp: (email: string, code: string) => Promise<boolean>
  signOutUser: () => Promise<void>
  openLogin: (message?: string) => void
  closeLogin: () => void
  tryRecordAnswer: (meta: AnswerMeta) => boolean
  notifyPracticeStarted: (meta: PracticeSessionMeta) => void
  notifyPracticeFinished: (meta: PracticeSessionMeta) => void
  notifyExamStarted: (meta?: PracticeSessionMeta) => boolean
  notifyExamSubmitted: (meta: ExamSubmitMeta) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(isFirebaseConfigured)
  const [guestAnswered, setGuestAnswered] = useState(readGuestAnswered)
  const [loginOpen, setLoginOpen] = useState(false)
  const [loginMessage, setLoginMessage] = useState<string>(LOGIN_COPY.default)
  const [signingIn, setSigningIn] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const verifyingRef = useRef(false)

  useEffect(() => {
    const auth = getFirebaseAuth()
    if (!auth) {
      setLoading(false)
      return
    }
    return onAuthStateChanged(auth, (next) => {
      setUser(next)
      setLoading(false)
    })
  }, [])

  const remaining = user ? GUEST_LIMIT : guestRemaining(guestAnswered)
  const canUnlimited = Boolean(user) || !isFirebaseConfigured
  const quotaPromptedRef = useRef(false)

  const openLogin = useCallback((message?: string) => {
    verifyingRef.current = false
    setLoginMessage(message ?? LOGIN_COPY.default)
    setAuthError(null)
    setLoginOpen(true)
    if (user) {
      void logEvent(user, 'paywall_hit', { reason: message ?? LOGIN_COPY.default })
    }
  }, [user])

  // Hết 15 câu miễn phí → tự mở hộp đăng nhập (một lần cho đến khi đăng nhập / còn hạn).
  useEffect(() => {
    if (loading || user || !isFirebaseConfigured) {
      if (user) quotaPromptedRef.current = false
      return
    }
    if (guestRemaining(guestAnswered) > 0) {
      quotaPromptedRef.current = false
      return
    }
    if (quotaPromptedRef.current || loginOpen) return
    quotaPromptedRef.current = true
    openLogin(LOGIN_COPY.quota)
  }, [guestAnswered, loading, loginOpen, openLogin, user])

  const closeLogin = useCallback(() => {
    setLoginOpen(false)
    setAuthError(null)
  }, [])

  const signInGoogle = useCallback(async () => {
    const auth = getFirebaseAuth()
    if (!auth) {
      setAuthError('Chưa cấu hình Firebase. Xem README để lấy khóa dự án.')
      return
    }
    setSigningIn(true)
    setAuthError(null)
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      await upsertUser(result.user)
      await logEvent(result.user, 'login', {
        guestAnswersBeforeLogin: readGuestAnswered(),
      })
      setLoginOpen(false)
    } catch (err) {
      const code = typeof err === 'object' && err && 'code' in err ? String(err.code) : ''
      const detail =
        typeof err === 'object' && err && 'message' in err ? String(err.message) : ''
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setAuthError(null)
      } else if (code === 'auth/unauthorized-domain') {
        setAuthError('Domain chưa được phép. Thêm localhost vào Authentication → Settings → Authorized domains.')
      } else if (code === 'auth/operation-not-allowed') {
        setAuthError('Google Sign-in chưa bật. Vào Authentication → Sign-in method → Google.')
      } else {
        setAuthError(
          detail
            ? `Không đăng nhập được (${code || 'lỗi Google'}). ${detail}`
            : 'Không đăng nhập được. Thử lại, hoặc bấm vào dòng Google trên Firebase để chọn Support email.',
        )
      }
    } finally {
      setSigningIn(false)
    }
  }, [])

  const requestEmailOtp = useCallback(async (email: string) => {
    setSigningIn(true)
    setAuthError(null)
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const body = (await res.json().catch(() => ({}))) as { error?: string }
      if (!res.ok) {
        setAuthError(body.error || 'Không gửi được mã. Thử lại sau.')
        return false
      }
      return true
    } catch {
      setAuthError('Không kết nối được máy chủ.')
      return false
    } finally {
      setSigningIn(false)
    }
  }, [])

  const verifyEmailOtp = useCallback(async (email: string, code: string) => {
    const auth = getFirebaseAuth()
    if (!auth) {
      setAuthError('Chưa cấu hình Firebase. Xem README để lấy khóa dự án.')
      return false
    }
    if (verifyingRef.current) return false
    verifyingRef.current = true
    setSigningIn(true)
    setAuthError(null)
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      })
      const body = (await res.json().catch(() => ({}))) as {
        error?: string
        token?: string
      }
      if (!res.ok || !body.token) {
        setAuthError(
          body.error ||
            (res.status >= 500
              ? 'Lỗi máy chủ khi đăng nhập. Thử lại sau khi web cập nhật.'
              : 'Mã không đúng hoặc đã hết hạn.'),
        )
        return false
      }
      if (auth.currentUser) {
        await signOut(auth)
      }
      await auth.authStateReady()
      const result = await signInWithCustomToken(auth, body.token)
      await result.user.getIdToken(true)
      try {
        await upsertUser(result.user, 'email')
        await logEvent(result.user, 'login', {
          guestAnswersBeforeLogin: readGuestAnswered(),
          method: 'email_otp',
        })
      } catch (logErr) {
        console.error('otp login analytics', logErr)
      }
      setLoginOpen(false)
      return true
    } catch (err) {
      const errCode =
        typeof err === 'object' && err && 'code' in err ? String(err.code) : ''
      const detail =
        typeof err === 'object' && err && 'message' in err ? String(err.message) : ''
      setAuthError(
        detail
          ? `Không gắn được phiên đăng nhập (${errCode || 'firebase'}). ${detail}`
          : 'Không đăng nhập được. Thử lại.',
      )
      return false
    } finally {
      verifyingRef.current = false
      setSigningIn(false)
    }
  }, [])

  const signOutUser = useCallback(async () => {
    const auth = getFirebaseAuth()
    if (!auth) return
    verifyingRef.current = false
    await logEvent(user, 'logout')
    await signOut(auth)
  }, [user])

  const tryRecordAnswer = useCallback(
    (meta: AnswerMeta) => {
      const countQuota = meta.countTowardQuota !== false
      const answered = readGuestAnswered()
      if (countQuota && !canUnlimited && guestRemaining(answered) <= 0) {
        openLogin(LOGIN_COPY.quota)
        return false
      }
      if (countQuota && !user && isFirebaseConfigured) {
        const next = answered + 1
        writeGuestAnswered(next)
        setGuestAnswered(next)
      }
      if (user) {
        void logEvent(user, 'question_answered', {
          questionId: meta.questionId,
          section: meta.section,
          topicId: meta.topicId,
          mode: meta.mode,
          passed: meta.correct,
          prompt: meta.prompt.slice(0, 180),
          choice: meta.choice,
          answer: meta.answer,
          choiceText: (meta.choiceText ?? '').slice(0, 120) || null,
          answerText: (meta.answerText ?? '').slice(0, 120) || null,
          sector: meta.sector ?? null,
          trackId: meta.trackId ?? null,
          topicTitle: meta.topicTitle ?? null,
          index: meta.index ?? null,
          total: meta.total ?? null,
        })
        if (countQuota) void bumpUserStat(user.uid, 'answerCount', user)
      }
      return true
    },
    [canUnlimited, openLogin, user],
  )

  const notifyPracticeStarted = useCallback(
    (meta: PracticeSessionMeta) => {
      if (!user) return
      void logEvent(user, 'practice_started', {
        mode: 'practice',
        topicId: meta.topicId ?? null,
        topicTitle: meta.topicTitle ?? null,
        sector: meta.sector ?? null,
        trackId: meta.trackId ?? null,
      })
    },
    [user],
  )

  const notifyPracticeFinished = useCallback(
    (meta: PracticeSessionMeta) => {
      if (!user) return
      void logEvent(user, 'practice_finished', {
        mode: 'practice',
        topicId: meta.topicId ?? null,
        topicTitle: meta.topicTitle ?? null,
        sector: meta.sector ?? null,
        trackId: meta.trackId ?? null,
        score: meta.correct ?? null,
        total: meta.total ?? null,
      })
    },
    [user],
  )

  const notifyExamStarted = useCallback(
    (meta?: PracticeSessionMeta) => {
      const answered = readGuestAnswered()
      if (!canUnlimited && guestRemaining(answered) <= 0) {
        openLogin(LOGIN_COPY.exam)
        return false
      }
      if (user) {
        void logEvent(user, 'exam_started', {
          mode: 'exam',
          sector: meta?.sector ?? null,
          trackId: meta?.trackId ?? null,
        })
      }
      return true
    },
    [canUnlimited, openLogin, user],
  )

  const notifyExamSubmitted = useCallback(
    (meta: ExamSubmitMeta) => {
      if (!user) return
      void logEvent(user, 'exam_submitted', {
        attemptId: meta.attemptId,
        mode: 'exam',
        score: meta.score,
        lawScore: meta.lawScore,
        skillScore: meta.skillScore,
        correctCount: meta.correctCount,
        questionCount: meta.questionCount,
        totalMax: meta.totalMax,
        passMark: meta.passMark,
        passed: meta.passed,
        timedOut: meta.timedOut,
        sector: meta.sector ?? null,
        trackId: meta.trackId ?? null,
      })
      void bumpUserStat(user.uid, 'examCount', user)
    },
    [user],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAdmin: isAdminEmail(user?.email),
      isConfigured: isFirebaseConfigured,
      guestAnswered,
      guestLimit: GUEST_LIMIT,
      remaining: canUnlimited ? GUEST_LIMIT : remaining,
      loginOpen,
      loginMessage,
      signingIn,
      authError,
      signInGoogle,
      requestEmailOtp,
      verifyEmailOtp,
      signOutUser,
      openLogin,
      closeLogin,
      tryRecordAnswer,
      notifyPracticeStarted,
      notifyPracticeFinished,
      notifyExamStarted,
      notifyExamSubmitted,
    }),
    [
      authError,
      canUnlimited,
      closeLogin,
      guestAnswered,
      loading,
      loginMessage,
      loginOpen,
      notifyPracticeStarted,
      notifyPracticeFinished,
      notifyExamStarted,
      notifyExamSubmitted,
      openLogin,
      remaining,
      signInGoogle,
      requestEmailOtp,
      verifyEmailOtp,
      signOutUser,
      signingIn,
      tryRecordAnswer,
      user,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
