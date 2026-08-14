import { useAuth } from '../context/AuthContext'

export function QuotaHint() {
  const { user, isConfigured, remaining, guestLimit, openLogin } = useAuth()
  if (!isConfigured || user) return null

  return (
    <p className={remaining === 0 ? 'quota-hint quota-hint-empty' : 'quota-hint'}>
      Còn <b>{remaining}</b>/{guestLimit} câu miễn phí.{' '}
      <button type="button" className="text-link" onClick={() => openLogin()}>
        Đăng nhập Google
      </button>{' '}
      để học không giới hạn.
    </p>
  )
}
