import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useAuth } from '../context/AuthContext'

export function LoginModal() {
  const {
    loginOpen,
    loginMessage,
    signingIn,
    authError,
    isConfigured,
    signInGoogle,
    requestEmailOtp,
    verifyEmailOtp,
    closeLogin,
  } = useAuth()

  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [cooldown, setCooldown] = useState(0)
  const codeRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loginOpen) {
      setEmail('')
      setCode('')
      setStep('email')
      setCooldown(0)
    }
  }, [loginOpen])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = window.setTimeout(() => setCooldown((n) => n - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [cooldown])

  useEffect(() => {
    if (step === 'code') codeRef.current?.focus()
  }, [step])

  if (!loginOpen) return null

  const sendCode = async () => {
    const ok = await requestEmailOtp(email)
    if (ok) {
      setStep('code')
      setCode('')
      setCooldown(60)
    }
  }

  const onEmailSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (signingIn) return
    void sendCode()
  }

  const onCodeSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (signingIn) return
    void verifyEmailOtp(email, code)
  }

  const onCodeChange = (value: string) => {
    setCode(value.replace(/\D/g, '').slice(0, 6))
  }

  return (
    <div className="modal-backdrop" onClick={closeLogin} role="presentation">
      <div
        className="login-modal"
        role="dialog"
        aria-labelledby="login-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="login-title" className="login-modal-msg">
          {loginMessage}
        </h2>

        {isConfigured ? (
          <>
            {step === 'email' ? (
              <form className="login-email-form" onSubmit={onEmailSubmit}>
                <label className="login-field">
                  <span>Email</span>
                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="ban@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={signingIn}
                  />
                </label>
                <button
                  type="submit"
                  className="btn primary"
                  disabled={signingIn || !email.trim()}
                >
                  {signingIn ? 'Đang gửi mã…' : 'Gửi mã 6 số'}
                </button>
              </form>
            ) : (
              <form className="login-email-form" onSubmit={onCodeSubmit}>
                <p className="login-otp-hint">
                  Đã gửi mã tới <strong>{email}</strong>. Kiểm tra hộp thư (kể cả
                  spam).
                </p>
                <label className="login-field">
                  <span>Mã 6 số</span>
                  <input
                    ref={codeRef}
                    className="login-otp-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    pattern="[0-9]*"
                    maxLength={6}
                    placeholder="••••••"
                    value={code}
                    onChange={(e) => onCodeChange(e.target.value)}
                    required
                    disabled={signingIn}
                  />
                </label>
                <button
                  type="submit"
                  className="btn primary"
                  disabled={signingIn || code.length !== 6}
                >
                  {signingIn ? 'Đang đăng nhập…' : 'Đăng nhập'}
                </button>
                <div className="login-otp-actions">
                  <button
                    type="button"
                    className="btn ghost"
                    disabled={signingIn || cooldown > 0}
                    onClick={() => void sendCode()}
                  >
                    {cooldown > 0 ? `Gửi lại (${cooldown}s)` : 'Gửi lại mã'}
                  </button>
                  <button
                    type="button"
                    className="btn ghost"
                    disabled={signingIn}
                    onClick={() => {
                      setStep('email')
                      setCode('')
                    }}
                  >
                    Đổi email
                  </button>
                </div>
              </form>
            )}

            <p className="login-divider">hoặc</p>
            <button
              className="btn google-btn"
              onClick={() => void signInGoogle()}
              disabled={signingIn}
              type="button"
            >
              <GoogleMark />
              {signingIn ? 'Đang xử lý…' : 'Tiếp tục với Google'}
            </button>
          </>
        ) : (
          <p className="auth-error">
            Chưa cấu hình Firebase. Tạo file <code>.env.local</code> theo{' '}
            <code>.env.example</code> rồi bật Google Sign-in trên Firebase Console.
          </p>
        )}
        {authError ? <p className="auth-error">{authError}</p> : null}
        <button className="btn ghost" onClick={closeLogin} type="button">
          Để sau
        </button>
      </div>
    </div>
  )
}

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"
      />
    </svg>
  )
}
