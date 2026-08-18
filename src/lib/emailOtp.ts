import { getSupabaseAdmin, isSupabaseConfigured } from './supabaseAdmin'

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const email = value.trim().toLowerCase()
  if (email.length > 254) return null
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null
  return email
}

export function normalizeOtp(value: unknown): string | null {
  if (typeof value !== 'string') return null
  const code = value.replace(/\s/g, '')
  if (!/^\d{6}$/.test(code)) return null
  return code
}

function gotrueUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim().replace(/\/$/, '')
  return `${base}/auth/v1/${path}`
}

async function gotrue(
  path: string,
  body: Record<string, unknown>,
): Promise<{ ok: boolean; status: number; message: string }> {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!.trim()
  const res = await fetch(gotrueUrl(path), {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const json = (await res.json().catch(() => ({}))) as {
    msg?: string
    message?: string
    error_description?: string
    error?: string
  }
  const message =
    json.msg || json.message || json.error_description || json.error || ''
  return { ok: res.ok, status: res.status, message }
}

function isNotConfirmed(message: string): boolean {
  const lower = message.toLowerCase()
  return lower.includes('not confirmed') || lower.includes('unconfirmed')
}

function mapOtpError(message: string, fallback: string): string {
  const lower = message.toLowerCase()
  if (lower.includes('rate') || lower.includes('too many')) {
    return 'Gửi mã quá nhiều lần. Đợi vài phút rồi thử lại, hoặc đăng nhập Google.'
  }
  if (
    lower.includes('disabled') ||
    lower.includes('not enabled') ||
    lower.includes('signups not allowed')
  ) {
    return 'Chưa bật đăng nhập Email trên Supabase (Authentication → Sign In / Providers → Email).'
  }
  if (isNotConfirmed(message)) {
    return 'Tài khoản email này chưa được xác nhận. Tắt Confirm email trên Supabase, xóa user này trong Authentication → Users, rồi gửi mã lại.'
  }
  if (
    lower.includes('expired') ||
    lower.includes('invalid token') ||
    lower.includes('token has expired') ||
    lower.includes('invalid otp')
  ) {
    return 'Mã không đúng hoặc đã hết hạn. Dùng mail mới nhất, hoặc gửi lại mã.'
  }
  return message.trim() || fallback
}

async function confirmEmailIfUnconfirmed(email: string): Promise<void> {
  const db = getSupabaseAdmin()
  if (!db) return
  const { data, error } = await db.auth.admin.listUsers({ perPage: 200 })
  if (error) return
  const user = data.users.find((item) => item.email?.toLowerCase() === email)
  if (!user || user.email_confirmed_at) return
  await db.auth.admin.updateUserById(user.id, { email_confirm: true })
}

export async function sendEmailOtp(
  email: string,
): Promise<{ ok: true } | { error: string; status: number }> {
  if (!isSupabaseConfigured()) {
    return { error: 'Chưa cấu hình Supabase.', status: 500 }
  }
  const result = await gotrue('otp', {
    email,
    create_user: true,
  })
  if (!result.ok) {
    return {
      error: mapOtpError(result.message, 'Không gửi được mã. Thử lại sau.'),
      status: result.status >= 400 && result.status < 500 ? result.status : 500,
    }
  }
  return { ok: true }
}

const VERIFY_TYPES = ['email', 'magiclink', 'signup'] as const

export async function verifyEmailOtp(
  email: string,
  token: string,
): Promise<{ ok: true } | { error: string; status: number }> {
  if (!isSupabaseConfigured()) {
    return { error: 'Chưa cấu hình Supabase.', status: 500 }
  }

  let lastMessage = ''
  let lastStatus = 401

  for (const type of VERIFY_TYPES) {
    const result = await gotrue('verify', {
      type,
      email,
      token,
    })
    if (result.ok) return { ok: true }
    lastMessage = result.message
    lastStatus = result.status

    if (isNotConfirmed(result.message)) {
      await confirmEmailIfUnconfirmed(email)
      const retry = await gotrue('verify', { type, email, token })
      if (retry.ok) return { ok: true }
      lastMessage = retry.message
      lastStatus = retry.status
    }
  }

  return {
    error: mapOtpError(lastMessage, 'Mã không đúng hoặc đã hết hạn.'),
    status: lastStatus >= 400 && lastStatus < 500 ? lastStatus : 401,
  }
}
